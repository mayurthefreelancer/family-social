"use client";

import { useState } from "react";
import { ClipboardCheck, ClipboardCopy, Link2 } from "lucide-react";
import { RevokeInviteButton } from "./RevokeInviteButton";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";

type Invite = {
  token: string;
  expires_at: string;
  created_at: string;
};

export function InviteList({ invites }: { invites: Invite[] }) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  function copyToClipboard(token: string) {
    const inviteLink = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  if (invites.length === 0) {
    return (
      <div className="py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-500">
        No active invitation links. Generate one above to welcome a relative.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {invites.map((invite) => {
        const isCopied = copiedToken === invite.token;
        const expiresDate = new Date(invite.expires_at).toLocaleDateString(
          undefined,
          { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
        );

        return (
          <div
            key={invite.token}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 text-xs"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                  Expires {expiresDate}
                </Badge>
                {isCopied && (
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Copied to clipboard!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 font-mono text-zinc-500 dark:text-zinc-400 truncate text-[11px]">
                <Link2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/invite/${invite.token}`
                    : `/invite/${invite.token}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(invite.token)}
                className="h-8 px-2.5 rounded-lg text-xs flex items-center gap-1.5"
              >
                {isCopied ? (
                  <>
                    <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </Button>
              <RevokeInviteButton token={invite.token} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
