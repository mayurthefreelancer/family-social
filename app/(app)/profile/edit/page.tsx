import { uploadAvatar } from "@/app/actions/avatar"
import { updateProfile } from "@/app/actions/profile"
import { Avatar } from "@/app/components/profile/Avatar"
import { getMyProfile } from "@/app/lib/profile"
import Link from "next/link"

export default async function EditProfilePage() {
  const profile = await getMyProfile()

  return (
    <div className="max-w-xl mx-auto px-4">
      <h1 className="text-xl font-semibold mb-6">
        Edit profile
      </h1>

      {/* Avatar */}
      <form
        action={uploadAvatar}
        encType="multipart/form-data"
        className="flex items-center gap-4 mb-8"
      >
        <Avatar
          avatar={profile.avatar_url}
          name={profile.display_name}
          size="lg"
        />

        <div>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="text-sm"
          />
          <button className="btn-secondary mt-2">
            Change photo
          </button>
        </div>
      </form>

      {/* Profile fields */}
      <form action={updateProfile} className="space-y-6">
        <div>
          <label className="label">Display name</label>
          <input
            name="display_name"
            defaultValue={profile.display_name}
            required
            className="input"
          />
        </div>

        <div>
          <label className="label">
            Bio <span className="text-gray-400">(160)</span>
          </label>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            maxLength={160}
            rows={4}
            className="textarea"
          />
        </div>

        <div>
          <label className="label">
            Username <span className="text-gray-400">(optional)</span>
          </label>
          <input
            name="username"
            defaultValue={profile.username ?? ""}
            className="input"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            Save changes
          </button>

          <Link href="/profile" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
