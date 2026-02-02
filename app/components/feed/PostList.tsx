import { PostCard } from "./PostCard";

export function PostList({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div className="
        rounded-md
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-8
        text-center
      ">
        <p className="text-sm text-[var(--color-text-muted)]">
          Nothing shared yet.
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          When someone posts, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
