import React from 'react'
import db from '@/lib/db'
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/timeago';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
const page = async (
    { params }: { params: { userId: string } }
) => {

    const fetUserDetails = async () => {
        try {
            const data = await db.user.findUnique({
                where: { id: params.userId },
                select: {
                    id: true,
                    username: true,
                    createdAt: true,
                    posts: {
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            imageUri: true,
                            createdAt: true,
                        }
                    }
                },
            });
            return data;
        } catch (error) {
            console.log(error);
            return null
        }
    }

    const data = await fetUserDetails();
    // console.log(user);
    if (!data) return (
        <div>User not found</div>
    )
    const session = await getServerSession(authOptions);
    const idOfUser = session?.user.id;
    return (
        <div className='h-full w-full px-10 '>
            <div className='flex flex-col gap-1 my-5'>
                <h1 className='text-2xl font-bold'>{data.username}</h1>
                {/* post count */}
                <p className='text-muted-foreground'>{data.posts.length} posts</p>
            </div>

            {idOfUser === data.id && (
                <Link
                    className={`${buttonVariants({ variant: 'default' })} mb-5`}
                    href={`/createpost`}
                > Upload</Link>
            )}
            <div className='
                    grid-cols-2
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    grid gap-5
                    pb-40
                '>
                {data.posts.map(post => (
                    <Link href={`/post/${post.id}`} key={post.id}>
                        <div
                            className='
                            relative
                            flex
                            flex-col
                            gap-2
                            border
                            rounded-md
                            p-2
                            h-full
                        '
                        >
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-lg font-bold'>{post.title}</h2>
                                <p className='text-muted-foreground'>{formatTimeAgo(post.createdAt)}</p>
                            </div>
                            <Image
                                src={post.imageUri || '/default-image.jpg'}
                                alt='Post Image'
                                width={300}
                                height={300}
                                objectFit='cover'
                                className='rounded-md '
                            />

                        </div>
                    </Link>
                ))}
                {/* if no posts */}
                {data.posts.length === 0 && (
                    <div className='text-muted-foreground text-center'>No posts</div>
                )}
            </div>
        </div>
    )
}

export default page
