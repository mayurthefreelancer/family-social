"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { acceptInviteAuthenticated } from "@/app/actions/invite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

export function AuthenticatedJoinCard({
  token,
  familyName,
  userName,
  userEmail,
}: {
  token: string;
  familyName: string;
  userName?: string;
  userEmail?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { update } = useSession();

  async function handleJoin() {
    setLoading(true);
    setError(null);

    try {
      const res = await acceptInviteAuthenticated(token);
      if (!res.success) {
        setError(res.error ?? "Failed to join family sanctuary.");
        setLoading(false);
        return;
      }

      // Refresh session token so new family_id is active
      await update();
      window.location.href = "/feed";
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <Card className="text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="pt-8 pb-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-zinc-900 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 flex items-center justify-center text-zinc-50 dark:text-zinc-100 text-xl font-bold mb-3 shadow-sm">
          {familyName.charAt(0).toUpperCase()}
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Join {familyName}
        </CardTitle>
        <CardDescription className="text-sm mt-1.5 text-zinc-500 dark:text-zinc-400">
          You are signed in as <strong className="text-zinc-900 dark:text-zinc-100">{userName || userEmail}</strong>.
          Would you like to connect with this family sanctuary?
        </CardDescription>
      </CardHeader>

      {error && (
        <div className="px-6 pb-2">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      )}

      <CardFooter className="flex flex-col gap-2.5 pb-8 pt-4 px-6">
        <Button
          type="button"
          onClick={handleJoin}
          disabled={loading}
          className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-sm font-semibold shadow-sm transition-all"
        >
          {loading ? "Connecting to Family..." : `Accept & Enter ${familyName} →`}
        </Button>
      </CardFooter>
    </Card>
  );
}
