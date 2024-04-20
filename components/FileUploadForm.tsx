"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';

const FileUploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const router = useRouter();

    const { toast } = useToast()
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/s3-upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (!response.ok) {
                toast({
                    title: "Error",
                    description: data.message,
                    variant: 'destructive'
                })
            }

            router.refresh();
        } catch (error) {
            console.error("error:", error);
            toast({
                title: "Error",
                description: "Error uploading file",
            })
        } finally {
            setUploading(false);
            setPreviewUrl(null);
        }
    };

    return (
        <div>
            <form className='flex  flex-col' onSubmit={handleSubmit}>
                <label className='flex flex-col text-center' htmlFor='file'>
                    Upload file:
                    <input
                        type="file"
                        className='border border-gray-300 rounded-md p-2 my-5'
                        onChange={handleFileChange}
                    />
                </label>
                <div className='my-2 w-full flex justify-center'>
                    {previewUrl && <Image src={previewUrl} alt="File preview" width={"300"} height={"100"} />}
                </div>
                <button
                    type="submit"
                    disabled={!file || uploading}
                    className={`bg-blue-500 text-white p-2 rounded-md ${!file || uploading ? 'cursor-not-allowed bg-blue-400' : 'hover:bg-blue-600'}`}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default FileUploadForm;