"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { resetPassword } from "./actions";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { Button } from "@/app/components/ui/Button";

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!password) {
      setStatus({ type: "error", message: "Password is required." });
      return;
    }

    if (password.length < 8) {
      setStatus({
        type: "error",
        message: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (!token) {
      setStatus({
        type: "error",
        message: "Invalid or missing password reset token.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    const result = await resetPassword(token, password);

    if (result.success) {
      setStatus({
        type: "success",
        message: "Password reset successfully. You can now sign in.",
      });
    } else {
      setStatus({
        type: "error",
        message: result.error || "Failed to reset password.",
      });
    }

    setLoading(false);
  }

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Choose a secure password for your family account."
    >
      {status?.type === "success" ? (
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
            {status.message}
          </div>
          <Link href="/login">
            <Button className="w-full h-11 rounded-xl">
              Proceed to Sign in →
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField
            label="New Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          <AuthField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />

          {status?.type === "error" && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
              {status.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-medium text-sm transition-all"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </Button>

          <div className="pt-2 text-center text-xs">
            <Link
              href="/login"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              ← Cancel and Return to Sign in
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-zinc-500">
          Loading recovery form...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
