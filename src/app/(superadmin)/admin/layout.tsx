import { AdminProvider } from "./context/admin-context";
import SidebarSection from "./_components/sidebar/SidebarSection";
import TopBar from "./_components/dashboard/TopBar";
import AdminProtection from "./_components/AdminProtection";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      <AdminProvider>
        <div className="antialiased bg-background">
          <main className="min-h-screen bg-secondary flex">
              <SidebarSection />
              <div className="flex-1 flex flex-col min-w-0">
                  <TopBar />
                  <section className="flex-1 p-6 overflow-auto">
                      {children}
                  </section>
              </div>
          </main>
        </div>
      </AdminProvider>
    </AdminProtection>
  );
}
