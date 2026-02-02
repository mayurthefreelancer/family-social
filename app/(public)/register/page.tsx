"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { register } from "@/app/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <AuthCard title="Create account" subtitle="Your private family space">
      <form action={action} className="space-y-4">
        <AuthField label="Name" name="name" required />
        <AuthField label="Email" name="email" type="email" required />
        <AuthField label="Password" name="password" type="password" required />

        {error && (
          <p className="text-sm text-[var(--color-danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="
            w-full rounded-md
            bg-[var(--color-accent)]
            py-2 text-sm text-white
          "
        >
          Create account
        </button>
      </form>

      <p className="text-sm text-center text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
