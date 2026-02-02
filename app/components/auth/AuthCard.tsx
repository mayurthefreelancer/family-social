export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-md
        border border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-6 py-8
        space-y-6
      "
    >
      <header className="space-y-1">
        <h1 className="text-lg font-medium">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-muted)]">
            {subtitle}
          </p>
        )}
      </header>

      {children}
    </div>
  );
}
