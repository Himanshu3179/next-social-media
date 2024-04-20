"use client"
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import SinglePost from './SinglePost';

interface Post {
    id: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    imageUri: string;
    author: {
        email: string;
        name: string;
    }
}

const AllPosts = () => {
    const [take, setTake] = useState(10);
    const [skip, setSkip] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const searchParams = useSearchParams();

    const { toast } = useToast()
    useEffect(() => {
        setTake(searchParams.get("take") ? parseInt(searchParams.get("take") as string) : 10);
        setSkip(searchParams.get("skip") ? parseInt(searchParams.get("skip") as string) : 0);
    }, [searchParams]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`/api/posts?take=${take}&skip=${skip}`);
            const data = await response.json();
            console.log(data);
            setPosts(prevPosts => [...prevPosts, ...data]);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchPosts();
    }, [take, skip]);

    const handleRePost = async (postId: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}/repost`, {
                method: 'POST',
            });
            const newPost = await response.json();
            console.log(newPost);
            setPosts(prevPosts => [newPost, ...prevPosts]);
            window.scrollTo(0, 0);
            toast({
                title: "Success",
                description: "Post Reposted",
                variant: 'default'
            })

        } catch (error) {
            console.error(error);
        }
    }

    const LoadMore = () => {
        setSkip(skip + take);
    }

    return (
        <div className='w-full h-full p-5 '>
            <div className='flex flex-col mt-5 gap-3 items-center pb-64'>
                {posts.map((post, index) => (
                    <SinglePost key={index} post={post} handleRePost={handleRePost} />
                ))}
                <Button onClick={LoadMore} variant='default'>Load More</Button>
            </div>
        </div>
    )
}

export default AllPosts;