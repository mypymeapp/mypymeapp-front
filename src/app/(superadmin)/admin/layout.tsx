export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-primary">Panel de SuperAdmin</h1>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}