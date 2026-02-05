import Link from "next/link";
import { Avatar } from "./Avatar";
import RoleBadge from "./RoleBadge";

export function ProfileView({ profile, isSelf }: { profile: any, isSelf?: boolean }) {
  return (
    <div className="max-w-xl mx-auto">
      <Avatar avatar={profile.avatar_url} name={profile.display_name} />

      <h1 className="text-2xl font-semibold mt-4">
        {profile.display_name}
      </h1>

      {profile.bio && (
        <p className="mt-2 text-gray-600">{profile.bio}</p>
      )}

      {profile.role && (
        <RoleBadge role={profile.role} />
      )}

      {isSelf && (
        <Link href="/profile/edit" className="btn-primary mt-6">
          Edit profile
        </Link>
      )}
    </div>
  )
}
