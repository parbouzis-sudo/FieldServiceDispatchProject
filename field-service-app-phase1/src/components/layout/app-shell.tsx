import { useState, type ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
