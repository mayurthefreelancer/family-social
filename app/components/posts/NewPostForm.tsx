"use client";

import { createPost } from "@/app/actions/post";
import { useState } from "react";
import { Avatar } from "../profile/Avatar";

export function CreatePost({ profile }: { profile: any }) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  
  async function handleSubmit() {
    if (!content.trim()) {
      console.warn("Post content cannot be empty");
      return;
    }
    if (pending) 
    setPending(true);
    await createPost(content);
    setContent("");
    setPending(false);
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-neutral-200 p-4 space-y-3 
    dark:bg-surface-200 dark:border-gray-700 dark: bg-[var(--color-card-bg)] dark:border-[var(--color-card-border)]">
      <div className="flex gap-3">
        <Avatar
          avatar={profile.avatar_url}
          name={profile.display_name}
          size="lg"
        />
        <textarea
          placeholder="What would you like to share?"
          className="
        w-full resize-none
        bg-transparent
        text-base
        placeholder:text-neutral-400
        focus:outline-none
      "
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={pending}
        />
      </div>

      <div className="flex justify-end">
        <button className="
      px-4 py-2 rounded-full
      bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)]
      text-sm font-medium
      hover:opacity-90
      transition
    " onClick={handleSubmit} disabled={pending}>
          Post
        </button>
      </div>
    </div>

  );
}
