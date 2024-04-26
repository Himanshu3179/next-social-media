import React from 'react'
import db from '@/lib/db'
import Image from 'next/image';
import { formatTimeAgo } from '@/lib/timeago';
import { ScrollArea } from '@/components/ui/scroll-area';
import PostInterationButtons from '@/components/PostInterationButtons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SinglePost from '@/components/SinglePost';

// interface Post {
//     title: string;
//     content: string | null;
//     visibility: VISIBILITY;
//     user: {
//         id: string;
//         username: string;
//         profilePhoto: string | null;
//     };
//     id: string;
//     imageUri: string | null;
//     createdAt: string;
//     likes: {
//         id: string;
//         userId: string;
//     }[];
// }

const page = async (
    { params }: { params: { postId: string } }
) => {
    const { postId } = params;

    const fetPostDetails = async () => {
        try {
            const data = await db.post.findUnique({
                where: {
                    id: postId
                },
                select: {
                    title: true,
                    content: true,
                    visibility: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profilePhoto: true
                        }
                    },
                    id: true,
                    imageUri: true,
                    createdAt: true,
                    likes: {
                        select: {
                            id: true,
                            userId: true
                        }
                    }
                }
            })
            return data;
        } catch (error) {
            console.log(error);
            return null
        }
    }

    const data = await fetPostDetails();

    if (!data) return (
        <div>Post not found</div>
    )
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    return (
        <div className='mb-10'>
            <SinglePost
                post={data}
                userId={userId}
            />
        </div>
    )
}

export default page