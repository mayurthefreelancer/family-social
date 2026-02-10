"use client"

import { uploadAvatar } from "@/app/actions/profile"
import { useActionState, useState } from "react"
import { AvatarPreviewInput } from "./AvatarPreviewInput"

export function AvatarUploadForm({
  avatar,
  name,
}: {
  avatar?: string | null
  name: string
}) {
  const [fileSelected, setFileSelected] = useState(false)
  const [state, formAction] = useActionState(async (_state: any, formData: FormData) => {
    return await uploadAvatar(formData)
  }, {})

  return (
    <form
      action={formAction}
      className="flex items-center gap-5"
    >
      <AvatarPreviewInput onFileSelect={() => setFileSelected(true)} />

      
      <div className="flex flex-col">
        <button
          type="submit"
          disabled={!fileSelected || (fileSelected.length === 0)}
          className={`mt-3 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm
            ${fileSelected
              ? "text-gray-700 hover:bg-gray-50"
              : "text-gray-400 cursor-not-allowed"
            }`}
        >
          Upload photo
        </button>

        {/* once successflu upload, reset the view */}
        {state?.success && (
          <p className="mt-2 text-sm text-green-600">
            Avatar uploaded successfully
          </p>
        )}
        {state?.error && (
          <p className="mt-2 text-sm text-red-600">
            {state.error}
          </p>
        )}
      </div>
    </form>
  )
}
