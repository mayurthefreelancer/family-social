export function Avatar({
  avatar,
  name,
  size = "md",
}: {
  avatar?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-20 w-20 text-xl",
  };

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center shrink-0 select-none`}
    >
      <span className="font-semibold text-zinc-700 dark:text-zinc-200">
        {name[0]?.toUpperCase() || "?"}
      </span>
    </div>
  );
}
