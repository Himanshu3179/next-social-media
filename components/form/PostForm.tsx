"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VISIBILITY } from '@prisma/client';
import { Loader2Icon } from 'lucide-react';
// const VISIBILITY: {
//   PUBLIC: "PUBLIC";
//   PRIVATE: "PRIVATE";
//   FRIENDS_ONLY: "FRIENDS_ONLY";
// }
const FormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content is too long'),
});

const PostForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // tab as visibility
  const [tab, setTab] = useState<VISIBILITY>(VISIBILITY.PUBLIC);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });


  const { toast } = useToast()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    handleSubmit();

  }


  const handleSubmit = async () => {
    setUploading(true);
    if (!file) {
      toast({
        title: "Error",
        description: "File is required",
        variant: 'destructive'
      })
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    // Get the form values
    const values = form.getValues();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('visibility', tab);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        toast({
          title: "Error",
          description: data.message,
          variant: 'destructive'
        })
      }

      else {
        toast({
          title: "Success",
          description: "Post created",
          variant: 'default'
        })
        router.push('/');
      }
    } catch (error) {
      console.error("error:", error);
      toast({
        title: "Error",
        description: "Error uploading file",
      })

    } finally {
      setUploading(false);
      setPreviewUrl(null);
      router.refresh()
    }
  };

  return (
    <div className='border p-5 max-w-lg mx-auto mt-10'>
      <Form {...form} >
        <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your title'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter your content'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <input
              type="file"
              className='border border-gray-800 rounded-md p-2 my-5 w-full'
              onChange={handleFileChange}
            />
          </div>
          <div className='my-2 w-full flex justify-center'>
            {previewUrl && <Image src={previewUrl} alt="File preview" width={"300"} height={"100"} />}
          </div>

          <div className='flex justify-evenly border p-1 bg-neutral-800 rounded-lg text-sm font-semibold'>
            <button
              type='button'
              onClick={() => setTab(VISIBILITY.PUBLIC)}
              className={`w-full p-1 rounded-md ${tab === VISIBILITY.PUBLIC ? 'bg-neutral-700' : 'bg-neutral-800'}`}
            >PUBLIC</button>
            <button
              type='button'
              onClick={() => setTab(VISIBILITY.PRIVATE)}
              className={`w-full p-1 rounded-md ${tab === VISIBILITY.PRIVATE ? 'bg-neutral-700' : 'bg-neutral-800'}`}
            >PRIVATE</button>
            <button
              type='button'
              onClick={() => setTab(VISIBILITY.FRIENDS_ONLY)}
              className={`w-full p-1 rounded-md ${tab === VISIBILITY.FRIENDS_ONLY ? 'bg-neutral-700' : 'bg-neutral-800'}`}
            >FRIENDS ONLY</button>
          </div>

          <Button
            className={`w-full mt-6 
            
            `}
            type='submit'
            disabled={form.formState.isSubmitting || uploading}
          >
            {
              uploading ? (
                <div className='flex items-center justify-center gap-3'>
                  <span>Uploading </span>
                  <Loader2Icon className='animate-spin' />
                </div>
              ) : 'Post'
            }
          </Button>
        </form>

      </Form>
    </div>
  )
}

export default PostForm