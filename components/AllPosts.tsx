"use client"
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import SinglePost from './SinglePost';
import { VISIBILITY } from '@prisma/client';
import PostInterationButtons from './PostInterationButtons';

import SinglePostSkeleton from './PostSkeleton';
import { ArrowDown } from 'lucide-react';

interface Post {
    title: string;
    content: string | null;
    visibility: VISIBILITY;
    user: {
        id: string;
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


const AllPosts = (
    { userId }: { userId: string }
) => {
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        setTake(searchParams.get("take") ? parseInt(searchParams.get("take") as string) : 10);
        setSkip(searchParams.get("skip") ? parseInt(searchParams.get("skip") as string) : 0);
    }, [searchParams]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/posts?take=${take}&skip=${skip}`);
            const data = await response.json();
            console.log(data);
            setPosts(prevPosts => [...prevPosts, ...data]);

        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchPosts();
    }, [take, skip]);

    const LoadMore = () => {
        setSkip(skip + take);
    }

    return (
        <div className='w-full h-full p-5 '>
            <div className='flex flex-col mt-5 gap-3 items-center w-full'>
                {
                    loading && (
                        <>
                            <SinglePostSkeleton />
                            <SinglePostSkeleton />
                        </>
                    )
                }
                {posts.map((post, index) => (
                    <>
                        <SinglePost key={index} post={post} userId={userId} />
                    </>
                ))}
                {
                    !loading && (
                        <button onClick={LoadMore}
                            className='bg-neutral-50/10 rounded-lg p-2 flex items-center gap-2
                                hover:bg-neutral-50/20
                            '
                        >
                            <ArrowDown />
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default AllPosts;