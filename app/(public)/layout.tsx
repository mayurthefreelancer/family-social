export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <h1 className="text-2xl font-bold text-center mb-4">Family Social</h1>
        {children}
      </div>
    </main>
  );
}
