"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { Button } from "@/app/components/ui/Button";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <AuthCard
      title="Welcome Home"
      subtitle="Sign in to step into your family's digital living room."
    >
      {/* Credentials form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <AuthField
          label="Email address"
          name="email"
          type="email"
          placeholder="e.g. grandpa.arthur@example.com"
          autoComplete="email"
          required
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-medium text-sm transition-all"
        >
          {loading ? "Signing in..." : "Sign in to Family"}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-2 text-center text-xs">
        <p className="text-zinc-500 dark:text-zinc-400">
          New to the family?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            Create account
          </Link>
        </p>
        <p>
          <Link
            href="/forgot-password"
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}