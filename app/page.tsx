import { redirect } from "next/navigation"
import { getSession } from "./lib/session"

export default async function HomePage() {
  const session = await getSession()

  if (session.userId) {
    redirect("/feed")
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold">
        Welcome to Family Social
      </h1>

      <p className="mt-4 text-gray-600">
        Create your private family space.
      </p>

      <div className="mt-8 space-x-4">
        <a href="/create-family" className="bg-black text-white px-4 py-2 rounded">
          Create Family
        </a>

        <a href="/login" className="border px-4 py-2 rounded">
          Login
        </a>
      </div>
    </div>
  )
}
