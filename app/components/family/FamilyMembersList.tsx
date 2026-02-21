import { FamilyMemberRow } from "./FamilyMembersRow";

type Member = {
  id: string;
  name: string;
  role: "admin" | "member";
};

export function FamilyMembersList({ members }: { members: Member[] }) {
  return (
    <div
      className="space-y-2"
    >
      {members.map((m) => (
        <FamilyMemberRow key={m.id} member={m} />
      ))}
    </div>
  );
}
