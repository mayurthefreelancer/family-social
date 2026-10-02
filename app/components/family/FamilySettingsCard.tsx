"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Badge } from "@/app/components/ui/Badge";
import {
  updateFamilyInfo,
  uploadFamilyAvatar,
  uploadFamilyBackdrop,
} from "@/app/actions/family";
import {
  Building2,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  ShieldAlert,
} from "lucide-react";

interface FamilySettingsCardProps {
  family: {
    id: string;
    name: string;
    description: string | null;
    avatarUrl: string | null;
    backdropUrl: string | null;
  };
}

export function FamilySettingsCard({ family }: FamilySettingsCardProps) {
  const router = useRouter();

  // Family Info State
  const [name, setName] = useState(family.name);
  const [description, setDescription] = useState(family.description ?? "");
  const [infoStatus, setInfoStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [isPendingInfo, startTransitionInfo] = useTransition();

  // Family Avatar State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    family.avatarUrl
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [isPendingAvatar, startTransitionAvatar] = useTransition();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Family Backdrop State
  const [backdropPreview, setBackdropPreview] = useState<string | null>(
    family.backdropUrl
  );
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [backdropStatus, setBackdropStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [isPendingBackdrop, startTransitionBackdrop] = useTransition();
  const backdropInputRef = useRef<HTMLInputElement>(null);

  const initial = name.replace(/^The\s+/i, "").charAt(0).toUpperCase() || "K";

  // Handle Info Submission
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoStatus({ type: "loading" });

    startTransitionInfo(async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      const res = await updateFamilyInfo(null, formData);
      if (res?.error) {
        setInfoStatus({ type: "error", message: res.error });
      } else {
        setInfoStatus({
          type: "success",
          message: res?.message || "Family information updated!",
        });
        router.refresh();
        setTimeout(() => setInfoStatus({ type: "idle" }), 4000);
      }
    });
  };

  // Handle Avatar Selection & Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setAvatarStatus({
          type: "error",
          message: "Please choose a valid image file.",
        });
        return;
      }
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setAvatarStatus({ type: "idle" });
    }
  };

  const handleUploadAvatar = () => {
    if (!avatarFile) return;
    setAvatarStatus({ type: "loading" });

    startTransitionAvatar(async () => {
      const formData = new FormData();
      formData.append("familyAvatar", avatarFile);

      const res = await uploadFamilyAvatar(null, formData);
      if (res?.error) {
        setAvatarStatus({ type: "error", message: res.error });
      } else {
        setAvatarStatus({
          type: "success",
          message: "Family crest updated successfully!",
        });
        if (res?.avatarUrl) {
          setAvatarPreview(res.avatarUrl);
        }
        setAvatarFile(null);
        router.refresh();
        setTimeout(() => setAvatarStatus({ type: "idle" }), 4000);
      }
    });
  };

  // Handle Backdrop Selection & Upload
  const handleBackdropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setBackdropStatus({
          type: "error",
          message: "Please choose a valid image file.",
        });
        return;
      }
      setBackdropFile(file);
      const url = URL.createObjectURL(file);
      setBackdropPreview(url);
      setBackdropStatus({ type: "idle" });
    }
  };

  const handleUploadBackdrop = () => {
    if (!backdropFile) return;
    setBackdropStatus({ type: "loading" });

    startTransitionBackdrop(async () => {
      const formData = new FormData();
      formData.append("familyBackdrop", backdropFile);

      const res = await uploadFamilyBackdrop(null, formData);
      if (res?.error) {
        setBackdropStatus({ type: "error", message: res.error });
      } else {
        setBackdropStatus({
          type: "success",
          message: "Family banner backdrop updated successfully!",
        });
        if (res?.backdropUrl) {
          setBackdropPreview(res.backdropUrl);
        }
        setBackdropFile(null);
        router.refresh();
        setTimeout(() => setBackdropStatus({ type: "idle" }), 4000);
      }
    });
  };

  return (
    <Card id="settings" className="border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Family Sanctuary Profile &amp; Branding
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
          >
            Family Admin Control
          </Badge>
        </div>
        <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
          Personalize your family sanctuary name, bio motto, crest emblem, and the canopy banner backdrop.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* SECTION 1: Family Name & Description */}
        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Family Hearth Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Robinson Hearth"
                required
                className="h-11 rounded-xl text-base font-medium"
              />
              <p className="text-[11px] text-zinc-500">
                Shown prominently at the top of your living room and in family invitations.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Family Bio &amp; Motto
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Cherishing small moments, holding close across every distance."
                rows={3}
                className="rounded-xl text-sm leading-relaxed"
              />
              <p className="text-[11px] text-zinc-500">
                A warm motto, guiding heritage, or welcome message displayed under your family banner.
              </p>
            </div>
          </div>

          {infoStatus.type === "error" && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{infoStatus.message}</span>
            </div>
          )}

          {infoStatus.type === "success" && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoStatus.message}</span>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={isPendingInfo || name.trim() === ""}
              className="rounded-full px-6 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer"
            >
              {isPendingInfo ? "Saving Details…" : "Save Family Details"}
            </Button>
          </div>
        </form>

        <div className="border-t border-zinc-200/70 dark:border-zinc-800" />

        {/* SECTION 2: Family Avatar Crest & Banner Backdrop Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Family Crest Avatar */}
          <div className="space-y-3.5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Family Avatar Crest</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                A symbol, crest, or portrait representing your family circle.
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="relative shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={name}
                    className="w-18 h-18 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-md ring-4 ring-emerald-500/10"
                  />
                ) : (
                  <div className="w-18 h-18 rounded-full bg-zinc-900 dark:bg-zinc-800 text-zinc-50 flex items-center justify-center font-serif text-2xl font-bold border border-zinc-700 shadow-md">
                    {initial}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-full rounded-full text-xs font-semibold cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Choose Crest Image
                </Button>

                {avatarFile && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPendingAvatar}
                    onClick={handleUploadAvatar}
                    className="w-full rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    {isPendingAvatar ? "Uploading…" : "Apply New Crest"}
                  </Button>
                )}
              </div>
            </div>

            {avatarStatus.type === "error" && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {avatarStatus.message}
              </p>
            )}
            {avatarStatus.type === "success" && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {avatarStatus.message}
              </p>
            )}
          </div>

          {/* Banner Backdrop Image */}
          <div className="space-y-3.5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Canopy Banner Backdrop</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                A panoramic photo (vacation, home, countryside) for your header canopy.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="relative h-24 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800">
                {backdropPreview ? (
                  <img
                    src={backdropPreview}
                    alt="Canopy Backdrop Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                    <span>Default minimalist gradient active</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  ref={backdropInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackdropChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => backdropInputRef.current?.click()}
                  className="flex-1 rounded-full text-xs font-semibold cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Choose Banner Image
                </Button>

                {backdropFile && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPendingBackdrop}
                    onClick={handleUploadBackdrop}
                    className="rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    {isPendingBackdrop ? "Uploading…" : "Apply Banner"}
                  </Button>
                )}
              </div>
            </div>

            {backdropStatus.type === "error" && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {backdropStatus.message}
              </p>
            )}
            {backdropStatus.type === "success" && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {backdropStatus.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
