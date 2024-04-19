import AllPosts from "@/components/AllPosts"
import AllUsers from "@/components/AllUsers"
import FileUploadForm from "@/components/FileUploadForm"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const Home = async () => {
  const session = await getServerSession(authOptions)


  if (!session) return (
    <div>Not logged in</div>
  )

  return (
    <>
      <AllPosts />
    </>
  )
}
export default Home;