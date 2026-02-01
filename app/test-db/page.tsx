// app/test-db/page.tsx
import { testDb } from "../actions/test-db";

export default async function TestDbPage() {
  const result = await testDb();

  return (
    <pre>
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}
