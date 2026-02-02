"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <AuthCard title="Sign in" subtitle="Access your family space">
      <form action={action} className="space-y-4">
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
          Sign in
        </button>
      </form>

      <p className="text-sm text-center text-[var(--color-text-muted)]">
        Don’t have an account?{" "}
        <Link href="/register" className="hover:underline">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}
