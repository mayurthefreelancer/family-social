import { updateProfile } from "@/app/actions/profile"
import { getMyProfile } from "@/app/lib/profile"

// app/profile/edit/page.tsx
export default async function EditProfilePage() {
  const profile = await getMyProfile()

  return (
    <form action={updateProfile} className="space-y-4">
      <input
        name="display_name"
        defaultValue={profile.display_name}
        required
      />

      <textarea
        name="bio"
        defaultValue={profile.bio ?? ""}
        maxLength={160}
      />

      <input
        name="avatar_url"
        defaultValue={profile.avatar_url ?? ""}
        placeholder="Avatar image URL"
      />

      <button type="submit" className="btn-primary">
        Save changes
      </button>
    </form>
  )
}
