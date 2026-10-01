"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { Button } from "@/app/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setResetUrl(null);

    const result = await requestPasswordReset(email);

    if (result.token) {
      setResetUrl(`/reset-password?token=${result.token}`);
      setMessage("Reset link generated successfully.");
    } else {
      setMessage("If an account matches that email, a reset link will be sent.");
    }

    setLoading(false);
  }

  return (
    <AuthCard
      title="Recover Access"
      subtitle="Enter your family email address to receive password reset instructions."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Email address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. eleanor@example.com"
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 font-medium text-sm transition-all"
        >
          {loading ? "Sending Instructions..." : "Send Reset Link"}
        </Button>
      </form>

      {message && (
        <div className="mt-4 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-750 text-xs space-y-2">
          <p className="text-zinc-700 dark:text-zinc-300">{message}</p>
          {resetUrl && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <Link
                href={resetUrl}
                className="font-medium text-zinc-900 dark:text-zinc-100 underline"
              >
                Click here to reset your password →
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 text-center text-xs">
        <Link
          href="/login"
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          ← Return to Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
