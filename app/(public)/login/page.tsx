"use client";

import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthCard title="Sign in" subtitle="Access your family space">

      {/* Google OAuth — outside the credentials form so clicking it never triggers form submit */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full rounded-lg bg-zinc-800 text-white p-3 mb-4"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-4">
        <hr className="flex-1 border-[var(--color-border)]" />
        <span className="text-sm text-[var(--color-text-muted)]">or</span>
        <hr className="flex-1 border-[var(--color-border)]" />
      </div>

      {/* Credentials form — only handles email/password, Google button is above it */}
      <form
        action={async (formData) => {
          const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
          });

          if (result?.error) {
            setError("Invalid email or password");
          } else {
            window.location.href = "/";
          }
        }}
        className="space-y-4"
      >
        <AuthField label="Email" name="email" type="email" required />
        <AuthField label="Password" name="password" type="password" required />

        {error && (
          <p className="text-sm text-[var(--color-danger)]">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-[var(--color-accent)] py-2 text-sm text-[var(--color-text)]"
        >
          Sign in
        </button>
      </form>

      <p className="text-sm text-center text-[var(--color-text-muted)] mt-4">
        Don't have an account?{" "}
        <button className="text-[var(--color-accent)]" onClick={() => (window.location.href = "/register")}>
          <Link href="/register" className="hover:underline">
            Create one
          </Link>
        </button>
      </p>

      <p className="text-sm text-center text-[var(--color-text-muted)]">
        <Link href="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </p>
    </AuthCard>
  );
}