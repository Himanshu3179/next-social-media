import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Repeat2 } from 'lucide-react'
import { formatTimeAgo } from '@/lib/timeago'
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

const SinglePost = (
    { post, handleRePost }: { post: Post, handleRePost: (postId: string) => void }
) => {
    return (
        <Card className="w-[350px]
        
        ">
            <CardHeader>
                <CardTitle>
                    {post.author.name}
                </CardTitle>
                <CardDescription>
                    {post.author.email}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Image src={post.imageUri} alt="Post image" width={300} height={400} className='rounded-sm' />
                <p className='text-muted-foreground text-right mt-2'>{formatTimeAgo(post.createdAt)}</p>
            </CardContent>
            <CardFooter>
                <button onClick={
                    () => handleRePost(post.id)
                }
                    className='text-muted-foreground hover:text-green-600 transition duration-300 ease-in-out flex gap-1 text-sm'
                >
                    <Repeat2 size={20} />Repost
                </button>
            </CardFooter>
        </Card>
    )
}

export default SinglePost