"use client"

import { useState } from "react"

export function AvatarPreviewInput({
  onFileSelect,
}: {
  onFileSelect?: () => void
}) {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {preview && (
        <img
          src={preview}
          className="h-20 w-20 rounded-full object-cover"
        />
      )}

      <input
        type="file"
        name="avatar"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            setPreview(URL.createObjectURL(file))
            onFileSelect?.()
          }
        }}
      />
    </div>
  )
}
