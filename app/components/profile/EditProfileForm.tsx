import { updateProfile } from "@/app/actions/profile";
import { AvatarUploadForm } from "./AvatarUploadForm";

export function EditProfileForm({ profile }: { profile: any }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">
          Edit profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update how your family sees you
        </p>
      </div>

      {/* Preview existing avatar */}
      <div className="mb-8 flex items-center gap-6 justify-center">
        <div className="relative">
          <img
            src={profile.avatar_url ?? "/default-avatar.png"}
            alt={profile.display_name}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Upload new avatar */}
      <div className="mb-10">
        <AvatarUploadForm
          avatar={profile.avatar_url}
          name={profile.display_name}
        />
      </div>


      {/* Divider */}
      <div className="border-t mb-8" />

      {/* Profile Fields */}
      <form action={updateProfile} className="space-y-6">
        {/* Display name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display name
          </label>
          <input
            name="display_name"
            defaultValue={profile.display_name}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        {/* username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            name="username"
            defaultValue={profile.username}
            required
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            maxLength={160}
            rows={4}
            className="w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="A short note about you…"
          />
          <p className="mt-1 text-xs text-gray-400">
            Max 160 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            Save changes
          </button>

          <a
            href="/profile"
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
