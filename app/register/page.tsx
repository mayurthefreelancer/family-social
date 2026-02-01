// app/register/page.tsx
"use client";

import { register } from "@/app/actions/auth";
import { use, useActionState } from "react";
import { AuthFormState } from "../lib/auth-type";

const initialState: AuthFormState = {};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const [state, formAction] = useActionState(register, initialState);

  const { invite } = use(searchParams); // ✅ unwrap
  return (

    <form action={formAction}>
      <h1>Create Account</h1>

      {state.error && (
        <p style={{ color: "red" }}>{state.error}</p>
      )}

      <label htmlFor="name">Name:</label>
      <input name="name" required />
      <label htmlFor="email">Email:</label>
      <input name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input name="password" type="password" required />

      {invite && (
        <input
          type="hidden"
          name="invite"
          value={invite}
        />
      )}

      <button>Create Account</button>
    </form>
  );
}
