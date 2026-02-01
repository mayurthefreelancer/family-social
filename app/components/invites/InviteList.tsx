import { RevokeInviteButton } from "./RevokeInviteButton";

type Invite = {
  token: string;
  expires_at: string;
  created_at: string;
};

export function InviteList({ invites }: { invites: Invite[] }) {
  if (invites.length === 0) {
    return <p>No active invites.</p>;
  }

  return (
    <ul>
      {invites.map((invite) => (
        <li key={invite.token}>
          <div>
            <strong>Expires:</strong>{" "}
            {new Date(invite.expires_at).toLocaleString()}
          </div>

          <div>
            <code>
              {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite.token}`}
            </code>
          </div>

          <RevokeInviteButton token={invite.token} />
        </li>
      ))}
    </ul>
  );
}
