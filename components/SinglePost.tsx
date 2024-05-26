import Image from 'next/image'
import { formatTimeAgo } from '@/lib/timeago'
import { VISIBILITY } from '@prisma/client'
import PostInterationButtons from './PostInterationButtons'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { BsThreeDots } from "react-icons/bs";

interface Post {
    title: string;
    content: string | null;
    visibility: VISIBILITY;
    user: {
        id: string;
        username: string;
        profilePhoto: string | null;
    };
    id: string;
    imageUri: string | null;
    createdAt: Date;
    likes: {
        id: string;
        userId: string;
    }[];
}

const SinglePost = (
    { post, userId }: { post: Post, userId: string | undefined }
) => {
    return (
        <div className=' flex flex-col gap-3 max-w-[400px] rounded-lg backdrop-blur-lg
            bg-neutral-50/10
        '>
            <div className='flex flex-col gap-3 p-5 '>
                <div className='flex items-center gap-3 '>
                    <Link href={`/user/${post.user.id}`}>
                        <Image src={post.user.profilePhoto || '/default-profile.jpg'} alt={post.user.username}
                            width={50}
                            height={50}
                            className='rounded-full'
                        />
                    </Link>
                    <div>
                        <Link href={`/user/${post.user.id}`}>
                            <h1 className='text-lg font-bold'>{post.user.username}</h1>
                        </Link>
                        <p className='text-muted-foreground text-sm'>{formatTimeAgo(post.createdAt)}</p>
                    </div>
                    <Link href={`/post/${post.id}`} className='ml-auto'>
                        <BsThreeDots size={22} />
                    </Link>
                </div>
                <div className='flex flex-col '>
                    <h1 className='text-xl font-bold'>{post.title}</h1>
                    <p className='text-muted-foreground'>{post.content}</p>
                </div>
                {post.imageUri && (
                    <Image src={post.imageUri} alt={post.title}
                        className='rounded-lg'
                        width={400}
                        height={200}
                    />
                )}
                <PostInterationButtons post={post}
                    userId={userId}
                />
            </div>
        </div>
    )
}

export default SinglePost   