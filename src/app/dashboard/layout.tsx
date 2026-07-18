'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Wallet, CalendarCheck, BarChart3, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/keuangan', label: 'Keuangan', icon: Wallet },
  { href: '/dashboard/booking', label: 'Booking Aula', icon: CalendarCheck },
  { href: '/dashboard/trafik', label: 'Live Traffic', icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-emerald-950 text-white flex flex-col">
        <div className="px-5 py-5 border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <img className="w-10" src="/images/logo.svg" alt="logo" />
            <div>
              <p className="font-black text-xs leading-tight">Masjid Raya</p>
              <p className="font-black text-xs leading-tight">Puri Telukjambe</p>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mt-0.5">Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  active ? 'bg-amber-400 text-emerald-950' : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-emerald-900 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-900 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Kembali ke Website
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
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <img className="w-8 h-8 rounded-full" src="/images/logo.svg" alt="" />
            <div className="text-xs">
              <p className="font-bold text-slate-900">Admin DKM</p>
              <p className="text-gray-500 text-[10px]">Masjid Raya Puri Telukjambe</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
