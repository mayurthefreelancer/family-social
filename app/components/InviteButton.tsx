// components/InviteButton.tsx
"use client";

import { createInvite } from "@/app/actions/invite";
import { useState } from "react";

export function InviteButton() {
  const [link, setLink] = useState<string | null>(null);

  return (
    <form
      action={async () => {
        const token = await createInvite();
        setLink(`${window.location.origin}/invite/${token}`);
      }}
    >
      <button type="submit">Generate Invite</button>

      {link && (
        <p>
          Invite link: <br />
          <code>{link}</code>
        </p>
      )}
    </form>
  );
}
