import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { AppShell } from '@/components/layout/app-shell';
import { AuthPage } from '@/features/auth/components/auth-page';
import { DashboardPage } from '@/features/dashboard/components/dashboard-page';
import { CustomerListPage } from '@/features/customers/components/customer-list-page';
import { CustomerDetailPage } from '@/features/customers/components/customer-detail-page';
import { CustomerForm } from '@/features/customers/components/customer-form';
import { PropertyListPage } from '@/features/properties/components/property-list-page';
import { supabase } from '@/lib/supabase';

// ─── Root ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: Outlet,
});

// ─── Auth Route (no shell) ──────────────────────────────────────────────────

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
});

// ─── Authenticated Layout ───────────────────────────────────────────────────

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: '/auth' });
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});

// ─── Dashboard ──────────────────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: DashboardPage,
});

// ─── Customers ──────────────────────────────────────────────────────────────

const customersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/customers',
  component: CustomerListPage,
});

const customerNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/customers/new',
  component: CustomerForm,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/customers/$customerId',
  component: CustomerDetailPage,
});

const customerEditRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/customers/$customerId/edit',
  component: () => {
    // TODO: Load customer and pass to form — will refine with data loaders
    return <CustomerForm />;
  },
});

// ─── Properties ─────────────────────────────────────────────────────────────

const propertiesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/properties',
  component: PropertyListPage,
});

const propertyNewRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/properties/new',
  component: () => <div className="text-muted-foreground">Property form — coming next</div>,
});

const propertyDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/properties/$propertyId',
  component: () => <div className="text-muted-foreground">Property detail — coming next</div>,
});

// ─── Settings (placeholder) ─────────────────────────────────────────────────

const settingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/settings',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">Organization settings, users, and roles.</p>
    </div>
  ),
});

// ─── Phase 2+ Placeholders ──────────────────────────────────────────────────

const workOrdersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/work-orders',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
      <p className="text-muted-foreground">Coming in Phase 2.</p>
    </div>
  ),
});

const schedulingRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/scheduling',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dispatch Board</h1>
      <p className="text-muted-foreground">Coming in Phase 2.</p>
    </div>
  ),
});

const techniciansRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/technicians',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Technicians</h1>
      <p className="text-muted-foreground">Coming in Phase 2.</p>
    </div>
  ),
});

const estimatesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/estimates',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Estimates</h1>
      <p className="text-muted-foreground">Coming in Phase 3.</p>
    </div>
  ),
});

const invoicesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/invoices',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
      <p className="text-muted-foreground">Coming in Phase 3.</p>
    </div>
  ),
});

const inventoryRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/inventory',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
      <p className="text-muted-foreground">Coming in Phase 4.</p>
    </div>
  ),
});

const reportsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/reports',
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      <p className="text-muted-foreground">Coming in Phase 4.</p>
    </div>
  ),
});

// ─── Build Route Tree ───────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  authRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    customersRoute,
    customerNewRoute,
    customerDetailRoute,
    customerEditRoute,
    propertiesRoute,
    propertyNewRoute,
    propertyDetailRoute,
    workOrdersRoute,
    schedulingRoute,
    techniciansRoute,
    estimatesRoute,
    invoicesRoute,
    inventoryRoute,
    reportsRoute,
    settingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

// Type registration for type-safe navigation
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
