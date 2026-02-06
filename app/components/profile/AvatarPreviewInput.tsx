"use client"

import { useState } from "react"

export function AvatarPreviewInput() {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <>
      {preview && (
        <img src={preview} className="h-20 w-20 rounded-full" />
      )}

      <input
        type="file"
        name="avatar"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) setPreview(URL.createObjectURL(file))
        }}
      />
    </>
  )
}
