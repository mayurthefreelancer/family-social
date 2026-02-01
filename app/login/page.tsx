// app/login/page.tsx
"use client";

import { login } from "@/app/actions/auth";
import { AuthFormState } from "../lib/auth-type";
import { useActionState } from "react";
const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction}>
      <h1>Login</h1>

      {state.error && (
        <p style={{ color: "red" }}>{state.error}</p>
      )}

      <label htmlFor="email">Email:</label>
      <input name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input name="password" type="password" required />

      <button type="submit">Login</button>
    </form>
  );
}
