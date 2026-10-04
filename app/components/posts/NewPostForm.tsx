"use client";

import { createPost } from "@/app/actions/post";
import { useState } from "react";
import { Avatar } from "../profile/Avatar";

export function CreatePost({ profile }: { profile: any }) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) {
      return;
    }
    if (pending) return;
    setPending(true);
    try {
      await createPost(content);
      setContent("");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="flex gap-3.5">
        <Avatar
          avatar={profile.avatar_url}
          name={profile.display_name}
          size="md"
        />
        <textarea
          placeholder="What would you like to share?"
          className="w-full resize-none bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={pending}
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          className="px-5 py-2 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
          onClick={handleSubmit}
          disabled={pending || !content.trim()}
        >
          {pending ? "Posting..." : "Post to Family"}
        </button>
      </div>
    </div>
  );
}
