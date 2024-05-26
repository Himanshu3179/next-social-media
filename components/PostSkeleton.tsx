import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"

const SinglePostSkeleton = () => {
    return (
        <div className='flex flex-col gap-3 w-full max-w-[400px] min-w-[350px] rounded-lg backdrop-blur-lg bg-neutral-50/10'>
            <div className='flex flex-col gap-3 p-5 '>
                <div className='flex items-center gap-3 '>
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-500" />
                    <div>
                        <Skeleton className="h-4 w-24 bg-gray-500" />
                        <Skeleton className="h-4 w-20 bg-gray-500 mt-2" />
                    </div>
                    <Skeleton className="h-6 w-6 ml-auto bg-gray-500" />
                </div>
                <div className='flex flex-col '>
                    <Skeleton className="h-6 w-40 bg-gray-500" />
                    <Skeleton className="h-10 w-full bg-gray-500 mt-2" />
                </div>
                <Skeleton className="h-52 w-full rounded-lg bg-gray-500" />
                <div className='flex items-center gap-3 '>
                    <Skeleton className="h-6 w-6 bg-gray-500" />
                    <Skeleton className="h-6 w-6 bg-gray-500" />
                    <Skeleton className="h-6 w-6 bg-gray-500 ml-auto" />
                </div>
            </div>
        </div>
    )
}

export default SinglePostSkeleton