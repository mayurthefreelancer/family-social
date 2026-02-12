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

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            {profile.display_name}
          </h1>
          {profile.bio && (
            <p className="text-gray-600 mt-1">{profile.bio}</p>
          )}
          {profile.username && (
            <p className="text-gray-600 mt-1">@{profile.username}</p>
          )}
        </div>

        <Link href="/profile/edit" className="btn-secondary">
          Edit
        </Link>
      </div>
    </div>
  )
}
