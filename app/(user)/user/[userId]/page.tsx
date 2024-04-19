import React from 'react'
import db from '@/lib/db'
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
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
                    Post: true,
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
        <div className='h-full w-full px-10'>
            <div className='flex flex-col gap-1 my-5'>
                <h1 className='text-3xl font-bold'>{user.name}</h1>
                <p className='text-muted-foreground'>{user.email}</p>
            </div>
            <Link
                className={`${buttonVariants({ variant: 'default' })} mb-5`}
                href={`/upload`}
            > Upload</Link>
            <div className='
                    grid grid-cols-5 gap-4
                '>
                {user.Post.map((post: any) => (
                    <div key={post.id} className='border flex justify-center items-center'>
                        <Image src={post.imageUri} alt={post.id}
                            width={200}
                            height={200}
                            priority
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page


// {
//     id: 'clv51u9180000tgfwuvz7st0r',
//     name: 'donald',
//     email: 'a@gmail.com',
//     Post: [
//       {
//         id: '8ca37849-50d8-45c8-aef4-e3d48d962a96',
//         imageUri: 'https://image-gallery-storage.s3.amazonaws.com/myFolder/Screenshot from 2024-04-15 16-37-21.png',
//         authorId: 'clv51u9180000tgfwuvz7st0r',
//         createdAt: 2024-04-18T11:04:07.437Z,
//         updatedAt: 2024-04-18T11:04:07.437Z
//       }
//     ]
//   }