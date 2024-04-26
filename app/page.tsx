import AllPosts from "@/components/AllPosts"
import AllUsers from "@/components/AllUsers"
import FileUploadForm from "@/components/FileUploadForm"
import { buttonVariants } from "@/components/ui/button"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"

const Home = async () => {
  const session = await getServerSession(authOptions)

  if (!session) return (
    <div className="flex flex-col justify-center items-center gap-5">
      <p className="font-bold">Not logged in</p>
      <Link href="/sign-in"
        className={`${buttonVariants({ variant: 'default' })} mb-5`}
      >Sign in</Link>
    </div>
  )

  return (
    <>
      <AllPosts userId={session.user.id} />
    </>
  )
}
export default Home;