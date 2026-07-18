'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FileText, BookOpen, CalendarDays, CalendarRange, Users,
  Menu, X, LogOut, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true, role: 'any' },
  { href: '/admin/cms/articles', label: 'Artikel Blog', icon: FileText, role: 'any' },
  { href: '/admin/cms/kajian', label: 'Kajian & Dauroh', icon: BookOpen, role: 'any' },
  { href: '/admin/cms/khutbah', label: 'Jadwal Khutbah', icon: CalendarDays, role: 'any' },
  { href: '/admin/cms/aula', label: 'Ketersediaan Aula', icon: CalendarRange, role: 'any' },
  { href: '/admin/cms/pic', label: 'Manajemen User', icon: Users, role: 'admin' },
];

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  };

  const visibleNav = navItems.filter((item) => item.role === 'any' || user?.role === 'admin');

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <img className="w-10" src="/images/logo.svg" alt="logo" />
            <div>
              <p className="font-black text-xs leading-tight">Masjid Raya</p>
              <p className="font-black text-xs leading-tight">Puri Telukjambe</p>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">CMS Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  active ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-700 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Analytics
            <ChevronRight className="w-3 h-3 ml-auto" />
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-900/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-64">
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 h-16 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right text-xs hidden sm:block">
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-slate-500 text-[10px]">{user.email} · <span className="font-bold uppercase text-amber-600">{user.role}</span></p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
