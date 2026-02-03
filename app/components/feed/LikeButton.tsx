import { togglePostLike } from "@/app/actions/post";

interface Post {
  id: string;
  likeCount: number;
  likedByMe: boolean;
}
// LikeButton.tsx (SERVER COMPONENT — no "use client")
export function LikeButton({ post }: { post: Post }) {
  return (
    <form action={togglePostLike.bind(null, post.id)}>
      <button type="submit">
        {post.likedByMe ? "❤️" : "🤍"} {post.likeCount}
      </button>
    </form>
  );
}
