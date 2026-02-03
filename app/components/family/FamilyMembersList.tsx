import { FamilyMemberRow } from "./FamilyMembersRow";

type Member = {
  id: string;
  name: string;
  role: "admin" | "member";
};

export function FamilyMembersList({ members }: { members: Member[] }) {
  return (
    <div
      className="
        rounded-md
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        divide-y divide-[var(--color-border)]
      "
    >
      {members.map((m) => (
        <FamilyMemberRow key={m.id} member={m} />
      ))}
    </div>
  );
}
