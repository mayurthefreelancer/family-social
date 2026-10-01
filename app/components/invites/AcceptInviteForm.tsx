"use client";

import { useState } from "react";
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

  async function action(formData: FormData) {
    setPending(true);
    setError(null);

    try {
      await acceptInvite(token, formData);
      // success → redirect happens inside server action
    } catch (e: any) {
      setError(e.message ?? "Something went wrong while accepting your invitation.");
      setPending(false);
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

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 font-medium text-sm transition-all"
        >
          {pending ? "Joining Family..." : "Accept Invitation & Enter Living Room →"}
        </Button>
      </form>
    </AuthCard>
  );
}
