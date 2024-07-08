import AllPosts from "@/components/AllPosts"
import { buttonVariants } from "@/components/ui/button"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"

const Home = async () => {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  // if (!session) return (
  //   <div className="flex flex-col justify-center items-center gap-5">
  //     <p className="font-bold">Not logged in</p>
  //     <Link href="/sign-in"
  //       className={`${buttonVariants({ variant: 'default' })} mb-5`}
  //     >Sign in</Link>
  //   </div>
  // )

  return (
    <>
      <AllPosts userId={userId}/>
    </>
  )
}
export default Home;