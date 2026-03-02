# CLAUDE.md — Field Service Dispatch Platform

> **This file is the primary instruction set for Claude Code operating inside this Codespace.**
> Read this before making any changes. Follow these conventions exactly.

---

## Project Overview

We are building an **open, multi-tenant SaaS field service dispatch platform** for SMB companies. The first customer is a property management company servicing HVAC, mechanical, heating, cleaning, and general contracting trades.

The platform replicates core capabilities of **ServiceTitan** and **Salesforce Field Service** — dispatch board, call booking, technician mobile workflows, pricebook, invoicing — but built on an open, composable stack that integrates with existing CRMs and ERPs.

**Key differentiator:** API-first, extensible, no vendor lock-in. Supabase (open-source) as the backend, with a **CRM adapter layer** that normalizes any CRM into the platform's data model. Customer Zero runs a homegrown/internal CRM (first connector). Future customers may use Salesforce (second connector). The adapter pattern ensures the platform doesn't hardcode to any single CRM.

---

## Tech Stack (Do Not Deviate)

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite 6 | Already configured in Codespace |
| **UI Components** | shadcn/ui + Tailwind CSS 4 | Composable primitives. No Material UI, no Ant Design, no Chakra. |
| **State (server)** | TanStack Query v5 | All server data goes through TanStack Query. No Redux. |
| **State (client)** | Zustand v5 | UI-only state: dispatch board filters, modals, sidebar. |
| **Forms** | React Hook Form + Zod | Every form uses Zod schemas for validation. |
| **Routing** | TanStack Router v1 | Type-safe, file-based conventions. |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime + Edge Functions + Storage) | No custom Express/Fastify server unless explicitly discussed. |
| **Mapping** | Mapbox GL JS or Google Maps JS API | For technician tracking, route display, service territories. |
| **Testing** | Vitest + React Testing Library | Already configured. |
| **Mobile (Phase 6)** | React Native / Expo | Not yet. Do not scaffold mobile code. |
| **CI/CD** | GitHub Actions | Workflows in `.github/workflows/`. |

---

## Architecture Rules

### Multi-Tenancy
- **Every table** has an `organization_id UUID NOT NULL` column.
- **Row-Level Security (RLS)** is enforced at the database level. Every table gets RLS policies.
- The `organization_id` is extracted from `auth.jwt() -> 'app_metadata' ->> 'organization_id'`.
- Never filter by `organization_id` in application code as a substitute for RLS — RLS is the enforcement layer. Application-level filtering is supplementary.

### Data Model Core Hierarchy
```
Organization
  ├── User (auth + profile)
  ├── Customer (commercial or residential)
  │     └── Property (service location)
  │           └── Equipment / Asset
  ├── Technician (linked to User)
  ├── Work Order (linked to Customer → Property → Equipment)
  │     ├── Service Appointment (links Work Order ↔ Technician + time slot)
  │     └── Work Order Line Items (from Pricebook)
  ├── Pricebook Item (labor, parts, flat-rate packages)
  ├── Invoice (generated from completed Work Orders)
  └── Inventory Item (parts on hand, truck stock)
```

### Scheduling Integrity
- **No double-booking** is enforced at the database level via PostgreSQL `EXCLUDE USING GIST` with `tstzrange` on `service_appointments`.
- Application-layer validation is a convenience check, not the source of truth.

### Work Order Numbers
- Human-readable format: `WO-2026-00001` (auto-generated via trigger, unique per org per year).
- UUIDs are internal primary keys. Work order numbers are for human-facing use (calls, invoices, dispatch board).

---

## Folder Structure (Follow Exactly)

```
src/
├── app/                        # App shell & routing
│   ├── App.tsx                 # Root component, providers
│   ├── router.tsx              # TanStack Router config
│   └── providers.tsx           # QueryClient, Auth, Theme
│
├── components/                 # Shared UI components
│   ├── ui/                     # shadcn/ui primitives only
│   ├── layout/                 # Shell, Sidebar, Header, Nav
│   ├── data-table/             # Generic sortable/filterable table
│   ├── map/                    # Map wrapper, markers, routes
│   └── forms/                  # Reusable form field components
│
├── features/                   # Feature modules (domain-driven)
│   ├── auth/
│   ├── customers/
│   ├── properties/
│   ├── work-orders/
│   ├── scheduling/
│   ├── technicians/
│   ├── estimates/
│   ├── invoicing/
│   ├── inventory/
│   ├── reporting/
│   ├── settings/
│   └── connectors/              # CRM/ERP adapter layer
│
├── hooks/                      # Global shared hooks
├── lib/                        # Core utilities
│   ├── supabase.ts             # Supabase client init
│   ├── constants.ts            # App-wide constants & enums
│   ├── utils.ts                # cn(), formatters
│   └── validators.ts           # Shared Zod schemas
│
├── types/                      # Global TypeScript types
│   ├── database.ts             # Auto-generated from Supabase
│   └── index.ts
│
├── styles/
│   └── globals.css
│
├── main.tsx
└── vite-env.d.ts

supabase/
├── config.toml
├── migrations/                 # Sequential SQL: 00001_create_xxx.sql
├── functions/                  # Edge Functions (Deno/TS)
└── seed.sql                    # Demo data
```

### Feature Module Convention
Each feature folder under `src/features/<domain>/` contains:
- `components/` — Domain-specific React components
- `hooks/` — Domain-specific custom hooks (usually wrapping TanStack Query)
- `api.ts` — Supabase query functions (never inline Supabase calls in components)
- `types.ts` — Domain-specific TypeScript types

**Do not** put domain logic in `src/components/`. That directory is only for shared, domain-agnostic UI components.

---

## Coding Conventions

### TypeScript
- Strict mode. No `any` types unless absolutely unavoidable (and then add a `// TODO: type this properly` comment).
- Use `interface` for object shapes, `type` for unions and intersections.
- All Supabase-generated types go in `src/types/database.ts` (auto-generated via `supabase gen types ts`). Application-layer types in feature `types.ts` files can reference these but should provide friendlier abstractions.

### Components
- Functional components only. No class components.
- Use named exports, not default exports (except for lazy-loaded route components).
- Colocate component-specific styles, tests, and stories next to the component file.
- Keep components under 200 lines. Extract subcomponents or hooks when approaching this limit.

### Data Fetching
- All server data flows through **TanStack Query** hooks.
- Queries go in `features/<domain>/hooks/` wrapping functions from `features/<domain>/api.ts`.
- Use `queryKey` factories for consistent cache keys:
  ```typescript
  export const customerKeys = {
    all: ['customers'] as const,
    lists: () => [...customerKeys.all, 'list'] as const,
    list: (filters: CustomerFilters) => [...customerKeys.lists(), filters] as const,
    details: () => [...customerKeys.all, 'detail'] as const,
    detail: (id: string) => [...customerKeys.details(), id] as const,
  };
  ```
- Mutations should use `onMutate` for optimistic updates where UX demands it (especially the dispatch board).

### Supabase Queries
- Centralize in `api.ts` per feature. Example:
  ```typescript
  // features/customers/api.ts
  import { supabase } from '@/lib/supabase';
  import type { Customer, CustomerInsert } from './types';

  export async function getCustomers(orgId: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('organization_id', orgId)
      .order('display_name');
    if (error) throw error;
    return data;
  }
  ```
- Never call `supabase.from(...)` directly inside a component.

### Forms
- Every form uses `react-hook-form` with a `zodResolver`.
- Define the Zod schema in the feature's `types.ts` or a dedicated `schemas.ts`.
- Form submission triggers a TanStack Query mutation.

### Styling
- Tailwind utility classes only. No inline `style` props except for dynamic values (map dimensions, drag positions).
- Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes.
- No CSS modules, no styled-components, no emotion.

### Error Handling
- Supabase errors: catch at the `api.ts` layer, throw so TanStack Query's `error` state handles display.
- User-facing errors: use `sonner` toasts for transient errors, inline form validation for field-level errors.
- Never swallow errors silently.

### Naming
- Files: `kebab-case.ts` / `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: `useCamelCase`
- Constants/enums: `UPPER_SNAKE_CASE`
- Database columns: `snake_case`
- TypeScript properties: `camelCase` (transform at the API boundary if needed)

---

## Database Migration Rules

- Migrations live in `supabase/migrations/` with sequential numbering: `00001_create_organizations.sql`, `00002_create_customers.sql`, etc.
- Each migration is a self-contained, idempotent SQL file.
- Always include RLS policies in the migration that creates the table, or in a dedicated `00009_create_rls_policies.sql` migration.
- Use `gen_random_uuid()` for primary keys.
- Every table gets `created_at TIMESTAMPTZ DEFAULT now()` and `updated_at TIMESTAMPTZ DEFAULT now()`.
- Use `JSONB` for flexible/semi-structured data (addresses, settings, specs). Use proper columns for anything you'll query or filter on.
- Refer to the full schema definitions in `field-service-plan.md` § 3.2 for the canonical table structures.

---

## Implementation Phases

Build in this order. Do not skip ahead. Each phase has explicit exit criteria.

### Phase 1 — Foundation & Core CRUD (Weeks 1–3)
Supabase setup, auth flow, app shell, Customer CRUD, Property CRUD, Equipment registry, data table component, global search, role-based access. **Also:** scaffold `CrmAdapter` interface, `crm_entity_mappings` / `crm_connections` tables, and mock adapter — so the data model is sync-ready from day one.
**Exit:** A dispatcher can log in, manage customers and properties, and see equipment records. The CRM adapter interface exists with a working mock.

### Phase 2 — Work Orders & Scheduling (Weeks 4–7)
Work order lifecycle, technician management, service appointments, **dispatch board** (drag-and-drop calendar, real-time via Supabase Realtime), map view with technician/job pins, notifications.
**Exit:** A dispatcher can create a work order, assign a technician, see it on the dispatch board, and get real-time status updates.

### Phase 3 — Estimates, Invoicing & Pricebook (Weeks 8–10)
Pricebook CRUD, estimate builder (Good/Better/Best), customer approval flow, estimate → work order conversion, invoice generation, payment recording.
**Exit:** Office staff can build an estimate, get approval, convert to work order, and invoice on completion.

### Phase 4 — Inventory, Reporting & Notifications (Weeks 11–13)
Inventory/parts management, KPI dashboard (first-time fix rate, response time, revenue by trade, tech utilization), email/SMS notifications via Edge Functions + Twilio/SendGrid.
**Exit:** Management sees KPIs, techs get SMS dispatch alerts, parts usage is tracked.

### Phase 5 — Integrations & Customer Portal (Weeks 14–17)
Stripe payments, QuickBooks/Xero sync, Google Calendar sync, webhook system, customer self-service portal (Next.js). **CRM connectors:** implement `custom-crm.ts` adapter for Customer Zero's homegrown CRM (once API surface is confirmed), field mapping UI, sync dashboard. Salesforce adapter as a follow-on for future customers.

### Phase 6 — Mobile & AI (Weeks 18+)
React Native/Expo tech app, offline-first capability, route optimization, predictive maintenance, AI-powered knowledge base (pgvector + RAG for searching tech docs and past work orders).

---

## Domain Glossary

| Term | Definition |
|---|---|
| **Work Order** | A request for work at a property. Central operational entity. |
| **Service Appointment** | A scheduled time slot linking a Work Order to a Technician. |
| **Dispatch Board** | The primary UI for dispatchers — a calendar/Gantt view showing technicians as rows and time as columns. The "crown jewel" of the app. |
| **Trade Type** | The category of work: HVAC, plumbing, electrical, cleaning, general contracting, mechanical, heating. |
| **Pricebook** | The catalog of labor rates, parts, and flat-rate packages the company charges. |
| **Property** | A service location (building, unit, site). Belongs to a Customer. |
| **Equipment / Asset** | A specific piece of equipment at a Property (e.g., "Rooftop HVAC Unit #1"). |
| **First-Time Fix Rate** | The percentage of jobs completed on the first visit without a return trip. Key KPI. |
| **CRM Adapter** | An implementation of the `CrmAdapter` interface that translates between a specific CRM's API and the platform's normalized data model. |
| **Entity Mapping** | The link between a record in our platform (e.g., a Customer) and its corresponding record in an external CRM (e.g., an Account). Stored in `crm_entity_mappings`. |
| **Sync Engine** | The orchestration layer that runs pull/push cycles between the platform and an external CRM, handling conflict resolution and error logging. |

---

## CRM Connector Layer (Critical Architecture)

### The Problem
Customer Zero uses a **homegrown/internal CRM**. Future customers may use Salesforce, HubSpot, or other systems. We do not yet know how the homegrown CRM exposes data (REST API, GraphQL, direct DB access, CSV exports — TBD). The platform must not hardcode to any single CRM.

### The Solution: Adapter Pattern
A **CRM adapter interface** defines a normalized contract. Each CRM gets a concrete adapter implementation. The platform talks only to the interface — never to a specific CRM's API directly.

```
┌──────────────────────────────────────────────────────────────┐
│                    Our Platform                               │
│                                                              │
│  features/connectors/                                        │
│    ├── types.ts            ← CrmAdapter interface            │
│    ├── sync-engine.ts      ← Orchestrates sync cycles        │
│    ├── field-mapping.ts    ← Configurable field mappings      │
│    ├── adapters/                                              │
│    │   ├── custom-crm.ts   ← Customer Zero's CRM (first)     │
│    │   ├── salesforce.ts   ← Salesforce adapter (Phase 5+)   │
│    │   └── mock.ts         ← For testing & development        │
│    └── hooks/              ← useConnectorStatus, useSyncLog   │
└─────────────┬────────────────────┬───────────────────────────┘
              │                    │
              ▼                    ▼
   ┌──────────────────┐  ┌──────────────────┐
   │ Custom CRM       │  │ Salesforce       │
   │ (REST? DB? TBD)  │  │ (REST + Bulk API)│
   └──────────────────┘  └──────────────────┘
```

### CrmAdapter Interface

```typescript
// features/connectors/types.ts

/**
 * Normalized CRM entity types.
 * Every adapter maps its CRM-specific shapes to these.
 */
interface CrmAccount {
  externalId: string;          // The ID in the external CRM
  name: string;
  type: 'residential' | 'commercial';
  email?: string;
  phone?: string;
  billingAddress?: Address;
  raw: Record<string, unknown>; // Original payload for debugging
}

interface CrmContact {
  externalId: string;
  accountExternalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  raw: Record<string, unknown>;
}

interface CrmCase {
  externalId: string;
  accountExternalId: string;
  subject: string;
  description?: string;
  status: string;
  priority?: string;
  raw: Record<string, unknown>;
}

interface CrmProduct {
  externalId: string;
  name: string;
  code?: string;
  unitPrice?: number;
  category?: string;
  raw: Record<string, unknown>;
}

/**
 * The adapter contract. Every CRM connector implements this.
 */
interface CrmAdapter {
  readonly name: string;       // 'custom-crm', 'salesforce', etc.

  // Connection lifecycle
  testConnection(): Promise<{ ok: boolean; error?: string }>;

  // Pull from external CRM → our platform
  fetchAccounts(since?: Date): Promise<CrmAccount[]>;
  fetchContacts(since?: Date): Promise<CrmContact[]>;
  fetchCases(since?: Date): Promise<CrmCase[]>;
  fetchProducts(since?: Date): Promise<CrmProduct[]>;

  // Push from our platform → external CRM
  pushCustomer(customer: Customer): Promise<{ externalId: string }>;
  pushWorkOrder(workOrder: WorkOrder): Promise<{ externalId: string }>;
  pushPricebookItem(item: PricebookItem): Promise<{ externalId: string }>;

  // Optional: webhook registration for real-time sync
  registerWebhooks?(callbackUrl: string): Promise<void>;
}
```

### Entity Mapping (Full Sync Scope)

| External CRM Entity | ↔ | Platform Entity | Sync Direction |
|---|---|---|---|
| Account | ↔ | Customer | Bi-directional |
| Contact | ↔ | Customer (contact details) / User | Bi-directional |
| Case / Ticket | ↔ | Work Order | Bi-directional |
| Product / Catalog Item | ↔ | Pricebook Item | Bi-directional |
| Location / Site | → | Property | Pull from CRM |
| Asset | ↔ | Equipment | Bi-directional |

### Sync Engine Design

```typescript
// features/connectors/sync-engine.ts

interface SyncConfig {
  adapterId: string;                          // which adapter to use
  direction: 'pull' | 'push' | 'bidirectional';
  entities: ('accounts' | 'contacts' | 'cases' | 'products')[];
  conflictResolution: 'crm-wins' | 'platform-wins' | 'latest-wins';
  schedule: 'manual' | 'on-change' | 'interval';
  intervalMinutes?: number;                   // if schedule = 'interval'
}
```

**Conflict resolution strategy (default: `latest-wins`):**
- Each synced record stores `external_id`, `external_updated_at`, and `last_synced_at` in a `crm_sync_log` table.
- On bi-directional sync, compare timestamps. The most recently modified version wins.
- Conflicts are logged to `crm_sync_log` with `status: 'conflict'` for manual review.

### Database Support for Sync

```sql
-- Mapping table: links our records to external CRM records
CREATE TABLE crm_entity_mappings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  adapter_name    TEXT NOT NULL,          -- 'custom-crm', 'salesforce'
  entity_type     TEXT NOT NULL,          -- 'customer', 'work_order', 'pricebook_item'
  internal_id     UUID NOT NULL,          -- our platform's record ID
  external_id     TEXT NOT NULL,          -- the CRM's record ID
  external_updated_at TIMESTAMPTZ,
  last_synced_at  TIMESTAMPTZ DEFAULT now(),
  sync_status     TEXT DEFAULT 'synced' CHECK (sync_status IN (
    'synced', 'pending_push', 'pending_pull', 'conflict', 'error'
  )),
  error_message   TEXT,
  metadata        JSONB DEFAULT '{}',     -- adapter-specific data
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (organization_id, adapter_name, entity_type, external_id)
);

-- Sync run history
CREATE TABLE crm_sync_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  adapter_name    TEXT NOT NULL,
  direction       TEXT NOT NULL,
  started_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  status          TEXT DEFAULT 'running' CHECK (status IN (
    'running', 'completed', 'failed', 'partial'
  )),
  records_pulled  INTEGER DEFAULT 0,
  records_pushed  INTEGER DEFAULT 0,
  errors          JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Connector configuration per org
CREATE TABLE crm_connections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  adapter_name    TEXT NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  config          JSONB NOT NULL DEFAULT '{}',  -- connection params (encrypted at rest)
  field_mappings  JSONB DEFAULT '{}',           -- custom field mappings per org
  sync_config     JSONB DEFAULT '{}',           -- schedule, direction, conflict rules
  last_synced_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (organization_id, adapter_name)
);
```

### Configurable Field Mappings
Each organization can customize how CRM fields map to platform fields. This is stored as JSON in `crm_connections.field_mappings`:

```json
{
  "accounts": {
    "Name": "company_name",
    "BillingStreet": "billing_address.street",
    "Custom_Phone__c": "phone",
    "Account_Type__c": "type"
  },
  "cases": {
    "Subject": "title",
    "Description": "description",
    "Priority__c": "priority",
    "Trade_Type__c": "trade_type"
  }
}
```

A settings UI (Phase 5) lets org admins configure these mappings without code changes.

### Custom CRM Adapter — Implementation Plan
Since we don't yet know how Customer Zero's CRM exposes data, the adapter is designed to accommodate any of:

1. **REST API** (most likely) → Standard HTTP client with auth token management
2. **GraphQL** → Query builder with schema introspection
3. **Direct database access** → Read-only connection to their Postgres/MySQL with polling
4. **File-based / CSV export** → Scheduled import via Supabase Storage + Edge Function

The `custom-crm.ts` adapter will be stubbed with the `CrmAdapter` interface first, then implemented once we discover the CRM's data access method. The `mock.ts` adapter lets us build and test the entire sync engine before the real adapter is ready.

### Implementation Priority
- **Phase 1–4:** Build the `CrmAdapter` interface, `crm_entity_mappings` table, mock adapter, and sync engine scaffold. This costs almost nothing and means the data model is sync-ready from day one.
- **Phase 5:** Implement `custom-crm.ts` adapter (once we discover the CRM's API surface), Salesforce adapter, field mapping UI, sync dashboard.

---

## Other Integrations

Beyond CRM, the platform integrates with:
- **QuickBooks / Xero:** Invoice and payment sync (via Edge Functions).
- **Google Calendar:** Technician schedule sync.
- **Stripe:** Online payment processing.
- **Twilio / SendGrid:** SMS and email notifications.
- **IoT / Sensor APIs:** Future — equipment telemetry for predictive maintenance.

All integrations go through `supabase/functions/` Edge Functions or the `features/connectors/` layer, never directly from the frontend.

---

## Industry Context & Design Principles

This platform is informed by field service industry best practices (IFS/Future of Field Service, TSIA, Gartner FSM). Key design principles:

1. **Property-centric hierarchy.** Property management revolves around locations. The Customer → Property → Equipment hierarchy mirrors how this business operates.
2. **Multi-trade support.** Dispatchers must filter by trade, match technicians by skill, and report revenue by trade — all first-class concepts.
3. **First-visit success.** Access notes, equipment history, and past work orders at a property all serve the goal of resolving issues on the first visit.
4. **Operational debt over technical debt.** Per McKinsey: don't throw people at operational problems — address them at the foundation. Automate workflows, don't just digitize paperwork.
5. **Customer experience parity with B2C.** Aftermarket customers now expect uptime, predictability, and self-service akin to consumer experiences. The customer portal and real-time status tracking serve this.

---

## Commands & Scripts

```bash
# Local development
npm run dev                      # Start Vite dev server
npx supabase start               # Start local Supabase (Postgres, Auth, Realtime)
npx supabase db push              # Apply migrations to local DB
npx supabase gen types ts         # Regenerate TypeScript types from schema

# Testing
npm run test                      # Run Vitest
npm run test:watch                # Watch mode

# Code quality
npm run lint                      # ESLint
npm run typecheck                 # tsc --noEmit

# Database
npx supabase migration new <name> # Create new migration file
npx supabase db reset             # Reset local DB and re-run all migrations + seed
```

---

## What Not To Do

- **Do not** install Redux, MobX, or any other state management library.
- **Do not** create a custom Express/Fastify backend. Supabase handles the API layer.
- **Do not** use CSS-in-JS libraries (styled-components, emotion). Tailwind only.
- **Do not** scaffold mobile (React Native) code until Phase 6.
- **Do not** build features out of phase order without explicit approval.
- **Do not** put domain-specific logic in `src/components/`. Use `src/features/`.
- **Do not** call `supabase.from(...)` directly in component files. Route through `api.ts`.
- **Do not** skip writing RLS policies for new tables.
- **Do not** use `any` types without a `TODO` comment explaining why.
- **Do not** create migration files by hand — use `npx supabase migration new <name>`.
- **Do not** hardcode to any specific CRM's API in platform code. All CRM interactions go through the `CrmAdapter` interface.
- **Do not** call external CRM APIs from the frontend. CRM sync runs through Edge Functions or server-side adapter code.

