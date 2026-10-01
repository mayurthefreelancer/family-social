import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import { Calendar, Edit3, ShieldCheck } from "lucide-react";

export function ProfileView({ profile }: { profile: any }) {
  const formattedJoinDate = new Date(profile.created_at).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" }
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="rounded-[28px] border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar
              src={profile.avatar_url ?? undefined}
              fallback={profile.display_name}
              size="lg"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {profile.display_name}
                </h1>
                <Badge variant="secondary" className="text-[10px] uppercase font-mono px-2 py-0.5">
                  Kin
                </Badge>
              </div>

              {profile.username && (
                <p className="text-xs text-zinc-400 font-mono">
                  @{profile.username}
                </p>
              )}

              {profile.bio && (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 pt-1 leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div>
            <Link href="/profile/edit">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Family member since {formattedJoinDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Verified Family Identity</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
