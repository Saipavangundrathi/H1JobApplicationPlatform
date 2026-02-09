import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Briefcase,
  ChevronRight,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react';

type LayoutProps = {
  children: ReactNode;
};

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Job Search', icon: Briefcase, path: '/dashboard' },
  { label: 'My Resumes', icon: FileText, path: '/resumes' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
] as const;

const PATH_LABEL_MAP = new Map<string, string>([
  ...NAV_ITEMS.filter((item) => 'path' in item).map(
    (item) => [item.path, item.label] as [string, string]
  ),
  ['/onboarding', 'Onboarding'],
]);

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Dynamic Title Logic
  const currentPage =
    PATH_LABEL_MAP.get(currentPath) ??
    (currentPath.startsWith('/resume-analysis') ? 'Resume Analysis' : 'Dashboard');

  const [user, setUser] = useState<{ firstname?: string; lastname?: string }>({});

  useEffect(() => {
    const readUser = () => {
      try {
        const stored = localStorage.getItem('user');
        setUser(stored ? (JSON.parse(stored) as { firstname?: string; lastname?: string }) : {});
      } catch {
        setUser({});
      }
    };

    const hydrateFromApi = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) return;
        const data = (await response.json()) as { firstName?: string; lastName?: string };
        if (data?.firstName || data?.lastName) {
          const updated = {
            firstname: data.firstName ?? '',
            lastname: data.lastName ?? '',
          };
          localStorage.setItem('user', JSON.stringify(updated));
          setUser(updated);
        }
      } catch {
        // Ignore network failures; fallback stays as Guest.
      }
    };

    readUser();
    hydrateFromApi();
    window.addEventListener('storage', readUser);
    return () => window.removeEventListener('storage', readUser);
  }, []);

  useEffect(() => {
    // Re-check on navigation to pick up recent login changes.
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? (JSON.parse(stored) as { firstname?: string; lastname?: string }) : {});
    } catch {
      setUser({});
    }
  }, [location.pathname]);

  const displayName =
    user?.firstname || user?.lastname
      ? `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim()
      : 'Guest User';

  const initials =
    user?.firstname || user?.lastname
      ? `${user?.firstname?.[0] ?? ''}${user?.lastname?.[0] ?? ''}`.toUpperCase()
      : 'GU';

  const breadcrumbs = useMemo(() => ['Home', currentPage], [currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200/70 bg-white/90 px-6 py-6 backdrop-blur md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">H1B Platform</p>
            <h1 className="text-lg font-semibold text-slate-900">SponsorScope</h1>
          </div>
          <button
            className="rounded-md border border-slate-200 p-2 text-slate-500 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
             // Handle items without a specific path if necessary
             if (!path) return null; 

            return (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-emerald-50 p-4 text-xs text-slate-600">
          Upgrade to Premium for deeper sponsor insights and ATS matching.
        </div>
      </aside>

      <div className="flex min-h-screen flex-col md:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md border border-slate-200 p-2 text-slate-500 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              type="button"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm text-slate-500">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb} className="flex items-center">
                  {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-slate-400" />}
                  <span className={index === breadcrumbs.length - 1 ? 'font-semibold text-slate-900' : ''}>
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden text-right text-sm sm:block">
                <p className="font-medium text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">Free plan</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/10 text-sm font-semibold text-emerald-600">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-transparent px-6 py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}