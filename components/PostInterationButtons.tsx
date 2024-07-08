"use client"
import React from 'react'
import { VISIBILITY } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { CiShare1 } from "react-icons/ci";
import OpenComments from './OpenComments';
import { GoComment } from "react-icons/go";
import { IoClose } from "react-icons/io5";

interface Post {
    title: string;
    content: string | null;
    visibility: VISIBILITY;
    user: {
        username: string;
        profilePhoto: string | null;
    };
    id: string;
    imageUri: string | null;
    createdAt: Date;
    likes: {
        id: string;
        userId: string;
    }[];
}

const PostInterationButtons = (
    { post, userId }: { post: Post, userId: string | undefined }
) => {
    const [isLiked, setIsLiked] = React.useState(post.likes.some(like => like.userId === userId));
    const [likesCount, setLikesCount] = React.useState(post.likes.length);
    const [openComments, setOpenComments] = React.useState(false);
    const { toast } = useToast()
    const router = useRouter();

    const handleLike = async () => {
        // Optimistically update the UI
        setIsLiked(prevIsLiked => !prevIsLiked);
        setLikesCount(prevLikesCount => isLiked ? prevLikesCount - 1 : prevLikesCount + 1);
        try {
            const response = await fetch(`/api/posts/${post.id}/like`, {
                method: 'POST',
            });
            const newPost = await response.json();
            console.log(newPost);
            if (!response.ok) {
                toast({
                    title: "Error",
                    description: newPost.message,
                    variant: 'destructive'
                });

                // Rollback the UI changes
                setIsLiked(prevIsLiked => !prevIsLiked);
                setLikesCount(prevLikesCount => isLiked ? prevLikesCount + 1 : prevLikesCount - 1);
            }
        } catch (error) {
            console.error(error);
            // Rollback the UI changes
            setIsLiked(prevIsLiked => !prevIsLiked);
            setLikesCount(prevLikesCount => isLiked ? prevLikesCount + 1 : prevLikesCount - 1);
            toast({
                title: "Error",
                description: "An error occurred while liking the post",
                variant: 'destructive'
            });
        } finally {
            router.refresh();
        }

    }

    const copyPostUrl = async () => {
        const url = `${window.location.origin}/post/${post.id}`;
        await navigator.clipboard.writeText(url);
        toast({
            title: "Success",
            description: "Post URL copied to clipboard",
            variant: 'default'
        })
    }


    return (
        <>
            <div className='mt-2 flex justify-between'>
                <div className='flex gap-4 items-center'>

                    <button id="like-button" onClick={handleLike} className='flex gap-1 items-center transition-transform duration-150'>
                        {isLiked ? <IoMdHeart size={26} color='red' /> : <IoMdHeartEmpty size={26} />}
                        <span>{likesCount}</span>
                    </button>
                    <button onClick={copyPostUrl} className='flex gap-1 items-center '>
                        <CiShare1 size={26} />
                    </button>
                </div>
                <div className='cursor-pointer'>
                    {/* <GoComment size={24}
                        onClick={() => setOpenComments(prevOpenComments => !prevOpenComments)}
                    /> */}
                    {/* if not open comments the show goComments otherwise ioclose */}
                    {openComments ? (
                        <IoClose size={24}
                            onClick={() => setOpenComments(prevOpenComments => !prevOpenComments)}
                        />
                    ) : (
                        <>
                            <GoComment size={24}
                                onClick={() => setOpenComments(prevOpenComments => !prevOpenComments)}
                            />

                        </>
                    )}
                </div>

            </div>
            {
                openComments && (
                    <OpenComments
                        postId={post.id}
                    />
                )
            }
        </>
    )
}

export default PostInterationButtons