"use client"

import { useState } from "react"
import { createFamilyAdmin } from "./action"
import { AuthCard } from "../components/auth/AuthCard"
import { AuthField } from "../components/auth/AuthField"

export default function CreateFamilyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    familyName: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await createFamilyAdmin(
      form.name,
      form.email,
      form.password,
      form.familyName
    )
    window.location.href = "/login"
  }

  return (
    <AuthCard title="Create Family" subtitle="Create a new family and become the admin.">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
        <AuthField label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <AuthField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <AuthField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <AuthField label="Family Name" value={form.familyName} onChange={(e) => setForm({ ...form, familyName: e.target.value })} />
        <button type="submit" className="w-full rounded-md
            bg-[var(--color-accent)]
            py-2 text-sm text-white">Create Family</button>
      </form>
    </AuthCard >
  )
}
