import { InviteList } from "@/app/components/invites/InviteList";
import { requireUser } from "@/app/lib/auth";
import { getUserFamilyWithRole } from "@/app/lib/family";
import { getActiveInvites } from "@/app/lib/invite";


export default async function FamilyInvitesPage() {
  const userId = await requireUser();
  const membership = await getUserFamilyWithRole(userId);

  if (!membership || membership.role !== "admin") {
    return <p>You do not have permission to view invites.</p>;
  }

  const invites = await getActiveInvites(membership.family_id);

  return (
    <div>
      <h1>Active Invites</h1>
      <InviteList invites={invites} />
    </div>
  );
}
