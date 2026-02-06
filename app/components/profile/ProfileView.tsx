import { Avatar } from "./Avatar";

import RoleBadge from "./RoleBadge";
import Link from "next/link";
import { Profile } from "@/app/lib/profile";

export function ProfileView({ profile, isSelf }: { profile: Profile; isSelf: boolean }) {
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

          {profile.username && (
            <p className="text-sm text-gray-500">
              @{profile.username}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <RoleBadge role={profile.role || "user"} />
          </div>
        </div>

        {isSelf && (
          <Link href="/profile/edit" className="btn-secondary">
            Edit
          </Link>
        )}
      </div>

      {profile.bio && (
        <p className="mt-4 text-gray-700 leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="mt-6 flex gap-6 text-sm text-gray-500">
        <span>Joined {formatDate(profile.created_at)}</span>
        <span>Posts {profile.post_count ?? 0}</span>
      </div>
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long" })
}
