"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { Button } from "@/app/components/ui/Button";
import { createFamily } from "./action";

export default function CreateFamilyPage() {
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!familyName.trim()) {
      setError("Please provide a family name.");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await createFamily(familyName.trim());

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Refresh JWT session so familyId and role are updated
    await update();

    // Hard navigation so the server re-evaluates the fresh cookie
    window.location.href = "/feed";
  }

  return (
    <AuthCard
      title="Establish Your Family Hearth"
      subtitle="Name your family sanctuary. Once created, you can invite your grandparents, parents, children, and siblings."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <AuthField
            label="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="e.g. The Hawthorne Family"
            autoFocus
            required
          />
          <p className="mt-1.5 text-[11px] text-zinc-400">
            Suggested: &ldquo;The Sterling Family&rdquo;, &ldquo;Vance &amp; Kin&rdquo;, &ldquo;The Morrison Clan&rdquo;
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !familyName.trim()}
          className="w-full h-11 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 font-medium text-sm transition-all"
        >
          {loading ? "Creating Family Space..." : "Open Family Living Room →"}
        </Button>
      </form>
    </AuthCard>
  );
}