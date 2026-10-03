"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";
import { Button, buttonVariants } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";
import {
  Calendar,
  Edit3,
  ShieldCheck,
  KeyRound,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  requestPasswordResetCode,
  requestTagChange,
} from "@/app/actions/profile";

export function ProfileView({ profile }: { profile: any }) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [resetReason, setResetReason] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tagReason, setTagReason] = useState("");

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const formattedJoinDate = new Date(profile.created_at).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric", timeZone: "UTC" }
  );

  function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await requestPasswordResetCode(resetReason);
      if (res?.success) {
        setFeedback({
          text: `Password reset request submitted! SuperAdmin ticket #${res.ticketCode} has been logged.`,
          type: "success",
        });
        setShowResetModal(false);
        setResetReason("");
      } else {
        setFeedback({
          text: res?.error || "Failed to submit request.",
          type: "error",
        });
      }
    });
  }

  function handleTagSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTag.trim()) return;
    startTransition(async () => {
      const res = await requestTagChange(newTag, tagReason);
      if (res?.success) {
        setFeedback({
          text: `Tag change request for "${newTag}" submitted! SuperAdmin ticket #${res.ticketCode} logged.`,
          type: "success",
        });
        setShowTagModal(false);
        setNewTag("");
        setTagReason("");
      } else {
        setFeedback({
          text: res?.error || "Failed to submit request.",
          type: "error",
        });
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Profile Card with Panoramic Canopy Banner */}
      <Card className="rounded-[28px] border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Cover Banner */}
        <div className="relative h-32 sm:h-44 w-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-800 overflow-hidden">
          {profile.family_backdrop_url ? (
            <img
              src={profile.family_backdrop_url}
              alt="Family canopy banner"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-40">
              <span className="font-serif italic text-xs tracking-wider text-zinc-600 dark:text-zinc-300">
                {profile.family_name || "Kinship Living Room"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900/90 via-transparent to-transparent" />
        </div>

        {/* Profile Content with Overlapping Perfect Avatar Ring */}
        <div className="px-6 sm:px-8 pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            {/* Avatar with Perfect Geometric Double Ring */}
            <div className="relative shrink-0 w-fit">
              <div className="w-22 h-22 sm:w-26 sm:h-26 aspect-square rounded-full p-1 bg-white dark:bg-zinc-900 shadow-xl ring-4 ring-white dark:ring-zinc-900 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full rounded-full object-cover aspect-square"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-900 dark:bg-zinc-800 text-zinc-50 flex items-center justify-center font-bold text-2xl sm:text-3xl">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/profile/edit"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs",
                })}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile &amp; Avatar</span>
              </Link>
            </div>
          </div>

          {/* Identity & Tags */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {profile.display_name}
              </h1>

              {/* Tag with Change Button */}
              <div className="inline-flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="text-xs uppercase font-mono px-2.5 py-0.5 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                >
                  {profile.custom_tag || "KIN"}
                </Badge>
                <button
                  onClick={() => setShowTagModal(true)}
                  className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-700 cursor-pointer"
                  title="Request to change your family relation tag"
                >
                  Request change
                </button>
              </div>

              {profile.role === "admin" && (
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                >
                  Family Admin
                </Badge>
              )}
            </div>

            {profile.username && (
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                @{profile.username}
              </p>
            )}

            {profile.bio && (
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 pt-1 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Security & Password Reset Action Banner */}
          <div className="mt-6 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
                <span>Account Security &amp; Access</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Need a new temporary password? Request an authorized reset code from the platform SuperAdmin.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetModal(true)}
              className="rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer shrink-0"
            >
              Request Reset Code
            </Button>
          </div>

          {/* Metadata Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5" suppressHydrationWarning>
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Family member since {formattedJoinDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Sovereign Family Identity</span>
            </div>
          </div>
        </div>
      </Card>

      {/* ================= MODAL: REQUEST PASSWORD RESET CODE ================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50">
                  Request Password Reset Code
                </h3>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Submitting this request will automatically generate a high-priority governance ticket for the platform SuperAdmin to issue a verified password reset code for your account.
            </p>

            <form onSubmit={handleResetSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                  Reason or note for SuperAdmin (optional):
                </label>
                <textarea
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value)}
                  placeholder="e.g. Forgot current password on mobile device, please issue a reset authorization code."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetModal(false)}
                  className="rounded-full text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="rounded-full text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
                >
                  {isPending ? "Submitting..." : "Send Request to SuperAdmin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: REQUEST TAG CHANGE ================= */}
      {showTagModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50">
                  Request Family Tag Change
                </h3>
              </div>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Customize the relationship tag associated with your profile (currently <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{profile.custom_tag || "KIN"}</span>). This request will be submitted to the SuperAdmin for approval.
            </p>

            <form onSubmit={handleTagSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                  Proposed New Tag / Relation *:
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. Grandmother, Mother, Uncle, Grandson"
                  className="w-full h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 font-medium"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-zinc-400 self-center">Suggestions:</span>
                  {["Mother", "Father", "Grandmother", "Grandfather", "Son", "Daughter", "Uncle", "Aunt"].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewTag(s)}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-zinc-600 dark:text-zinc-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                  Additional Note (optional):
                </label>
                <textarea
                  value={tagReason}
                  onChange={(e) => setTagReason(e.target.value)}
                  placeholder="e.g. Updating my title for the new family generation tree."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTagModal(false)}
                  className="rounded-full text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || !newTag.trim()}
                  className="rounded-full text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 cursor-pointer"
                >
                  {isPending ? "Submitting..." : "Submit Tag Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
