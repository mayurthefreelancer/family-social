import { togglePostLike } from "@/app/actions/post";
import { Heart } from "lucide-react";

interface Post {
  id: string;
  likeCount: number;
  likedByMe: boolean;
}
// LikeButton.tsx (SERVER COMPONENT — no "use client")
export function LikeButton({ post }: { post: Post }) {
  return (
    <form action={togglePostLike.bind(null, post.id)}>
      <button type="submit" className="hover:scale-110 transition flex items-center gap-1">
        
        {post.likedByMe ?  <Heart className="fill-red-500 text-red-500" /> : <Heart className="text-gray-400" />} {post.likeCount}
      </button>
    </form>
  );
}
