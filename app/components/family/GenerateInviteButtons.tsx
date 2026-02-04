"use client";

import { generateInvite } from "@/app/actions/invite";
import { useState } from "react";

export default function GenerateInviteButton() {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);

    try {
      const token  = await generateInvite();
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
    <div className="space-y-2">
      <button
        onClick={onGenerate}
        disabled={loading}
        className="btn btn-primary bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-4 py-2 rounded-md text-white"
      >
        {loading ? "Generating..." : "Generate Invite"}
      </button>

      {inviteUrl && (
        <p className="text-sm text-green-600">
          Invite link copied to clipboard
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
