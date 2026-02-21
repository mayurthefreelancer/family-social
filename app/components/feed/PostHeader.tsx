export default function PostHeader({ authorName, createdAt }: { authorName: string; createdAt: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {authorName}
            </span>

            <time className="text-xs text-[var(--color-text-muted)]">
                {createdAt}
            </time>
        </div>

    );
}