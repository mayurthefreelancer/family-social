"use client";

import { revokeInvite } from "@/app/actions/invite";

export function RevokeInviteButton({ token }: { token: string }) {
  return (
    <form
      action={async () => {
        await revokeInvite(token);
      }}
    >
      <button type="submit">Revoke</button>
    </form>
  );
}
