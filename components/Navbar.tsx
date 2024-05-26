import { ListTodo } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignInButton, SignOutButton } from './ui/NavButtons'
import { Badge } from '@/components/ui/badge'
import { Headset, Home, PlusCircle, User, Users } from 'lucide-react'
import LogoButton from './LogoButton'

export const Navbar = async () => {
    const navLinks = [
        { name: 'Home', href: '/', icon: <Home /> },
        { name: 'All Users', href: '/allusers', icon: <Users /> },
        { name: 'Create Post', href: '/createpost', icon: <PlusCircle /> },
        { name: 'Contact Us', href: '/contact', icon: <Headset /> },
        { name: 'Profile', href: '/user', icon: <User /> },
    ]
    const session = await getServerSession(authOptions);
    return (
        <div className='w-full h-12  items-center px-6
            bg-neutral-50/10
            backdrop-blur-2xl
            
            

             text-white
            flex gap-5
            justify-between
            fixed top-0 left-0
            z-50
        '>
            <div className='flex justify-start cursor-pointer shrink-0'>
                <Link href='/' >
                    <LogoButton />
                </Link>

            </div>
            <div className='hidden lg:flex gap-10 justify-center grow m-auto '>
                {
                    navLinks.map((link) => (
                        <Link href={link.href} key={link.name} className='hover:text-blue-500
                            flex  justify-center items-center gap-1 
                        '>
                            {link.icon}
                            {link.name}
                        </Link>
                    ))
                }
            </div>


            <div className='flex justify-end items-center gap-3'>
                {
                    session ? (
                        <>
                            <Badge >{session.user.username}</Badge>
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