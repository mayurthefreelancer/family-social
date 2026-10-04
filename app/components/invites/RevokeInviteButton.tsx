"use client";

import { useTransition } from "react";
import { revokeInvite } from "@/app/actions/invite";
import { Button } from "@/app/components/ui/Button";

export function RevokeInviteButton({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to revoke this invitation?")) {
          startTransition(async () => {
            await revokeInvite(token);
          });
        }
      }}
      className="text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:text-red-700 h-8 px-2.5 rounded-lg"
    >
      {isPending ? "Revoking..." : "Revoke"}
    </Button>
  );
}
