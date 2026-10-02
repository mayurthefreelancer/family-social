"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { acceptInvite } from "@/app/actions/invite";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { Button } from "@/app/components/ui/Button";

export default function AcceptInviteForm({
  token,
  familyName = "your family",
}: {
  token: string;
  familyName?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function action(formData: FormData) {
    setPending(true);
    setError(null);
    setStatusMessage(null);

    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;

    try {
      setStatusMessage("Verifying invitation and linking to family sanctuary...");
      const res = await acceptInvite(token, formData);

      if (!res.success) {
        setError(res.error ?? "Failed to accept invitation. Please try again.");
        setPending(false);
        setStatusMessage(null);
        return;
      }

      setStatusMessage("Establishing your secure family session...");

      // Automatically sign in the user to mint the NextAuth session cookie
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        // Fallback: Account created/linked, guide user to login
        window.location.href = `/login?message=Welcome+to+the+family!+Please+sign+in+to+enter.`;
      } else {
        // Direct entry into the family feed
        window.location.href = "/feed";
      }
    } catch (e: any) {
      setError(e.message ?? "Something went wrong while accepting your invitation.");
      setPending(false);
      setStatusMessage(null);
    }
  }

  return (
    <AuthCard
      title={`Join ${familyName}`}
      subtitle="You've been invited into your private family sanctuary. Set up your profile to enter."
    >
      <form action={action} className="space-y-4">
        <AuthField
          label="Your Full Name"
          name="name"
          placeholder="e.g. Uncle Raymond"
          required
        />

        <AuthField
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />

        <AuthField
          label="Choose Password"
          name="password"
          type="password"
          minLength={8}
          placeholder="At least 8 characters"
          required
        />
        <p className="text-[11px] text-zinc-400">
          Already have an account? Enter your existing email and password to connect seamlessly.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {statusMessage && !error && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 animate-pulse">
            {statusMessage}
          </div>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white font-medium text-sm transition-all"
        >
          {pending ? "Joining Family..." : "Accept Invitation & Enter Living Room →"}
        </Button>
      </form>
    </AuthCard>
  );
}
