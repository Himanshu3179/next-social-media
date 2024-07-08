"use client"
import React from 'react'
import Image from 'next/image'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTimeAgo } from '@/lib/timeago';

import { useToast } from '@/components/ui/use-toast';


interface Comment {
    user: {
        id: string;
        username: string;
        profilePhoto: string | null;
    };
    id: string;
    userId: string;
    postId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

const OpenComments = (
    { postId }: { postId: string }
) => {
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const { toast } = useToast()

    const handleComment = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: comment })
            });
            const data = await response.json();
            if (!response.ok) {
                toast({
                    title: "Error",
                    description: data.message,
                    variant: 'destructive'
                })
            }


        } catch (error: any) {
            console.log("error:", error);
        }
        finally {
            setComment('');
            setLoading(false);
            fetchComments();
        }
    }


    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/posts/${postId}/comment`);
            console.log("hi");
            const data = await response.json();
            console.log(data);
            setComments(data);
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message,
            })
        }
    }

    // React.useEffect(() => {
    //     const pathname = window.location.pathname;
    //     console.log("pathname", pathname);
    //     if (pathname.includes('/post/')) {
    //         setIsOpen(true);
    //     }

    // }, []);

    React.useEffect(() => {
        fetchComments();
    }, [isOpen]);

    return (
        <div className='w-full '>
            <ScrollArea className="
                h-72    
                bg-neutral-50/10    
            rounded-md border">
                {comments.map(comment => (
                    <div key={comment.id} className='flex items-center gap-3 p-3'>
                        <Image src={comment.user.profilePhoto || '/default-profile.jpg'} alt={comment.user.username}
                            width={40}
                            height={40}
                            className='rounded-full mb-auto'
                        />
                        <div className=''>
                            <div className='flex gap-2'>
                                <span className='text-lg '>{comment.user.username}</span>
                                <span className='text-muted-foreground text'>{comment.content}</span>
                            </div>
                            <div>
                                <span className='text-muted-foreground font-semibold text-xs'>{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className='text-muted-foreground text-center '>No comments</p>
                )}
            </ScrollArea>
            <form className='flex items-center justify-between gap-2 mt-2'
                onSubmit={e => {
                    e.preventDefault();
                    handleComment();
                }}
            >
                <Input placeholder='Add a comment'
                    onChange={e => setComment(e.target.value)}
                    value={comment}

                />
                <Button
                    variant={'default'}
                    type='submit'
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Comment'}
                </Button>
            </form>
        </div>




    )
}

export default OpenComments