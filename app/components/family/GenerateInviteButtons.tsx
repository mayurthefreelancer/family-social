"use client";

import { useState } from "react";
import { CheckCircle2, Link2, Plus, Loader2 } from "lucide-react";
import { generateInvite } from "@/app/actions/invite";
import { Button } from "@/app/components/ui/Button";

export default function GenerateInviteButton() {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);

    try {
      const token = await generateInvite();
      const url = `${window.location.origin}/invite/${token}`;
      setInviteUrl(url);
      await navigator.clipboard.writeText(url);
    } catch (e: any) {
      setError(e.message ?? "Failed to generate invite");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={onGenerate}
        disabled={loading}
        className="h-10 px-5 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Invite Link</span>
          </>
        )}
      </Button>

      {inviteUrl && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Invite link generated and copied to your clipboard! Share it with your relative.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
