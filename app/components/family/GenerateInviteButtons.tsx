"use client";

import { useState } from "react";
import { CheckCircle2, Plus, Loader2, ShieldCheck, User } from "lucide-react";
import { generateInvite } from "@/app/actions/invite";
import { Button } from "@/app/components/ui/Button";

export default function GenerateInviteButton() {
  const [role, setRole] = useState<"member" | "admin">("member");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);

    try {
      const token = await generateInvite({ role });
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
    <div className="space-y-4">
      {/* Role Picker Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Target Role:
        </span>
        <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700 text-xs">
          <button
            type="button"
            onClick={() => setRole("member")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              role === "member"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Family Member</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              role === "admin"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Co-Organizer / Admin</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onGenerate}
          disabled={loading}
          className="h-10 px-5 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Generate {role === "admin" ? "Admin" : "Member"} Invite Link</span>
            </>
          )}
        </Button>
      </div>

      {inviteUrl && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <div className="flex-1 truncate">
            <span className="font-semibold block">Invitation Generated &amp; Copied!</span>
            <span className="font-mono text-[11px] opacity-80 truncate block">{inviteUrl}</span>
          </div>
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
