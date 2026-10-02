"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { Button } from "@/app/components/ui/Button";
import { register } from "@/app/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatusText(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;

    try {
      setStatusText("Creating your family account...");
      const result = await register(formData);

      if (!result.success) {
        setError(result.error ?? "Failed to create account.");
        setLoading(false);
        setStatusText(null);
        return;
      }

      setStatusText("Signing you in automatically...");

      // Automatically sign in upon registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        window.location.href = "/login?message=Account+created!+Please+sign+in.";
      } else {
        // Direct transition into the Family Creation wizard
        window.location.href = "/create-family";
      }
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred.");
      setLoading(false);
      setStatusText(null);
    }
  }

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Join your loved ones in a private, quiet space built for memories."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Your Full Name"
          name="name"
          placeholder="e.g. Eleanor Vance"
          autoComplete="name"
          required
        />
        <AuthField
          label="Email address"
          name="email"
          type="email"
          placeholder="e.g. eleanor@example.com"
          autoComplete="email"
          required
        />
        <AuthField
          label="Choose Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {statusText && !error && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 animate-pulse">
            {statusText}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-medium text-sm transition-all"
        >
          {loading ? "Setting up..." : "Create Account & Continue →"}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 text-center text-xs">
        <p className="text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
