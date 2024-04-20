import React from 'react'
import db from '@/lib/db'
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/timeago';
const page = async (
    { params }: { params: { userId: string } }
) => {

    const fetUserDetails = async () => {
        try {
            const users = await db.user.findUnique({
                where: { id: params.userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    Post: {
                        orderBy: { createdAt: 'desc' }
                    },
                },
            });
            return users;
        } catch (error) {
            console.log(error);
            return null
        }
    }

    const user = await fetUserDetails();
    // console.log(user);
    if (!user) return (
        <div>User not found</div>
    )
    return (
        <div className='h-full w-full px-10 '>
            <div className='flex flex-col gap-1 my-5'>
                <h1 className='text-3xl font-bold'>{user.name}</h1>
                <p className='text-muted-foreground'>{user.email}</p>
            </div>
            <Link
                className={`${buttonVariants({ variant: 'default' })} mb-5`}
                href={`/upload`}
            > Upload</Link>
            <div className='
                    grid-cols-2
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    grid gap-5
                    pb-40
                '>
                {user.Post.map((post: any) => (
                    <div key={post.id} className='border flex flex-col justify-center items-center gap-3'>
                        <Image src={post.imageUri} alt={post.id}
                            width={200}
                            height={200}
                            priority
                            className='rounded-lg'
                        />
                        {/* use time ago */}
                        <div className='flex gap-2 text-muted-foreground '>
                            <p>{formatTimeAgo(post.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page
