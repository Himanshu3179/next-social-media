import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation'

const page = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return (
        redirect('/sign-in')
    )
    else {
        const userId = session.user.id;
        redirect(`/user/${userId}`)
    }

}

export default page