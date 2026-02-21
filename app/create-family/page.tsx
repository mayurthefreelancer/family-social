"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AuthCard } from "../components/auth/AuthCard"
import { AuthField } from "../components/auth/AuthField"
import { createFamily } from "./action"

export default function CreateFamilyPage() {
  const [familyName, setFamilyName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { update } = useSession()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await createFamily(familyName)

    if (!result.success) {
      // Show the actual error — no silent swallowing
      setError(result.error ?? "Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    // Family created in DB — refresh JWT so token.familyId is populated
    await update()

    // Hard navigation so the server re-reads the fresh cookie
    // router.push() can use a cached layout; window.location forces a full round-trip
    window.location.href = "/feed"
  }

  return (
    <AuthCard title="Create Family" subtitle="Set up your private family space.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Family Name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[var(--color-accent)] py-2 text-sm text-[var(--color-text)] disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Family"}
        </button>
      </form>
    </AuthCard>
  )
}