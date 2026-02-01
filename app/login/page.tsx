// app/login/page.tsx

import { login } from "@/app/actions/login";

export default function LoginPage() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await login(
          formData.get("email") as string,
          formData.get("password") as string
        );
      }}
    >
      <h1>Login Page</h1>

      <input name="email" type="email" placeholder="Enter email id" required />
      <input name="password" type="password" placeholder="Enter password" required />

      <button type="submit">Login</button>
    </form>
  );
}
