import { Headset, Home, PlusCircle, User, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const BottomBar = () => {
    const navLinks = [
        { name: 'Home', href: '/', icon: <Home /> },
        { name: 'All Users', href: '/allusers', icon: <Users /> },
        { name: 'Create Post', href: '/createpost', icon: <PlusCircle /> },
        { name: 'Contact Us', href: '/contact', icon: <Headset /> },
        { name: 'Profile', href: '/user', icon: <User /> },
    ]
    return (
        <div className='lg:hidden fixed bottom-1 w-fit  
        bg-neutral-50/10
            p-4 border-2 rounded-full px-10
        '>
            <div className='flex justify-center gap-10 items-center'>
                {
                    navLinks.map((link) => (
                        <Link href={link.href
                        } key={link.name} className='hover:text-blue-500'>
                            {link.icon}
                        </Link>
                    ))
                }

            </div>
        </div>
    )
}

export default BottomBar