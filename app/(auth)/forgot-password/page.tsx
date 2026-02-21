"use client"

import { useState } from "react"
import { requestPasswordReset } from "./actions"
import { AuthCard } from "@/app/components/auth/AuthCard"
import { AuthField } from "@/app/components/auth/AuthField"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const result = await requestPasswordReset(email)

    if (result.token) {
      setMessage(
        `Reset link: http://localhost:3000/reset-password?token=${result.token}`
      )
    }

  }

  return (
    <AuthCard title="Forgot Password" subtitle="Request a password reset link">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Email" name="email" type="email" onChange={(e) => setEmail(e.target.value)}
          placeholder="enter your email to send reset link..." required />

        <button
          type="submit"
          className="
            w-full rounded-md
            bg-[var(--color-accent)]
            py-2 text-sm text-[var(--color-text)]
          "
        >
          Send Reset Link
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </AuthCard>
  )
}
