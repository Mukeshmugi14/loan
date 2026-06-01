import { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Lightbulb, FileText, Settings, UserCircle, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Lightbulb, label: 'Recommendations', path: '/recommendations' },
  { icon: FileText, label: 'Applications', path: '/applications' },
  { icon: BarChart3, label: 'Completion', path: '/profile/completion' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
];

export default function DashboardLayout() {
  const { logout, calculateCompletion } = useAuth();
  const navigate = useNavigate();
  const completion = calculateCompletion();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-dark-800/50 bg-dark-900/50 backdrop-blur-xl">
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3 text-xl font-display font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-[0_0_15px_rgba(20,241,217,0.4)]">
              <span className="text-black text-sm font-bold leading-none">N</span>
            </div>
            Neo<span className="text-brand-400">Fi</span> AI
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium border ${isActive ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'text-dark-400 hover:bg-white/5 border-transparent hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.path === '/profile/completion' && completion.overall < 100 && (
                <span className="ml-auto text-xs bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded-full font-bold">{completion.overall}%</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 mb-4 mx-4 bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border border-dark-700/50 cursor-pointer" onClick={() => navigate('/profile/completion')}>
          <p className="text-xs text-dark-400 mb-1">Profile Completion</p>
          <p className="text-sm text-white font-medium">{completion.overall}% Complete</p>
          <div className="w-full bg-dark-700 h-1.5 rounded-full mt-2">
            <div className="bg-brand-500 h-full rounded-full transition-all" style={{ width: `${completion.overall}%` }} />
          </div>
        </div>
        <div className="p-4 border-t border-dark-800/50 space-y-1">
          <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium w-full text-left ${isActive ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-dark-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Settings className="w-5 h-5" /> Settings
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left border border-transparent">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 sm:pb-0 pb-20 md:pb-0 relative">
        <header className="h-16 sm:border-b border-dark-800/50 flex items-center justify-between px-4 sm:px-8 bg-dark-950/80 backdrop-blur-md sticky top-0 z-10 w-full">
          <h1 className="text-lg font-semibold text-white truncate hidden sm:block">Executive Command Center</h1>
          <h1 className="text-lg font-semibold text-white truncate sm:hidden">NeoFi AI</h1>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 bg-dark-800/50 px-3 py-1.5 rounded-lg border border-dark-700/50">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-dark-300 hidden sm:inline">AI Live: Scanning 42 Lenders</span>
              <span className="text-xs font-medium text-dark-300 sm:hidden">AI Live</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-blue-500 hidden sm:block" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto"><Outlet /></div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-dark-900/80 backdrop-blur-xl border-t border-dark-800 flex items-center justify-around px-2 z-50">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-brand-400' : 'text-dark-400'}`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.path === '/profile/completion' && completion.overall < 100 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full" />
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
