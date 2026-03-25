import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Calendar as CalendarIcon, Sun, Moon, Menu } from 'lucide-react';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="flex h-[100dvh] w-full bg-background-primary text-text-primary overflow-hidden relative transition-colors duration-300">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-overlay backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass border-r border-border-primary p-8 flex flex-col gap-8 flex-shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/10 dark:shadow-black/50' : '-translate-x-full'}
      `}>
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute top-6 right-6 p-2 rounded-lg hover:bg-border-secondary text-text-tertiary group"
        >
          <div className="w-6 h-6 relative flex items-center justify-center">
            <span className="absolute w-full h-[2px] bg-current rotate-45" />
            <span className="absolute w-full h-[2px] bg-current -rotate-45" />
          </div>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-accent-primary to-accent-secondary rounded-xl shadow-lg shadow-accent-primary/20" />
          <h2 className="font-bold text-xl tracking-tight">InterviewIQ</h2>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <NavLink
            to="/"
            className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-accent-primary text-white font-medium shadow-lg shadow-accent-primary/10' : 'hover:bg-border-secondary text-text-secondary hover:text-text-primary'}`}
          >
            <CalendarIcon size={20} /> Scheduler
          </NavLink>
        </nav>

        <div className="mt-auto pt-8 border-t border-border-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border border-border-primary" alt="User Profile" />
              <div>
                <p className="font-semibold text-sm">Alex Carter</p>
                <p className="text-xs text-text-tertiary font-medium tracking-wide">HR MANAGER</p>
              </div>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-border-secondary text-text-secondary transition-colors" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col h-full bg-background-tertiary relative transition-colors duration-300">
        <header className="lg:hidden flex items-center justify-between p-4 bg-background-primary border-b border-border-primary">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-accent-primary to-accent-secondary rounded-xl shadow-lg shadow-accent-primary/20" />
            <h2 className="font-bold text-lg tracking-tight">InterviewIQ</h2>
          </div>
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-border-secondary text-text-secondary transition-colors" title="Open Menu">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
