'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Wallet, CalendarCheck, BarChart3,
  FileText, BookOpen, CalendarDays, CalendarRange,
  Users, Menu, X, LogOut, ChevronRight, BookOpenCheck,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  icon: any;
  items: NavItem[];
  adminOnly?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: 'Operasional',
    icon: LayoutDashboard,
    adminOnly: true,
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/keuangan', label: 'Keuangan', icon: Wallet },
      { href: '/dashboard/booking', label: 'Booking Aula', icon: CalendarCheck },
      { href: '/dashboard/trafik', label: 'Live Traffic', icon: BarChart3 },
    ],
  },
  {
    label: 'Konten',
    icon: BookOpenCheck,
    items: [
      { href: '/dashboard/articles', label: 'Artikel Blog', icon: FileText },
      { href: '/dashboard/kajian', label: 'Kajian & Dauroh', icon: BookOpen },
      { href: '/dashboard/khutbah', label: 'Jadwal Khutbah', icon: CalendarDays },
      { href: '/dashboard/aula', label: 'Ketersediaan Aula', icon: CalendarRange },
    ],
  },
  {
    label: 'Pengguna',
    icon: Users,
    adminOnly: true,
    items: [
      { href: '/dashboard/users', label: 'Manajemen User', icon: Users },
    ],
  },
];

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    router.push('/login');
    router.refresh();
  };

  const visibleGroups = navGroups
    .map((g) => ({ ...g, items: g.items.filter((it) => !it.adminOnly || user?.role === 'admin') }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-950 text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-5 border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <img className="w-10" src="/images/logo.svg" alt="logo" />
            <div>
              <p className="font-black text-xs leading-tight">Masjid Raya</p>
              <p className="font-black text-xs leading-tight">Puri Telukjambe</p>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">Portal DKM</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {visibleGroups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                <group.icon className="w-3.5 h-3.5" />
                <span>{group.label}</span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                        active ? 'bg-amber-400 text-emerald-950' : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-emerald-900 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-900 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Lihat Website
            <ChevronRight className="w-3 h-3 ml-auto" />
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
                <p className="text-slate-500 text-[10px]">
                  {user.email} ·{' '}
                  <span className={`font-bold uppercase ${user.role === 'admin' ? 'text-amber-600' : 'text-blue-600'}`}>
                    {user.role}
                  </span>
                </p>
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