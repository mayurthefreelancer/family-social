// components/posts/CommentList.tsx

import { getComments } from "@/app/lib/comments";

export async function CommentList({ postId }: { postId: string }) {
  const comments = await getComments(postId);

  if (comments.length === 0) {
    return <p>No comments yet</p>;
  }

  return (
    <div>
      {comments.map((c) => (
        <div key={c.id}>
          <strong>{c.name}</strong>
          <p>{c.content}</p>
        </div>
      ))}
    </div>
  );
}
