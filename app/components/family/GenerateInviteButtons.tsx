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
        className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
