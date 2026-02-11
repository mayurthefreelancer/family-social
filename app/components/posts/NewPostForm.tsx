"use client";

import { createPost } from "@/app/actions/post";
import { useState } from "react";
import { Avatar } from "../profile/Avatar";

export function CreatePost({ profile }: { profile: any }) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  
  async function handleSubmit() {
    if (!content.trim()) return;
    setPending(true);
    await createPost(content);
    setContent("");
    setPending(false);
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-neutral-200 p-4 space-y-3">
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
        />
      </div>

      <div className="flex justify-end">
        <button className="
      px-4 py-2 rounded-full
      bg-black text-white
      text-sm font-medium
      hover:opacity-90
      transition
    ">
          Post
        </button>
      </div>
    </div>

  );
}
