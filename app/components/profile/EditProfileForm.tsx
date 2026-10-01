import Link from "next/link";
import { updateProfile } from "@/app/actions/profile";
import { AvatarUploadForm } from "./AvatarUploadForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";

export function EditProfileForm({ profile }: { profile: any }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="rounded-[28px] border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Edit Family Profile
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Update how your relatives identify and connect with you.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar Upload */}
          <div className="p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Profile Portrait
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Shown next to your memories, recipes, and comments.
              </p>
            </div>
            <AvatarUploadForm
              avatar={profile.avatar_url}
              name={profile.display_name}
            />
          </div>

          {/* Profile Form Fields */}
          <form action={updateProfile} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="display_name" className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400">
                Display Name
              </Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile.display_name}
                required
                placeholder="e.g. Aunt Clara"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400">
                Username / Handle
              </Label>
              <Input
                id="username"
                name="username"
                defaultValue={profile.username ?? ""}
                required
                placeholder="e.g. clara"
                className="h-10 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-semibold uppercase text-zinc-600 dark:text-zinc-400">
                Bio / Favorite Family Note
              </Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio ?? ""}
                maxLength={160}
                rows={3}
                placeholder="A warm note about yourself or what you love doing for family get-togethers…"
              />
              <p className="text-[11px] text-zinc-400 text-right">
                Max 160 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              <Button
                type="submit"
                className="h-10 px-5 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold shadow-sm"
              >
                Save Changes
              </Button>

              <Link href="/profile">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full text-xs"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
