import Link from 'next/link';
import { Shield, Home, Users } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 bg-card border-r border-border flex flex-col p-4">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-red-500 flex items-center gap-2"><Shield /> SuperAdmin</h1>
        </div>
        <nav className="flex-grow space-y-2">
           <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10">
              <Home className="w-5 h-5" /><span>Dashboard</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10">
              <Users className="w-5 h-5" /><span>Empresas</span>
            </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}