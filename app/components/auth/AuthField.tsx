import React from "react";
import { Input, InputProps } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { cn } from "@/app/lib/utils";

export interface AuthFieldProps extends InputProps {
  label: string;
  error?: boolean;
}

export function AuthField({
  label,
  id,
  className,
  error,
  ...props
}: AuthFieldProps) {
  const generatedId = id || (props.name ? `field-${props.name}` : undefined);

  return (
    <div className="space-y-1.5 text-left">
      <Label
        htmlFor={generatedId}
        className="text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300 uppercase"
      >
        {label}
      </Label>
      <Input
        id={generatedId}
        error={error}
        className={cn(
          "h-10 text-sm bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-200",
          className
        )}
        {...props}
      />
    </div>
  );
}
