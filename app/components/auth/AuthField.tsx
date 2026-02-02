export function AuthField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm text-[var(--color-text-secondary)]">
        {label}
      </span>
      <input
        {...props}
        className="
          w-full
          rounded-md
          border border-[var(--color-border)]
          px-3 py-2
          text-sm
          bg-[var(--color-surface)]
          text-[var(--color-text-primary)]
          focus:outline-none
          focus:border-[var(--color-border-strong)]
        "
      />
    </label>
  );
}
