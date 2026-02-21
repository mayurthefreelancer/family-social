import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (!session.user.familyId) {
    redirect("/create-family");
  }

  redirect("/feed");

  return (
    <div className="max-w-3xl mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to Family Social
      </h1>

      <p className="mt-4 text-gray-600">
        Create your private family space.
      </p>

      <div className="mt-8 space-x-4">
        <a href="/create-family" className="border-2 border-zinc-600 text-red-400 px-4 py-2 rounded">
          Create Family
        </a>

        <a href="/login" className="border px-4 py-2 rounded">
          Login
        </a>
      </div>
    </div>
  )
}
