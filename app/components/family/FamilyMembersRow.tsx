import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";

type Member = {
  id: string;
  name: string;
  role: "admin" | "member";
  avatar_url?: string | null;
};

export function FamilyMemberRow({ member }: { member: Member }) {
  const isAdmin = member.role === "admin";

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition-colors">
      <div className="flex items-center gap-3.5">
        <Avatar
          src={member.avatar_url ?? undefined}
          fallback={member.name}
          size="md"
        />

        <div className="flex flex-col">
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
            {member.name}
          </span>

          <div className="mt-1">
            <Badge
              variant={isAdmin ? "default" : "secondary"}
              className="text-[10px] uppercase tracking-wider px-2 py-0.2"
            >
              {isAdmin ? "Admin / Organizer" : "Family Member"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="text-xs text-zinc-400 font-mono">
        Active Kin
      </div>
    </div>
  );
}
