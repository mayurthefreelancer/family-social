"use client";

import { createFamily } from "@/app/actions/family";
import { AuthCard } from "@/app/components/auth/AuthCard";
import { AuthField } from "@/app/components/auth/AuthField";
import { useState } from "react";

export default function CreateFamilyPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setError(null);
    setPending(true);

    try {
      const result = await createFamily(
        formData.get("name") as string
      );
      if (result?.error) {
        setError(result.error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <AuthCard
          title="Create your family"
          subtitle="This will be your private space"
        >
          <form action={action} className="space-y-4">
            <AuthField
              label="Family name"
              name="name"
              placeholder="e.g. The Sharma Family"
              required
            />

            {error && (
              <p className="text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="
                w-full
                rounded-md
                bg-[var(--color-accent)]
                py-2
                text-sm
                text-white
                disabled:opacity-50
              "
            >
              {pending ? "Creating…" : "Create family"}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
