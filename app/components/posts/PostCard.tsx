// components/posts/PostCard.tsx
import { CommentList } from "./CommentList";
import { NewCommentForm } from "./NewCommentForm";

type Post = {
  id: string;
  content: string;
  name: string;
  created_at: string;
};

export function PostCard({ post }: { post: Post }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem" }}>
      <strong>{post.name}</strong>
      <p>{post.content}</p>

      <CommentList postId={post.id} />
      <NewCommentForm postId={post.id} />
    </div>
  );
}
