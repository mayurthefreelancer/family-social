// app/register/page.tsx
import { register } from "@/app/actions/auth";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  return (
    <form
      action={async (formData) => {
        "use server";
        await register(
          formData.get("name") as string,
          formData.get("email") as string,
          formData.get("password") as string,
          (await searchParams).invite
        );
      }}
    >
      <h1>Create Account</h1>

      <input name="name" required />
      <input name="email" type="email" required />
      <input name="password" type="password" required />

      <button>Create Account</button>
    </form>
  );
}
