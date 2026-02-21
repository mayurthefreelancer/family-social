import { ProfileView } from "@/app/components/profile/ProfileView"
import { getMemberProfile } from "@/app/lib/profile"

// app/members/[userId]/page.tsx
export default async function MemberProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = await params
  const profile = await getMemberProfile(userId)

  return (
    <ProfileView
      profile={profile}
      isSelf={false}
    />
  )
}
