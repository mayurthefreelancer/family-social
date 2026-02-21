"use client";

import { acceptInvite } from "@/app/actions/invite";
import { useState } from "react";

export default function AcceptInviteForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setError(null);

    try {
      await acceptInvite(token, formData);
      // success → redirect happens inside server action
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form action={action} className="space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">
        Join your family
      </h1>

      <p className="text-sm text-gray-600">
        Create your account to join the family.
      </p>

      <div>
        <label className="block text-sm">Name</label>
        <input
          name="name"
          required
          className="input"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input
          name="email"
          type="email"
          required
          className="input"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="input"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full"
      >
        {pending ? "Joining..." : "Join family"}
      </button>
    </form>
  );
}
