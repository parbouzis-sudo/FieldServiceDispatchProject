import { useLocation, Link } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Calendar,
  Wrench,
  FileText,
  Receipt,
  Package,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  phase?: number; // Which phase enables this
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Properties', href: '/properties', icon: Building2 },
  { label: 'Work Orders', href: '/work-orders', icon: ClipboardList, phase: 2 },
  { label: 'Scheduling', href: '/scheduling', icon: Calendar, phase: 2 },
  { label: 'Technicians', href: '/technicians', icon: Wrench, phase: 2 },
  { label: 'Estimates', href: '/estimates', icon: FileText, phase: 3 },
  { label: 'Invoices', href: '/invoices', icon: Receipt, phase: 3 },
  { label: 'Inventory', href: '/inventory', icon: Package, phase: 4 },
  { label: 'Reports', href: '/reports', icon: BarChart3, phase: 4 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        {isCollapsed ? (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            FS
          </div>
        ) : (
          <span className="text-lg font-semibold">{APP_NAME}</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
