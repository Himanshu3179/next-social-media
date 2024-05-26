import ContactForm from '@/components/form/ContactForm'
import React from 'react'

const page = () => {
    return (
        <div className='p-6 rounded-md 
            bg-neutral-50/10
        w-full max-w-sm '>
            <ContactForm />
        </div>
    )
}

export default page