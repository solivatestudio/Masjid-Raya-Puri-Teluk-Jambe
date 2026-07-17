import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Wallet, CalendarCheck, BarChart3, Menu, X, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/keuangan', label: 'Keuangan', icon: Wallet },
  { to: '/dashboard/booking', label: 'Booking Aula', icon: CalendarCheck },
  { to: '/dashboard/trafik', label: 'Live Traffic', icon: BarChart3 },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-950 text-white flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
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

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950'
                    : 'text-emerald-200 hover:bg-emerald-900 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer link */}
        <div className="px-3 py-4 border-t border-emerald-900">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-900 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Kembali ke Website
          </a>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 h-16 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <img className="w-8 h-8 rounded-full" src="/images/logo.svg" alt="" />
            <div className="text-xs">
              <p className="font-bold text-slate-900">Admin DKM</p>
              <p className="text-gray-500 text-[10px]">Masjid Raya Puri Telukjambe</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
