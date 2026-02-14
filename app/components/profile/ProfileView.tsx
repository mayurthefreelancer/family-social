import { Avatar } from "./Avatar"
import Link from "next/link"

export function ProfileView({ profile }: { profile: any }) {
  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="flex items-center gap-4">
        <Avatar
          avatar={profile.avatar_url}
          name={profile.display_name}
          size="lg"
        />

        <div className="flex-1 min-w-0 overflow-hidden py-2 text-left sm:py-4 sm:text-left sm:gap-4 sm:flex-row sm:items-center
           space-y-1">
          <h1 className="">
            {profile.display_name}
          </h1>
          {profile.bio && (
            <p className="text-gray-600 mt-1">{profile.bio}</p>
          )}
          {profile.username && (
            <p className="text-gray-600 mt-1">@{profile.username}</p>
          )}
        </div>

        <Link href="/profile/edit" className="text-sm text-blue-600 hover:underline">
          Edit
        </Link>
      </div>
      <div>
        {/* Additional profile details can go here */}
        <span className="text-sm text-gray-500">Joined on {new Date(profile.created_at).toLocaleDateString()}</span>
        <br />

      </div>
      <span>Posts by the user will appear here.</span>
    </div>
  )
}
