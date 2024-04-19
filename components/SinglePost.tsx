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
            </CardContent>
            <CardFooter>
                <Button onClick={
                    () => handleRePost(post.id)
                }>Re Post</Button>
            </CardFooter>
        </Card>
    )
}

export default SinglePost