import { ListTodo } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignInButton, SignOutButton } from './ui/NavButtons'
import { Badge } from '@/components/ui/badge'

export const Navbar = async () => {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Profile', href: '/user' },
        { name: 'Upload', href: '/upload' }
    ]
    const session = await getServerSession(authOptions);
    return (
        <div className='w-full h-12 bg-neutral-800 items-center px-6
             text-white
            flex gap-5
            justify-between
            fixed top-0 left-0
        '>
            <div className='flex justify-start cursor-pointer shrink-0	'>
                <Link href='/'>
                    <ListTodo />
                </Link>

            </div>
            <div className='flex gap-5 justify-center grow m-auto'>
                {
                    navLinks.map((link) => (
                        <Link href={link.href} key={link.name} className='hover:text-blue-500'>
                            {link.name}
                        </Link>
                    ))
                }
            </div>
            <div className='flex justify-end items-center gap-3'>
                {
                    session ? (
                        <>
                            <Badge >{session.user.name}</Badge>
                            <SignOutButton />
                        </>
                    ) : (
                        <SignInButton />
                    )
                }
            </div>
        </div>
    )
}