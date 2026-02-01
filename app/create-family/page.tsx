import { createFamily } from "@/app/actions/family";

export default function CreateFamilyPage() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await createFamily(formData.get("name") as string);
      }}
    >
      <h1>Create Family</h1>
      <input name="name" placeholder="enter name" required />
      <button>Create</button>
    </form>
  );
}
