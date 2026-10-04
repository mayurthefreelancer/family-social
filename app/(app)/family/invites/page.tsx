import { InviteList } from "@/app/components/invites/InviteList";
import GenerateInviteButton from "@/app/components/family/GenerateInviteButtons";
import { requireUser } from "@/app/lib/auth";
import { getUserFamilyWithRole } from "@/app/lib/family";
import { getActiveInvites } from "@/app/lib/invite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";

export default async function FamilyInvitesPage() {
  const user = await requireUser();
  const membership = await getUserFamilyWithRole(user.id);

  if (!membership || membership.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-2">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Access Restricted</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Only family organizers and admins have permission to generate and manage family invites.
        </p>
      </div>
    );
  }

  const invites = await getActiveInvites(membership.family_id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Family Invitations
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Generate secure links to welcome your relatives into this private family sanctuary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <GenerateInviteButton />
          </div>

          <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Active Invitations ({invites.length})
            </h3>
            <InviteList invites={invites} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
