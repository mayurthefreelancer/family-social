"use client";

import { useState, useTransition } from "react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { UserX, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { requestMemberRemoval } from "@/app/actions/family";

type Member = {
  id: string;
  name: string;
  role: "admin" | "member";
  avatar_url?: string | null;
};

export function FamilyMemberRow({
  member,
  isViewerAdmin,
  currentUserId,
}: {
  member: Member;
  isViewerAdmin?: boolean;
  currentUserId?: string;
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isAdmin = member.role === "admin";
  const canRequestRemoval = isViewerAdmin && member.id !== currentUserId;

  function handleRemovalSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await requestMemberRemoval(member.id, reason);
      if (res?.success) {
        setFeedback({
          type: "success",
          message: `Removal request ticket #${res.ticketCode} sent to SuperAdmin!`,
        });
        setShowConfirmModal(false);
        setReason("");
      } else {
        setFeedback({
          type: "error",
          message: res?.error || "Failed to submit removal request.",
        });
      }
    });
  }

  return (
    <>
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors">
        <div className="flex items-center gap-3.5">
          <Avatar
            src={member.avatar_url ?? undefined}
            fallback={member.name}
            size="md"
          />

          <div className="flex flex-col">
            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
              {member.name}
              {member.id === currentUserId && (
                <span className="ml-2 text-[10px] text-zinc-400 font-normal">
                  (You)
                </span>
              )}
            </span>

            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant={isAdmin ? "default" : "secondary"}
                className="text-[10px] uppercase tracking-wider px-2 py-0.2"
              >
                {isAdmin ? "Admin / Organizer" : "Family Member"}
              </Badge>

              {feedback && (
                <span
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    feedback.type === "success"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {feedback.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canRequestRemoval && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              className="text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/40 rounded-full h-8 px-3 flex items-center gap-1.5 cursor-pointer"
              title="Request member removal via SuperAdmin"
            >
              <UserX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Request Removal</span>
            </Button>
          )}

          {!canRequestRemoval && (
            <div className="text-xs text-zinc-400 font-mono">
              Active Kin
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal to Raise SuperAdmin Ticket */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50">
                  Request Member Removal
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              As Family Admin, you are raising a governance request to remove{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{member.name}</strong>{" "}
              from this family sanctuary. A ticket will be automatically created for the SuperAdmin to execute this action.
            </p>

            <form onSubmit={handleRemovalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-700 dark:text-zinc-300 font-semibold block mb-1">
                  Reason for removal request *:
                </label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Account inactive, changed email address, or relative requested departure."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-full text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || !reason.trim()}
                  className="rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  {isPending ? "Submitting..." : "Submit Removal Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
