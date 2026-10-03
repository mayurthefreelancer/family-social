import { FamilyMemberRow } from "./FamilyMembersRow";

type Member = {
  id: string;
  name: string;
  role: "admin" | "member";
};

export function FamilyMembersList({
  members,
  isViewerAdmin,
  currentUserId,
}: {
  members: Member[];
  isViewerAdmin?: boolean;
  currentUserId?: string;
}) {
  return (
    <div className="space-y-2">
      {members.map((m) => (
        <FamilyMemberRow
          key={m.id}
          member={m}
          isViewerAdmin={isViewerAdmin}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
