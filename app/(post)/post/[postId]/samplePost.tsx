import React from 'react'
import db from '@/lib/db'
import Image from 'next/image';
import { formatTimeAgo } from '@/lib/timeago';
import { ScrollArea } from '@/components/ui/scroll-area';
import PostInterationButtons from '@/components/PostInterationButtons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
const page = async (
    { params }: { params: { postId: string } }
) => {
    const { postId } = params;

    const fetPostDetails = async () => {
        try {
            const data = await db.post.findUnique({
                where: { id: postId },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    imageUri: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profilePhoto: true,
                        }
                    },
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    profilePhoto: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }

                    }
                },
                // desc

            });
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
    const session = await getServerSession(authOptions)
    const userId = session?.user.id;
    return (
        <div className='lg:h-[600px]  flex lg:flex-row flex-col '>
            <div className='lg:border-r p-3'>
                <ScrollArea className="h-[550px] w-[400px] rounded-md">
                    <h1 className='text-2xl font-bold'>{data.title}</h1>
                    <p className='mt-1'>{data.content}</p>
                    <Image src={data.imageUri || '/default-post.png'} alt={data.title}
                        className='rounded-lg mt-3'
                        width={400}
                        height={400}
                    />
                </ScrollArea>
            </div>
            <div className='w-[400px] mx-auto'>
                <div className='flex items-center gap-3 border-t border-b p-3'>
                    <Image src={data.user.profilePhoto || '/default-profile.jpg'}
                        alt={data.user.username}
                        width={40}
                        height={40}
                        className='rounded-full'
                    />
                    <p className='font-bold'>{data.user.username}</p>
                </div>
                <ScrollArea className="h-[400px] w-full rounded-md mt-2 bg-neutral-800">
                    {data.comments.map(comment => (
                        <div key={comment.id} className='flex items-center gap-3 p-3'>
                            <Image src={comment.user.profilePhoto || '/default-profile.jpg'} alt={comment.user.username}
                                width={40}
                                height={40}
                                className='rounded-full mb-auto'
                            />
                            <div className=''>
                                <span className='text-lg font-bold'>{comment.user.username}</span>
                                <span>{" "}</span>
                                <span className='text-muted-foreground'>{comment.content}</span>
                                <div>
                                    <span className='text-muted-foreground font-semibold text-sm'>{formatTimeAgo(comment.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div>
    )
}

export default page