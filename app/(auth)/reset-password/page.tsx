"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { resetPassword } from "./actions"
import { AuthCard } from "@/app/components/auth/AuthCard"
import { AuthField } from "@/app/components/auth/AuthField"

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const token = params.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!password) {
      setMessage("Password is required")
      return
    }

    if (password.length < 4) {
      setMessage("Password must be at least 4 characters long")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }
    if (!token) {
      setMessage("Invalid token")
      return
    }

    const result = await resetPassword(token, password)

    if (result.success) {
      setMessage("Password reset successful. You can now login.")
    } else {
      setMessage(result.error || "Something went wrong")
    }
  }

  return (


    <AuthCard title="Reset Password" subtitle="Enter your new password below">
      <form onSubmit={handleSubmit} className="space-y-4">
       <AuthField label="Password" name="password" type="password" onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password..." required />
        <AuthField label="Confirm Password" name="confirmPassword" type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button
          type="submit"
          className="
            w-full rounded-md
            bg-[var(--color-accent)]
            py-2 text-sm text-white
          "
        >
          Reset Password
        </button>
       </form>

      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </AuthCard>
  )
}
