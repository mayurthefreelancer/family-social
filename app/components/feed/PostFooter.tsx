export function PostFooter() {
  return (
    <footer className="flex gap-4">
      <button
        className="
          text-xs
          text-[var(--color-text-muted)]
          hover:text-[var(--color-text-primary)]
        "
      >
        Comment
      </button>
    </footer>
  );
}
