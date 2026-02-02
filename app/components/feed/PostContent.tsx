export function PostContent({ post }: { post: any }) {
  return (
    <p
      className="
        text-sm
        leading-relaxed
        text-[var(--color-text-primary)]
        whitespace-pre-wrap
      "
    >
      {post.content}
    </p>
  );
}
