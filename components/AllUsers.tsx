import React from 'react'
import db from '../lib/db'
import Link from 'next/link';
import Image from 'next/image';
const AllUsers = async () => {
    const fetchUsers = async () => {
        try {
            const users = await db.user.findMany({
                select: {
                    id: true,
                    username: true,
                    createdAt: true,
                    posts: {
                        select: {
                            id: true
                        }
                    },
                    comments: {
                        select: {
                            id: true
                        }
                    },
                    profilePhoto: true
                },
            });
            return users;
        } catch (error) {
            console.log(error);
            return []
        }

    }

    const users = await fetchUsers();


    return (

        <div className='border p-5 w-full h-full'>
            <h1 className='text-2xl font-bold'>All Users</h1>
            <div className='flex flex-col gap-3'>
                {users.map(user => (
                    <Link key={user.id} href={`/user/${user.id}`}>
                        <div className='flex items-center gap-3 p-3 border rounded-lg'>
                            <Image src={user.profilePhoto || '/default-profile.jpg'} alt={user.username} className='rounded-full' width={50} height={50} />
                            <div>
                                <h1 className='text-lg font-bold'>{user.username}</h1>
                                <p className='text-muted-foreground'>{user.posts.length} posts</p>
                                <p className='text-muted-foreground'>{user.comments.length} comments</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default AllUsers