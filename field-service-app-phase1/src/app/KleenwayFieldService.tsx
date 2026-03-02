import { useState } from "react";
import {
  LayoutDashboard, Users, Building2, ClipboardList, Calendar,
  Wrench, FileText, Receipt, BarChart3, Settings,
  Search, Bell, PanelLeftClose, PanelLeft, Plus, ChevronRight,
  Phone, Mail, MapPin, ArrowLeft, Edit, Sparkles,
  User, AlertCircle, Clock, ShieldCheck,
  HardHat, CheckCircle2,
  Inbox, Bot, UserCheck,
  MailOpen, ThumbsDown,
  Target, Cpu, RefreshCw,
} from "lucide-react";

// ─── Kleenway Branding ──────────────────────────────────────────────────────

const KW = {
  green900: "#14532d", green800: "#166534", green700: "#15803d",
  green600: "#16a34a", green500: "#22c55e", green100: "#dcfce7", green50: "#f0fdf4",
  slate900: "#0f172a", slate700: "#334155", slate500: "#64748b",
  slate400: "#94a3b8", slate200: "#e2e8f0", slate100: "#f1f5f9", slate50: "#f8fafc",
  amber500: "#f59e0b", amber100: "#fef3c7",
  red500: "#ef4444", red100: "#fee2e2",
  blue500: "#3b82f6", blue100: "#dbeafe", blue50: "#eff6ff",
  violet500: "#8b5cf6", violet100: "#ede9fe",
};

// ─── Seed Data ──────────────────────────────────────────────────────────────

const CUSTOMERS = [
  { id: "c1", type: "commercial", displayName: "City of Toronto — Municipal Buildings", email: "facilities@toronto.ca", phone: "(416) 338-0000", tags: ["government", "custodial-contract"], source: "RFP", notes: "Multiple municipal buildings across Toronto. Strict green cleaning requirements. CIMS-GB compliance mandatory.", created: "2023-01-15", slaTier: "premium" },
  { id: "c2", type: "commercial", displayName: "Metrolinx — GO Transit", email: "facilities@metrolinx.com", phone: "(416) 869-3200", tags: ["transit", "multi-site", "24/7"], source: "RFP", notes: "GO Transit stations and maintenance facilities. High-traffic areas require overnight cleaning rotations.", created: "2023-06-10", slaTier: "priority" },
  { id: "c3", type: "commercial", displayName: "MLSE — Scotiabank Arena", email: "ops@mlse.com", phone: "(416) 815-5500", tags: ["entertainment", "event-driven"], source: "referral", notes: "Post-event cleaning for Scotiabank Arena. Surge staffing needed for concert and playoff seasons.", created: "2023-09-22", slaTier: "standard" },
  { id: "c4", type: "commercial", displayName: "Enbridge — Corporate Campus", email: "facilities@enbridge.com", phone: "(416) 753-7811", tags: ["corporate", "custodial-contract"], source: "RFP", notes: "Corporate HQ campus. Executive floors require white-glove service. ISO 14001 environmental compliance.", created: "2024-02-01", slaTier: "premium" },
  { id: "c5", type: "commercial", displayName: "YMCA Greater Toronto", email: "maintenance@ymcagta.org", phone: "(416) 928-9622", tags: ["non-profit", "multi-site", "recreation"], source: "referral", notes: "12 locations across GTA. Pool areas, gymnasiums, childcare centres. Specialized disinfection protocols.", created: "2024-05-18", slaTier: "standard" },
  { id: "c6", type: "commercial", displayName: "York Regional Police", email: "admin@yrp.ca", phone: "(905) 895-1221", tags: ["government", "secure-facility"], source: "RFP", notes: "Secure facilities. Background-checked co-workers only. Evidence handling areas require specialized protocols.", created: "2024-08-30", slaTier: "priority" },
];

const PROPERTIES = [
  { id: "p1", customerId: "c1", name: "City Hall", address: "100 Queen Street West, Toronto, ON M5H 2N2", type: "government", accessNotes: "Security clearance at main desk. After-hours access via south entrance.", sqft: 340000, clearance: false, defaultTrade: "custodial" },
  { id: "p2", customerId: "c1", name: "Metro Hall", address: "55 John Street, Toronto, ON M5V 3C6", type: "government", accessNotes: "Loading dock on John St. Freight elevator B.", sqft: 280000, clearance: false, defaultTrade: "custodial" },
  { id: "p3", customerId: "c2", name: "Union Station — GO Concourse", address: "65 Front Street West, Toronto, ON M5J 1E6", type: "transit", accessNotes: "Access through staff corridor Level P1. Safety vest required.", sqft: 180000, clearance: false, defaultTrade: "specialty_surfaces" },
  { id: "p4", customerId: "c3", name: "Scotiabank Arena", address: "40 Bay Street, Toronto, ON M5J 2X2", type: "entertainment", accessNotes: "Event schedule determines access windows. Gate 3 for co-workers.", sqft: 750000, clearance: false, defaultTrade: "custodial" },
  { id: "p5", customerId: "c4", name: "Enbridge HQ", address: "500 Consumers Road, Toronto, ON M2J 1P8", type: "corporate", accessNotes: "Badge access required. Executive floors 8-10 after 7PM only.", sqft: 420000, clearance: false, defaultTrade: "custodial" },
  { id: "p6", customerId: "c5", name: "Central YMCA", address: "20 Grosvenor Street, Toronto, ON M4Y 2V5", type: "recreation", accessNotes: "Pool chemical storage B2. Childcare wing locked after 6PM.", sqft: 95000, clearance: false, defaultTrade: "custodial" },
  { id: "p7", customerId: "c6", name: "YRP District 1 HQ", address: "240 Prospect Street, Newmarket, ON L3Y 3T5", type: "secure_facility", accessNotes: "Escort required at all times. No phones in restricted areas.", sqft: 110000, clearance: true, defaultTrade: "custodial" },
];

const WORK_ORDERS = [
  { id: "wo1", number: "WO-2026-00001", customerId: "c1", title: "City Hall — Nightly custodial rotation", trade: "custodial", priority: "normal", status: "scheduled", date: "Mar 3", intake: "manual", dispatch: "auto", confidence: 95 },
  { id: "wo2", number: "WO-2026-00002", customerId: "c3", title: "Post-event deep clean — Raptors vs Celtics", trade: "custodial", priority: "high", status: "ready_for_dispatch", date: "Mar 1", intake: "email", dispatch: null, confidence: 88 },
  { id: "wo3", number: "WO-2026-00003", customerId: "c2", title: "Union Station — Floor restoration, main concourse", trade: "specialty_surfaces", priority: "normal", status: "scheduled", date: "Mar 8", intake: "email", dispatch: "recommended", confidence: 82 },
  { id: "wo4", number: "WO-2026-00004", customerId: "c4", title: "Enbridge executive floor — carpet extraction", trade: "custodial", priority: "high", status: "in_progress", date: "Mar 1", intake: "phone", dispatch: "auto", confidence: 91 },
  { id: "wo5", number: "WO-2026-00005", customerId: "c5", title: "YMCA Central — Mould remediation, pool change room", trade: "abatement", priority: "emergency", status: "ready_for_dispatch", date: "Mar 1", intake: "email", dispatch: null, confidence: 76 },
  { id: "wo6", number: "WO-2026-00006", customerId: "c6", title: "YRP HQ — Annual facility maintenance audit", trade: "consulting", priority: "normal", status: "scheduled", date: "Mar 15", intake: "email", dispatch: "manual", confidence: 65 },
  { id: "wo7", number: "WO-2026-00007", customerId: "c1", title: "Metro Hall — Emergency flood cleanup, 3rd floor", trade: "emergency", priority: "emergency", status: "dispatched", date: "Mar 1", intake: "phone", dispatch: "recommended", confidence: null },
];

const INTAKE_QUEUE = [
  {
    id: "ie1", from: "ops@mlse.com", subject: "Need cleanup crew after tonight's concert — March 2",
    body: "Hi Kleenway, we have a Taylor Swift concert tonight (sold out, 19K capacity). Need the full post-event cleaning crew for tomorrow morning starting 6AM. Standard post-concert scope: seating bowl, concourse, washrooms, VIP areas.",
    received: "11:42 AM", customer: CUSTOMERS[2], property: PROPERTIES[3],
    classifiedTrade: "custodial", classifiedPriority: "high", confidence: 94,
    matchReason: "Known sender (ops@mlse.com → MLSE). Facility: Scotiabank Arena matched from body. Trade: custodial (keyword: 'cleaning crew'). Priority: high (19K capacity event)."
  },
  {
    id: "ie2", from: "facilities@enbridge.com", subject: "RE: Carpet stain 8th floor boardroom",
    body: "Urgent — we have a board meeting Thursday at 9am and there's a large coffee stain on the carpet in the main boardroom on 8. Can someone come tomorrow to treat it? Thanks, Sandra",
    received: "10:18 AM", customer: CUSTOMERS[3], property: PROPERTIES[4],
    classifiedTrade: "custodial", classifiedPriority: "high", confidence: 87,
    matchReason: "Known sender (facilities@enbridge.com → Enbridge). Facility: Enbridge HQ (matched 'boardroom on 8' → exec floors). Trade: custodial (keyword: 'carpet stain'). Priority: high (keyword: 'urgent', 'board meeting')."
  },
  {
    id: "ie3", from: "unknown@newclient.ca", subject: "Looking for janitorial services",
    body: "Hello, we are a new condo development at 77 Charles Street and are looking for a janitorial services provider. Can someone call me to discuss? My number is 416-555-9876. Thanks, Patrick.",
    received: "9:03 AM", customer: null, property: null,
    classifiedTrade: "custodial", classifiedPriority: "low", confidence: 22,
    matchReason: "Unknown sender (no customer match). No facility match. Appears to be a new business inquiry, not a service request. Flagged for manual review."
  },
];

const DISPATCH_CANDIDATES = [
  { id: "dc1", name: "Nkechi A.", role: "Lead Custodial", proximity: 92, workload: 85, history: 96, familiarity: 100, cost: 78, composite: 92, avatar: "NA" },
  { id: "dc2", name: "Carlos M.", role: "Sr. Custodial", proximity: 88, workload: 70, history: 90, familiarity: 60, cost: 85, composite: 81, avatar: "CM" },
  { id: "dc3", name: "Aisha T.", role: "Custodial", proximity: 75, workload: 95, history: 72, familiarity: 40, cost: 92, composite: 74, avatar: "AT" },
];

const TYPE_LABELS: Record<string, string> = { government: "Government", transit: "Transit", entertainment: "Entertainment", corporate: "Corporate", recreation: "Recreation", secure_facility: "Secure Facility" };
const STATUS_STYLES: Record<string, string> = { new: "bg-slate-100 text-slate-700", intake_review: "bg-blue-100 text-blue-700", auto_classified: "bg-cyan-100 text-cyan-700", ready_for_dispatch: "bg-amber-100 text-amber-800", scheduled: "bg-emerald-100 text-emerald-800", dispatched: "bg-green-100 text-green-800", in_progress: "bg-green-200 text-green-900", completed: "bg-green-300 text-green-900", cancelled: "bg-red-100 text-red-700" };
const PRIORITY_STYLES: Record<string, string> = { low: "bg-slate-100 text-slate-600", normal: "bg-emerald-50 text-emerald-700", high: "bg-amber-100 text-amber-700", emergency: "bg-red-100 text-red-700" };
const SLA_STYLES: Record<string, { bg: string; text: string }> = { standard: { bg: "bg-slate-100", text: "text-slate-600" }, priority: { bg: "bg-blue-100", text: "text-blue-700" }, premium: { bg: "bg-amber-100", text: "text-amber-700" } };

const TRADE_CONFIG: Record<string, { icon: typeof Sparkles; label: string; color: string }> = {
  custodial: { icon: Sparkles, label: "Custodial Care", color: "text-emerald-600" },
  facility_maintenance: { icon: Wrench, label: "Facility Maintenance", color: "text-slate-600" },
  abatement: { icon: ShieldCheck, label: "Abatement & Remediation", color: "text-orange-600" },
  specialty_surfaces: { icon: HardHat, label: "Specialty Surfaces", color: "text-violet-600" },
  consulting: { icon: ClipboardList, label: "Consulting & Advisory", color: "text-blue-600" },
  emergency: { icon: AlertCircle, label: "Emergency Response", color: "text-red-600" },
};

// ─── Shared Components ──────────────────────────────────────────────────────

function Badge({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`} style={style}>{children}</span>;
}
function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.new;
  const label = status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return <Badge className={style}>{label}</Badge>;
}
function DispatchBadge({ method }: { method: string | null }) {
  if (!method) return null;
  const cfg: Record<string, { icon: typeof Bot; label: string; bg: string }> = { auto: { icon: Bot, label: "Auto", bg: "bg-emerald-50 border-emerald-200 text-emerald-700" }, recommended: { icon: UserCheck, label: "Recommended", bg: "bg-blue-50 border-blue-200 text-blue-700" }, manual: { icon: User, label: "Manual", bg: "bg-slate-50 border-slate-200 text-slate-600" } };
  const c = cfg[method] ?? cfg.manual!;
  const Icon = c!.icon;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${c!.bg}`}><Icon className="w-3 h-3" />{c!.label}</span>;
}
function ConfidenceDot({ score }: { score: number | null }) {
  if (score == null) return null;
  const color = score >= 80 ? KW.green600 : score >= 50 ? KW.amber500 : KW.red500;
  return <span className="inline-flex items-center gap-1 text-[10px] font-medium" style={{ color }}><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />{score}%</span>;
}
function ScoreBar({ score, label }: { score: number; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium w-16 text-right" style={{ color: KW.slate500 }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: KW.slate100 }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: score >= 80 ? KW.green600 : score >= 50 ? KW.amber500 : KW.red500 }} />
      </div>
      <span className="text-[10px] font-semibold w-6" style={{ color: KW.slate700 }}>{score}</span>
    </div>
  );
}

// ─── Login Page ─────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #14532d 0%, #166534 40%, #1e3a2f 100%)" }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='a' patternUnits='userSpaceOnUse' width='60' height='60'%3E%3Cpath d='M0 30h60M30 0v60' stroke='%23fff' stroke-width='.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='60' height='60'/%3E%3C/svg%3E\")" }} />
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}><Sparkles className="w-5 h-5 text-white" /></div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight" style={{ color: KW.green800 }}>Kleenway</div>
                <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">Field Service</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm">Sign in to the dispatch platform</p>
          </div>
          <div className="px-8 pb-8 space-y-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label><input type="email" defaultValue="dispatch@kleenwayservices.com" className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label><input type="password" defaultValue="••••••••" className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white" /></div>
            <button onClick={onLogin} className="w-full h-10 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>Sign In</button>
            <p className="text-center text-xs text-slate-400 pt-1">24/7 Emergency Line: <span className="font-semibold text-slate-600">1-888-638-5587</span></p>
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-6">Since 1981 · Cleaner · Safer · Greener</p>
      </div>
    </div>
  );
}

// ─── Main Layout ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NavigateFn = (page: string, data?: any) => void;

function AppLayout() {
  const [page, setPage] = useState("dashboard");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedIntake, setSelectedIntake] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedWO, setSelectedWO] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "intake", label: "Intake Queue", icon: Inbox, badge: INTAKE_QUEUE.length },
    { id: "work-orders", label: "Work Orders", icon: ClipboardList },
    { id: "customers", label: "Clients", icon: Users },
    { id: "properties", label: "Facilities", icon: Building2 },
    { id: "dispatch", label: "Dispatch Board", icon: Calendar, phase: 4 },
    { id: "technicians", label: "Co-Workers", icon: HardHat, phase: 3 },
    { id: "estimates", label: "Estimates", icon: FileText, phase: 6 },
    { id: "invoices", label: "Invoices", icon: Receipt, phase: 6 },
    { id: "reports", label: "Reports", icon: BarChart3, phase: 5 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredCustomers = CUSTOMERS.filter(c => {
    if (customerSearch && !c.displayName.toLowerCase().includes(customerSearch.toLowerCase())) return false;
    return true;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate: NavigateFn = (p, data?) => {
    setPage(p);
    if (p === "customer-detail") setSelectedCustomer(data);
    if (p === "intake-detail") setSelectedIntake(data);
    if (p === "wo-detail") setSelectedWO(data);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: KW.slate50 }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} flex flex-col shrink-0 transition-all duration-200`} style={{ background: KW.green900 }}>
        <div className="h-14 flex items-center px-4 border-b border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}><Sparkles className="w-3.5 h-3.5 text-white" /></div>
              <div><span className="text-sm font-bold text-white tracking-tight">Kleenway</span><span className="text-[9px] text-emerald-400/70 ml-1.5 font-medium">DISPATCH</span></div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}><Sparkles className="w-4 h-4 text-white" /></div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = page === item.id || (page === "customer-detail" && item.id === "customers") || (page === "intake-detail" && item.id === "intake") || (page === "wo-detail" && item.id === "work-orders");
            return (
              <button key={item.id} onClick={() => navigate(item.id)} className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors mb-0.5 ${active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/8 hover:text-white/90"} ${sidebarOpen ? "" : "justify-center"}`} title={!sidebarOpen ? item.label : undefined}>
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {sidebarOpen && item.badge && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>}
                {sidebarOpen && item.phase && !item.badge && <span className="ml-auto text-[10px] text-emerald-400/50 bg-white/10 rounded px-1.5 py-0.5">P{item.phase}</span>}
              </button>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div className="p-3 border-t border-white/10">
            <div className="rounded-lg bg-white/8 p-3">
              <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-emerald-400" /><span className="text-xs font-medium text-emerald-300">Auto-Dispatch Active</span></div>
              <p className="text-[10px] text-white/40 mt-1">3 rules · 80% confidence threshold</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center justify-between border-b bg-white px-4 shrink-0" style={{ borderColor: KW.slate200 }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500">{sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}</button>
            <div className="relative hidden sm:block"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input placeholder="Search clients, work orders, facilities..." className="h-9 w-72 pl-8 pr-3 rounded-lg border text-sm bg-slate-50 focus:outline-none focus:ring-2 placeholder:text-slate-400" style={{ borderColor: KW.slate200 }} /></div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 relative"><Bell className="w-5 h-5" /><span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span></button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: KW.green700 }}>BG</div>
              {sidebarOpen && <span className="text-sm font-medium text-slate-700 hidden lg:block">Bill G.</span>}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          {page === "dashboard" && <DashboardView navigate={navigate} />}
          {page === "intake" && <IntakeQueueView items={INTAKE_QUEUE} onSelect={(item) => navigate("intake-detail", item)} />}
          {page === "intake-detail" && selectedIntake && <IntakeDetailView item={selectedIntake} onBack={() => navigate("intake")} onApprove={() => navigate("work-orders")} />}
          {page === "work-orders" && <WorkOrdersView items={WORK_ORDERS} onSelect={(wo) => navigate("wo-detail", wo)} />}
          {page === "wo-detail" && selectedWO && <WODetailView wo={selectedWO} onBack={() => navigate("work-orders")} />}
          {page === "customers" && <CustomersView customers={filteredCustomers} search={customerSearch} setSearch={setCustomerSearch} onSelect={(c) => navigate("customer-detail", c)} />}
          {page === "customer-detail" && selectedCustomer && <CustomerDetailView customer={selectedCustomer} onBack={() => navigate("customers")} />}
          {page === "properties" && <PropertiesView />}
          {!["dashboard","intake","intake-detail","work-orders","wo-detail","customers","customer-detail","properties"].includes(page) && <PlaceholderView name={navItems.find(n => n.id === page)?.label || page} phase={navItems.find(n => n.id === page)?.phase} />}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard (Automation-First) ───────────────────────────────────────────

function DashboardView({ navigate }: { navigate: NavigateFn }) {
  const autoDispatched = WORK_ORDERS.filter(w => w.dispatch === "auto").length;
  const total = WORK_ORDERS.length;
  const autoRate = Math.round((autoDispatched / total) * 100);
  const pendingDispatch = WORK_ORDERS.filter(w => w.status === "ready_for_dispatch").length;

  const stats = [
    { label: "Auto-Dispatch Rate", value: `${autoRate}%`, icon: Bot, sub: `${autoDispatched}/${total} work orders`, color: KW.green700, bg: KW.green50 },
    { label: "Intake Queue", value: INTAKE_QUEUE.length.toString(), icon: Inbox, sub: "emails pending review", color: KW.amber500, bg: KW.amber100, action: () => navigate("intake") },
    { label: "Ready for Dispatch", value: pendingDispatch.toString(), icon: Target, sub: "awaiting matching", color: KW.blue500, bg: KW.blue100 },
    { label: "Active Work Orders", value: total.toString(), icon: ClipboardList, sub: "across 6 clients", color: KW.violet500, bg: KW.violet100 },
  ];

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: KW.slate900 }}>Good afternoon, Bill</h1>
        <p className="text-sm mt-0.5" style={{ color: KW.slate500 }}>Automation dashboard — Saturday, March 1, 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} onClick={s.action} className={`bg-white rounded-xl border p-4 ${s.action ? "cursor-pointer hover:shadow-sm" : ""}`} style={{ borderColor: KW.slate200 }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: KW.slate500 }}>{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}><s.icon className="w-4 h-4" style={{ color: s.color }} /></div>
            </div>
            <div className="text-2xl font-bold" style={{ color: KW.slate900 }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: KW.slate400 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Intake Queue Preview */}
        <div className="lg:col-span-3 bg-white rounded-xl border" style={{ borderColor: KW.slate200 }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: KW.slate100 }}>
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4" style={{ color: KW.amber500 }} />
              <h2 className="font-semibold text-sm" style={{ color: KW.slate900 }}>Incoming Emails</h2>
              <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{INTAKE_QUEUE.length}</span>
            </div>
            <button onClick={() => navigate("intake")} className="text-xs font-medium hover:underline" style={{ color: KW.green700 }}>View queue</button>
          </div>
          <div className="divide-y" style={{ borderColor: KW.slate100 }}>
            {INTAKE_QUEUE.map(item => (
              <div key={item.id} onClick={() => navigate("intake-detail", item)} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.confidence >= 80 ? KW.green50 : item.confidence >= 50 ? KW.amber100 : KW.red100 }}>
                  <MailOpen className="w-4 h-4" style={{ color: item.confidence >= 80 ? KW.green700 : item.confidence >= 50 ? KW.amber500 : KW.red500 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: KW.slate900 }}>{item.subject}</div>
                  <div className="text-xs" style={{ color: KW.slate400 }}>{item.from} · {item.received}</div>
                </div>
                <ConfidenceDot score={item.confidence} />
                {item.confidence >= 80 ? <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">Auto-classify</Badge> : item.confidence >= 50 ? <Badge className="bg-amber-50 text-amber-700 text-[10px]">Review</Badge> : <Badge className="bg-red-50 text-red-700 text-[10px]">Manual</Badge>}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl border" style={{ borderColor: KW.slate200 }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: KW.slate100 }}><h2 className="font-semibold text-sm" style={{ color: KW.slate900 }}>Quick Actions</h2></div>
          <div className="p-3 space-y-1.5">
            {[
              { label: "Review Intake Queue", desc: `${INTAKE_QUEUE.length} emails pending`, icon: Inbox, bg: KW.amber500, action: () => navigate("intake") },
              { label: "New Work Order", desc: "Create manually", icon: ClipboardList, bg: KW.green700 },
              { label: "Dispatch Settings", desc: "Scoring weights & thresholds", icon: Cpu, bg: KW.blue500 },
              { label: "Emergency Dispatch", desc: "Fire, flood, or trauma", icon: AlertCircle, bg: "#dc2626" },
            ].map(a => (
              <button key={a.label} onClick={a.action} className="w-full flex items-center gap-3 rounded-lg border p-3 hover:shadow-sm transition-all text-left active:scale-[0.99]" style={{ borderColor: KW.slate200 }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm" style={{ background: a.bg }}><a.icon className="w-4 h-4 text-white" /></div>
                <div className="flex-1"><div className="text-sm font-medium" style={{ color: KW.slate900 }}>{a.label}</div><div className="text-xs" style={{ color: KW.slate400 }}>{a.desc}</div></div>
                <ChevronRight className="w-4 h-4" style={{ color: KW.slate400 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Automation Pipeline */}
      <div className="bg-white rounded-xl border" style={{ borderColor: KW.slate200 }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: KW.slate100 }}>
          <div className="flex items-center gap-2"><Cpu className="w-4 h-4" style={{ color: KW.green600 }} /><h2 className="font-semibold text-sm" style={{ color: KW.slate900 }}>Automation Pipeline Status</h2></div>
        </div>
        <div className="grid grid-cols-5 divide-x" style={{ borderColor: KW.slate100 }}>
          {[
            { label: "Email Intake", icon: MailOpen, count: INTAKE_QUEUE.length, status: "active", desc: "Parsing inbound" },
            { label: "Classification", icon: Cpu, count: 1, status: "active", desc: "Enriching WOs" },
            { label: "Smart Matching", icon: Target, count: pendingDispatch, status: "active", desc: "Scoring candidates" },
            { label: "Auto-Dispatch", icon: Bot, count: autoDispatched, status: "active", desc: `${autoRate}% auto rate` },
            { label: "Notifications", icon: Bell, count: 4, status: "active", desc: "SMS + email sent" },
          ].map(s => (
            <div key={s.label} className="p-4 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: KW.green600 }} />
              <div className="text-lg font-bold" style={{ color: KW.slate900 }}>{s.count}</div>
              <div className="text-[10px] font-semibold" style={{ color: KW.slate700 }}>{s.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: KW.slate400 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Intake Queue ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IntakeQueueView({ items, onSelect }: { items: typeof INTAKE_QUEUE; onSelect: (item: any) => void }) {
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: KW.slate900 }}>Intake Queue</h1>
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{items.length}</span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: KW.slate500 }}>Inbound emails auto-parsed into draft work orders. Review and approve.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 bg-white border text-sm font-medium rounded-lg flex items-center gap-1.5" style={{ borderColor: KW.slate200, color: KW.slate700 }}><RefreshCw className="w-4 h-4" /> Refresh</button>
        </div>
      </div>

      {/* Confidence legend */}
      <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg" style={{ background: KW.slate100 }}>
        <span className="text-xs font-medium" style={{ color: KW.slate500 }}>Confidence:</span>
        <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full" style={{ background: KW.green600 }} /> 80%+ Auto-classify</span>
        <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full" style={{ background: KW.amber500 }} /> 50–79% One-click review</span>
        <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full" style={{ background: KW.red500 }} /> &lt;50% Manual</span>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} onClick={() => onSelect(item)} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-all cursor-pointer" style={{ borderColor: KW.slate200 }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: item.confidence >= 80 ? KW.green50 : item.confidence >= 50 ? KW.amber100 : KW.red100 }}>
                <MailOpen className="w-5 h-5" style={{ color: item.confidence >= 80 ? KW.green700 : item.confidence >= 50 ? KW.amber500 : KW.red500 }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm" style={{ color: KW.slate900 }}>{item.subject}</span>
                  <ConfidenceDot score={item.confidence} />
                </div>
                <div className="text-xs mb-2" style={{ color: KW.slate400 }}>From: {item.from} · Received: {item.received}</div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: KW.slate700 }}>{item.body}</p>
                <div className="flex items-center gap-2 mt-2.5">
                  {item.customer && <Badge className="border text-[10px]" style={{ borderColor: KW.slate200, color: KW.slate700 }}><Building2 className="w-3 h-3 mr-1" />{item.customer.displayName.split("—")[0]!.trim()}</Badge>}
                  {item.property && <Badge className="border text-[10px]" style={{ borderColor: KW.slate200, color: KW.slate700 }}><MapPin className="w-3 h-3 mr-1" />{item.property.name}</Badge>}
                  {item.classifiedTrade && <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">{TRADE_CONFIG[item.classifiedTrade]?.label || item.classifiedTrade}</Badge>}
                  <Badge className={PRIORITY_STYLES[item.classifiedPriority]}>{item.classifiedPriority}</Badge>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 mt-2" style={{ color: KW.slate400 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Intake Detail ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IntakeDetailView({ item, onBack, onApprove }: { item: any; onBack: () => void; onApprove: () => void }) {
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-md hover:bg-slate-100" style={{ color: KW.slate500 }}><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: KW.slate900 }}>{item.subject}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: KW.slate500 }}>From: {item.from}</span>
            <span className="text-sm" style={{ color: KW.slate400 }}>· {item.received}</span>
            <ConfidenceDot score={item.confidence} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Email content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: KW.slate200 }}>
            <h2 className="font-semibold text-sm mb-3" style={{ color: KW.slate900 }}>Email Body</h2>
            <div className="text-sm leading-relaxed whitespace-pre-line p-4 rounded-lg" style={{ background: KW.slate50, color: KW.slate700 }}>{item.body}</div>
          </div>

          {/* Classification reasoning */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: KW.slate200 }}>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4" style={{ color: KW.green600 }} />
              <h2 className="font-semibold text-sm" style={{ color: KW.slate900 }}>Auto-Classification Reasoning</h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: KW.slate700 }}>{item.matchReason}</p>
          </div>
        </div>

        {/* Parsed fields + actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: KW.slate200 }}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: KW.slate900 }}>Parsed Work Order Draft</h2>
            <div className="space-y-3">
              <div><div className="text-[10px] font-semibold uppercase mb-1" style={{ color: KW.slate400 }}>Client</div><div className="text-sm font-medium" style={{ color: item.customer ? KW.slate900 : KW.red500 }}>{item.customer ? item.customer.displayName : "⚠ Not matched — manual assignment required"}</div></div>
              <div><div className="text-[10px] font-semibold uppercase mb-1" style={{ color: KW.slate400 }}>Facility</div><div className="text-sm font-medium" style={{ color: item.property ? KW.slate900 : KW.red500 }}>{item.property ? item.property.name : "⚠ Not matched"}</div>{item.property && <div className="text-xs mt-0.5" style={{ color: KW.slate400 }}>{item.property.address}</div>}</div>
              <div><div className="text-[10px] font-semibold uppercase mb-1" style={{ color: KW.slate400 }}>Trade</div><Badge className="bg-emerald-50 text-emerald-700">{TRADE_CONFIG[item.classifiedTrade]?.label || item.classifiedTrade}</Badge></div>
              <div><div className="text-[10px] font-semibold uppercase mb-1" style={{ color: KW.slate400 }}>Priority</div><Badge className={PRIORITY_STYLES[item.classifiedPriority]}>{item.classifiedPriority}</Badge></div>
              <div><div className="text-[10px] font-semibold uppercase mb-1" style={{ color: KW.slate400 }}>Confidence</div><ConfidenceDot score={item.confidence} /></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-white rounded-xl border p-5 space-y-2" style={{ borderColor: KW.slate200 }}>
            <h2 className="font-semibold text-sm mb-3" style={{ color: KW.slate900 }}>Actions</h2>
            {item.confidence >= 50 && (
              <button onClick={onApprove} className="w-full h-10 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]" style={{ background: KW.green700 }}>
                <CheckCircle2 className="w-4 h-4" /> Approve & Create Work Order
              </button>
            )}
            <button className="w-full h-10 text-sm font-medium rounded-lg border transition-all flex items-center justify-center gap-2" style={{ borderColor: KW.slate200, color: KW.slate700 }}>
              <Edit className="w-4 h-4" /> Edit & Create Work Order
            </button>
            <button className="w-full h-10 text-sm font-medium rounded-lg border transition-all flex items-center justify-center gap-2" style={{ borderColor: KW.slate200, color: KW.slate400 }}>
              <ThumbsDown className="w-4 h-4" /> Not a Service Request
            </button>
          </div>

          {item.property && (
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: KW.slate200 }}>
              <h2 className="font-semibold text-sm mb-2" style={{ color: KW.slate900 }}>Access Notes</h2>
              <p className="text-xs leading-relaxed" style={{ color: KW.slate700 }}>{item.property.accessNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Work Orders (with automation indicators) ───────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WorkOrdersView({ items, onSelect }: { items: typeof WORK_ORDERS; onSelect: (wo: any) => void }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? items : items.filter(wo => wo.status === filter);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: KW.slate900 }}>Work Orders</h1>
          <p className="text-sm mt-0.5" style={{ color: KW.slate500 }}>Track and manage all service requests. Automation indicators show dispatch method.</p>
        </div>
        <button className="h-9 px-4 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-sm" style={{ background: KW.green700 }}><Plus className="w-4 h-4" /> New Work Order</button>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {([["all","All"],["ready_for_dispatch","Ready for Dispatch"],["scheduled","Scheduled"],["dispatched","Dispatched"],["in_progress","In Progress"]] as const).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className={`h-8 px-3 rounded-md text-xs font-medium transition-colors ${filter === val ? "text-white" : "bg-white border text-slate-600 hover:bg-slate-50"}`} style={filter === val ? { background: KW.green800 } : { borderColor: KW.slate200 }}>{label}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(wo => {
          const customer = CUSTOMERS.find(c => c.id === wo.customerId);
          const trade = TRADE_CONFIG[wo.trade] ?? TRADE_CONFIG.custodial;
          const TradeIcon = trade!.icon;
          return (
            <div key={wo.id} onClick={() => onSelect(wo)} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer" style={{ borderColor: KW.slate200 }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: KW.green50 }}>
                <TradeIcon className="w-5 h-5" style={{ color: KW.green700 }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: KW.slate900 }}>{wo.title}</div>
                <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: KW.slate400 }}>
                  <span>{wo.number}</span><span>·</span>
                  <span>{customer?.displayName?.split("—")[0]?.trim()}</span><span>·</span>
                  <span>{wo.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ConfidenceDot score={wo.confidence} />
                <DispatchBadge method={wo.dispatch} />
                <Badge className={PRIORITY_STYLES[wo.priority]}>{wo.priority}</Badge>
                <StatusBadge status={wo.status} />
              </div>
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: KW.slate400 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── WO Detail with Dispatch Candidates ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WODetailView({ wo, onBack }: { wo: any; onBack: () => void }) {
  const customer = CUSTOMERS.find(c => c.id === wo.customerId);
  const showCandidates = wo.status === "ready_for_dispatch";

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-md hover:bg-slate-100" style={{ color: KW.slate500 }}><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: KW.slate900 }}>{wo.title}</h1>
            <StatusBadge status={wo.status} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-mono" style={{ color: KW.slate500 }}>{wo.number}</span>
            <DispatchBadge method={wo.dispatch} />
            <ConfidenceDot score={wo.confidence} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: KW.slate200 }}>
            <h2 className="font-semibold text-sm mb-3" style={{ color: KW.slate900 }}>Details</h2>
            <div className="space-y-2.5 text-sm">
              <div><span className="font-medium" style={{ color: KW.slate500 }}>Client: </span><span style={{ color: KW.slate900 }}>{customer?.displayName}</span></div>
              <div><span className="font-medium" style={{ color: KW.slate500 }}>Trade: </span><Badge className="bg-emerald-50 text-emerald-700">{TRADE_CONFIG[wo.trade]?.label}</Badge></div>
              <div><span className="font-medium" style={{ color: KW.slate500 }}>Priority: </span><Badge className={PRIORITY_STYLES[wo.priority]}>{wo.priority}</Badge></div>
              <div><span className="font-medium" style={{ color: KW.slate500 }}>Intake: </span><span style={{ color: KW.slate700 }}>{wo.intake}</span></div>
              <div><span className="font-medium" style={{ color: KW.slate500 }}>Dispatch: </span><DispatchBadge method={wo.dispatch} /></div>
              {customer?.slaTier && SLA_STYLES[customer.slaTier] && <div><span className="font-medium" style={{ color: KW.slate500 }}>SLA: </span><Badge className={`${SLA_STYLES[customer.slaTier]!.bg} ${SLA_STYLES[customer.slaTier]!.text}`}>{customer.slaTier}</Badge></div>}
            </div>
          </div>
        </div>

        {/* Dispatch Candidates panel */}
        <div className="lg:col-span-2">
          {showCandidates ? (
            <div className="bg-white rounded-xl border" style={{ borderColor: KW.slate200 }}>
              <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: KW.slate100 }}>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: KW.green600 }} />
                  <h2 className="font-semibold text-sm" style={{ color: KW.slate900 }}>Dispatch Candidates</h2>
                  <Badge className="bg-amber-50 text-amber-700 text-[10px]">Awaiting approval</Badge>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: KW.slate100 }}>
                {DISPATCH_CANDIDATES.map((c, i) => (
                  <div key={c.id} className={`px-5 py-4 ${i === 0 ? "bg-emerald-50/30" : ""}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: i === 0 ? KW.green700 : KW.slate400 }}>{c.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: KW.slate900 }}>{c.name}</span>
                          <span className="text-xs" style={{ color: KW.slate500 }}>{c.role}</span>
                          {i === 0 && <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Top match</Badge>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold" style={{ color: c.composite >= 80 ? KW.green700 : c.composite >= 50 ? KW.amber500 : KW.red500 }}>{c.composite}</div>
                        <div className="text-[10px]" style={{ color: KW.slate400 }}>composite</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <ScoreBar score={c.proximity} label="Proximity" />
                      <ScoreBar score={c.workload} label="Workload" />
                      <ScoreBar score={c.history} label="History" />
                      <ScoreBar score={c.familiarity} label="Familiarity" />
                      <ScoreBar score={c.cost} label="Cost" />
                    </div>
                    {i === 0 && (
                      <button className="mt-3 w-full h-9 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]" style={{ background: KW.green700 }}>
                        <CheckCircle2 className="w-4 h-4" /> Assign {c.name}
                      </button>
                    )}
                    {i > 0 && (
                      <button className="mt-3 w-full h-9 text-sm font-medium rounded-lg border transition-all flex items-center justify-center gap-2" style={{ borderColor: KW.slate200, color: KW.slate700 }}>
                        <UserCheck className="w-4 h-4" /> Select Instead
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: KW.slate200 }}>
              {wo.dispatch === "auto" ? (
                <>
                  <Bot className="w-10 h-10 mx-auto mb-3" style={{ color: KW.green600 }} />
                  <h3 className="font-semibold" style={{ color: KW.slate900 }}>Auto-Dispatched</h3>
                  <p className="text-sm mt-1" style={{ color: KW.slate500 }}>This work order was automatically assigned by the dispatch engine. Composite score exceeded the 80% threshold.</p>
                </>
              ) : wo.dispatch === "recommended" ? (
                <>
                  <UserCheck className="w-10 h-10 mx-auto mb-3" style={{ color: KW.blue500 }} />
                  <h3 className="font-semibold" style={{ color: KW.slate900 }}>Dispatcher Confirmed</h3>
                  <p className="text-sm mt-1" style={{ color: KW.slate500 }}>The engine recommended candidates and the dispatcher selected the assignment.</p>
                </>
              ) : (
                <>
                  <User className="w-10 h-10 mx-auto mb-3" style={{ color: KW.slate400 }} />
                  <h3 className="font-semibold" style={{ color: KW.slate900 }}>Manual Assignment</h3>
                  <p className="text-sm mt-1" style={{ color: KW.slate500 }}>This work order was assigned manually by the dispatcher.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Clients ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomersView({ customers, search, setSearch, onSelect }: { customers: typeof CUSTOMERS; search: string; setSearch: (s: string) => void; onSelect: (c: any) => void }) {
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight" style={{ color: KW.slate900 }}>Clients</h1><p className="text-sm mt-0.5" style={{ color: KW.slate500 }}>Commercial accounts and facility contracts.</p></div>
        <button className="h-9 px-4 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-sm" style={{ background: KW.green700 }}><Plus className="w-4 h-4" /> Add Client</button>
      </div>
      <div className="relative max-w-xs"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: KW.slate400 }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="h-9 w-full pl-8 pr-3 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2" style={{ borderColor: KW.slate200 }} /></div>
      <div className="space-y-2">
        {customers.map(c => (
          <button key={c.id} onClick={() => onSelect(c)} className="w-full bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-all text-left" style={{ borderColor: KW.slate200 }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: KW.green50 }}><Building2 className="w-5 h-5" style={{ color: KW.green700 }} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><span className="font-medium text-sm" style={{ color: KW.slate900 }}>{c.displayName}</span>{c.slaTier && SLA_STYLES[c.slaTier] && <Badge className={`${SLA_STYLES[c.slaTier]!.bg} ${SLA_STYLES[c.slaTier]!.text} text-[10px]`}>{c.slaTier} SLA</Badge>}</div>
              <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: KW.slate400 }}><span>{c.email}</span><span>{c.phone}</span></div>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: KW.slate400 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Client Detail ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomerDetailView({ customer, onBack }: { customer: any; onBack: () => void }) {
  const customerProperties = PROPERTIES.filter(p => p.customerId === customer.id);
  const customerWOs = WORK_ORDERS.filter(wo => wo.customerId === customer.id);
  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-md hover:bg-slate-100" style={{ color: KW.slate500 }}><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: KW.slate900 }}>{customer.displayName}</h1>
              {customer.slaTier && SLA_STYLES[customer.slaTier] && <Badge className={`${SLA_STYLES[customer.slaTier]!.bg} ${SLA_STYLES[customer.slaTier]!.text}`}>{customer.slaTier} SLA</Badge>}
            </div>
            <p className="text-sm" style={{ color: KW.slate500 }}>Client since {customer.created}</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: KW.slate200 }}>
          <h2 className="font-semibold text-sm mb-4" style={{ color: KW.slate900 }}>Contact Info</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-sm"><Mail className="w-4 h-4" style={{ color: KW.slate400 }} /><span style={{ color: KW.green700 }}>{customer.email}</span></div>
            <div className="flex items-center gap-2.5 text-sm"><Phone className="w-4 h-4" style={{ color: KW.slate400 }} /><span style={{ color: KW.slate700 }}>{customer.phone}</span></div>
            <div className="flex flex-wrap gap-1 pt-1">{customer.tags.map((t: string) => <Badge key={t} className="border text-[10px]" style={{ borderColor: KW.slate200, color: KW.slate500 }}>{t}</Badge>)}</div>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border" style={{ borderColor: KW.slate200 }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: KW.slate100 }}><h2 className="font-semibold text-sm" style={{ color: KW.slate900 }}>Facilities ({customerProperties.length})</h2></div>
          <div className="divide-y" style={{ borderColor: KW.slate100 }}>
            {customerProperties.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: KW.green50 }}><MapPin className="w-4 h-4" style={{ color: KW.green700 }} /></div>
                <div className="flex-1 min-w-0"><div className="text-sm font-medium" style={{ color: KW.slate900 }}>{p.name}</div><div className="text-xs truncate" style={{ color: KW.slate400 }}>{p.address}</div></div>
                {p.clearance && <Badge className="bg-red-50 text-red-700 text-[10px]">Clearance</Badge>}
                <Badge className="text-[10px]" style={{ background: KW.slate100, color: KW.slate500 }}>{TYPE_LABELS[p.type]}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      {customerWOs.length > 0 && (
        <div className="bg-white rounded-xl border" style={{ borderColor: KW.slate200 }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: KW.slate100 }}><h2 className="font-semibold text-sm" style={{ color: KW.slate900 }}>Work Orders ({customerWOs.length})</h2></div>
          <div className="divide-y" style={{ borderColor: KW.slate100 }}>
            {customerWOs.map(wo => {
              const trade = TRADE_CONFIG[wo.trade] ?? TRADE_CONFIG.custodial;
              const TradeIcon = trade!.icon;
              return (
                <div key={wo.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: KW.green50 }}><TradeIcon className="w-4 h-4" style={{ color: KW.green700 }} /></div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate" style={{ color: KW.slate900 }}>{wo.title}</div><div className="text-xs" style={{ color: KW.slate400 }}>{wo.number} · {wo.date}</div></div>
                  <DispatchBadge method={wo.dispatch} />
                  <Badge className={PRIORITY_STYLES[wo.priority]}>{wo.priority}</Badge>
                  <StatusBadge status={wo.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {customer.notes && <div className="bg-white rounded-xl border p-5" style={{ borderColor: KW.slate200 }}><h2 className="font-semibold text-sm mb-2" style={{ color: KW.slate900 }}>Notes</h2><p className="text-sm leading-relaxed" style={{ color: KW.slate700 }}>{customer.notes}</p></div>}
    </div>
  );
}

// ─── Facilities ─────────────────────────────────────────────────────────────

function PropertiesView() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight" style={{ color: KW.slate900 }}>Facilities</h1><p className="text-sm mt-0.5" style={{ color: KW.slate500 }}>Service locations and site details.</p></div>
        <button className="h-9 px-4 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shadow-sm" style={{ background: KW.green700 }}><Plus className="w-4 h-4" /> Add Facility</button>
      </div>
      <div className="space-y-2">
        {PROPERTIES.map(p => {
          const customer = CUSTOMERS.find(c => c.id === p.customerId);
          return (
            <div key={p.id} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer" style={{ borderColor: KW.slate200 }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: KW.green50 }}><MapPin className="w-5 h-5" style={{ color: KW.green700 }} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="font-medium text-sm" style={{ color: KW.slate900 }}>{p.name}</span>{p.clearance && <Badge className="bg-red-50 text-red-700 text-[10px]">Clearance Required</Badge>}<Badge className="text-[10px]" style={{ background: KW.slate100, color: KW.slate500 }}>{TYPE_LABELS[p.type]}</Badge></div>
                <div className="text-xs truncate mt-0.5" style={{ color: KW.slate400 }}>{p.address}</div>
              </div>
              <span className="hidden md:block text-xs" style={{ color: KW.slate400 }}>{customer?.displayName?.split("—")[0]?.trim()}</span>
              {p.sqft && <span className="hidden lg:block text-xs" style={{ color: KW.slate400 }}>{p.sqft.toLocaleString()} sqft</span>}
              <ChevronRight className="w-4 h-4 shrink-0" style={{ color: KW.slate400 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Placeholder ────────────────────────────────────────────────────────────

function PlaceholderView({ name, phase }: { name: string; phase?: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: KW.green50 }}><Clock className="w-8 h-8" style={{ color: KW.green600 }} /></div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: KW.slate900 }}>{name}</h1>
      <p className="text-sm mt-1 max-w-sm" style={{ color: KW.slate500 }}>{phase ? `This module is coming in Phase ${phase} of the platform build.` : "This section will be configured for your organization."}</p>
    </div>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────

export default function KleenwayFieldService() {
  const [authenticated, setAuthenticated] = useState(false);
  if (!authenticated) return <LoginPage onLogin={() => setAuthenticated(true)} />;
  return <AppLayout />;
}
