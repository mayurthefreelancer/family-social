/**
 * Utility function to combine and clean class names.
 * Standard helper for Shadcn UI components.
 */
export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.filter(Boolean).join(" ");
}
