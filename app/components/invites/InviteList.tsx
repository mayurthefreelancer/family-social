'use client';
import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { RevokeInviteButton } from "./RevokeInviteButton";
import { useState } from "react";

type Invite = {
  token: string;
  expires_at: string;
  created_at: string;
};

export function InviteList({ invites }: { invites: Invite[] }) {
  const [inviteCopied, setInviteCopied] = useState(false);
  function copyToClipboard(token: string) {
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${token}`;
    // manage for mobile as well
    navigator.clipboard.writeText(inviteLink);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000); // Reset after 2 seconds
    // show toast notification
    // future debt: replace with a proper toast notification system
  }

  return (
    <ul>
      {invites.map((invite) => (
        <li key={invite.token}>
          <div>
            <strong>Expires:</strong>{" "}
            {new Date(invite.expires_at).toLocaleString()}
          </div>

          <div className=" flex items-center justify-between">
            <code className="text-sm text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap">
              {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite.token}`}
            </code>
            {/* copy clipboard button */}
            <button className="ml-2 text-xs text-[var(--text-secondary)] hover:underline" onClick={() => copyToClipboard(invite.token)}>
              {inviteCopied ? <ClipboardCheck size={18} color="green" className="rounded-sm" /> : <ClipboardCopy size={16} />}
            </button>
            {inviteCopied && <span className="ml-1 text-xs text-green-500">Copied!</span> }
          </div>


          <RevokeInviteButton token={invite.token} />
        </li>
      ))}
    </ul>
  );
}
