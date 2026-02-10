import { getMyProfile } from "@/app/lib/profile"
import { EditProfileForm } from "@/app/components/profile/EditProfileForm"

export default async function EditProfilePage() {
  const profile = await getMyProfile()
  return <EditProfileForm profile={profile} />
}
