import { ProfileView } from "@/app/components/profile/ProfileView"
import { getMyProfile } from "@/app/lib/profile"

// app/profile/page.tsx
export default async function ProfilePage() {
  const profile = await getMyProfile()

  return (
    <ProfileView
      profile={profile}
      isSelf
    />
  )
}
