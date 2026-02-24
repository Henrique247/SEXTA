import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Pill, Stethoscope, User, Bell, Search, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Calendar, label: 'Consultas', path: '/booking' },
  { icon: Pill, label: 'Farmácias', path: '/pharmacy' },
  { icon: Stethoscope, label: 'Triagem IA', path: '/triage' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-emerald-600 tracking-tight">KudiMed</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Angola Health Ecosystem</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">João Silva</p>
              <p className="text-xs text-slate-500 truncate">Paciente</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-emerald-600">KudiMed</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-3/4 h-full p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium",
                    location.pathname === item.path ? "bg-emerald-50 text-emerald-700" : "text-slate-600"
                  )}
                >
                  <item.icon size={24} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
