import React from 'react'
import db from '../lib/db'
import Link from 'next/link';
const AllUsers = async () => {

    const fetchUsers = async () => {
        try {
            const users = await db.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
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
            <div className='flex flex-col mt-5'>
                {users.map((user: any) => (
                    <Link key={user.id}
                        href={`/user/${user.id}`}
                        className='border p-3 my-2
                        hover:bg-neutral-800   
                        transition duration-300 ease-in-out
                    '>
                        <p className='font-bold'>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default AllUsers