import { FamilyMembersList } from "@/app/components/family/FamilyMembersList";
import { requireUser } from "@/app/lib/auth";
import { getFamilyMembers } from "@/app/lib/family";


export default async function FamilyMembersPage() {
  const user = await requireUser();
  const members = await getFamilyMembers(user.family_id);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-lg font-medium">
          Family members
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          People who have access to this family space
        </p>
      </header>

      <FamilyMembersList members={members} />
    </section>
  );
}
