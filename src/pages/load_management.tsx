import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadStatus = "In Transit" | "Pending" | "Delivered" | "At Risk";
type Priority   = "High" | "Medium" | "Low";

interface Load {
    id:          string;
    driver:      string;
    origin:      string;
    destination: string;
    departure:   string;
    eta:         string;
    miles:       number;
    weight:      string;
    revenue:     number;
    status:      LoadStatus;
    priority:    Priority;
    progress:    number;
    carrier:     string;
    shipper:     string;
    commodity:   string;
}

interface KPI {
    label:    string;
    value:    string;
    sub:      string;
    delta:    string;
    positive: boolean;
    icon:     React.ReactNode;
    color:    string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const LOADS: Load[] = [
    {
        id: "LD-4821",  driver: "Marcus Webb",    origin: "Chicago, IL",      destination: "Dallas, TX",
        departure: "Today 06:30",   eta: "Tomorrow 18:00", miles: 921,  weight: "42,000 lbs",
        revenue: 3840, status: "In Transit", priority: "High",   progress: 58, carrier: "Webb Transport",
        shipper: "Midwest Cold Storage", commodity: "Refrigerated Goods",
    },
    {
        id: "LD-4822",  driver: "Sandra Torres",  origin: "Los Angeles, CA",  destination: "Phoenix, AZ",
        departure: "Today 08:00",   eta: "Today 17:30",    miles: 372,  weight: "36,500 lbs",
        revenue: 1620, status: "In Transit", priority: "Medium", progress: 72, carrier: "Torres Hauling",
        shipper: "Pacific Distributors", commodity: "Electronics",
    },
    {
        id: "LD-4823",  driver: "Roy Ellison",    origin: "Atlanta, GA",      destination: "Miami, FL",
        departure: "Today 10:15",   eta: "Today 21:00",    miles: 661,  weight: "28,000 lbs",
        revenue: 2290, status: "At Risk",    priority: "High",   progress: 31, carrier: "Ellison Freight",
        shipper: "Southern Textiles", commodity: "Apparel",
    },
    {
        id: "LD-4824",  driver: "Diana Cheng",    origin: "Seattle, WA",      destination: "Portland, OR",
        departure: "Tomorrow 07:00", eta: "Tomorrow 11:30", miles: 178, weight: "19,200 lbs",
        revenue: 890,  status: "Pending",    priority: "Low",    progress: 0,  carrier: "Cheng Logistics",
        shipper: "Northwest Farms", commodity: "Produce",
    },
    {
        id: "LD-4819",  driver: "James Kowalski", origin: "Denver, CO",       destination: "Kansas City, MO",
        departure: "Yesterday 14:00", eta: "Today 08:00",   miles: 600, weight: "38,000 lbs",
        revenue: 2550, status: "Delivered",  priority: "Medium", progress: 100, carrier: "Kowalski Trucking",
        shipper: "Rocky Mountain Goods", commodity: "Dry Freight",
    },
    {
        id: "LD-4820",  driver: "Aisha Powell",   origin: "Houston, TX",      destination: "New Orleans, LA",
        departure: "Yesterday 20:00", eta: "Today 06:00",   miles: 348, weight: "44,000 lbs",
        revenue: 1740, status: "Delivered",  priority: "Low",    progress: 100, carrier: "Powell Transport",
        shipper: "Gulf Coast Energy", commodity: "Industrial Parts",
    },
];

const STATUS_STYLE: Record<LoadStatus, string> = {
    "In Transit": "text-cyan-300    border-cyan-500/40    bg-cyan-500/10",
    "Pending":    "text-amber-300   border-amber-500/40   bg-amber-500/10",
    "Delivered":  "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    "At Risk":    "text-rose-300    border-rose-500/40    bg-rose-500/10",
};

const PRIORITY_DOT: Record<Priority, string> = {
    High:   "bg-rose-400",
    Medium: "bg-amber-400",
    Low:    "bg-emerald-400",
};

const PROGRESS_GRADIENT: Record<LoadStatus, string> = {
    "In Transit": "from-cyan-500 to-teal-400",
    "Pending":    "from-amber-500 to-orange-400",
    "Delivered":  "from-emerald-500 to-green-400",
    "At Risk":    "from-rose-500 to-red-400",
};

// ─── KPI Cards ────────────────────────────────────────────────────────────────

const KPIS: KPI[] = [
    {
        label: "Active Loads",
        value: "3",
        sub: "Currently in transit",
        delta: "+2 vs yesterday",
        positive: true,
        color: "text-cyan-300",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <rect x="4" y="14" width="32" height="20" rx="3" stroke="#00e5cc" strokeWidth="1.5" opacity="0.4" />
                <path d="M4 20h32" stroke="#00e5cc" strokeWidth="1" opacity="0.3" />
                <rect x="14" y="8" width="12" height="8" rx="2" stroke="#00e5cc" strokeWidth="1.5" />
                <circle cx="11" cy="34" r="3" fill="#061d26" stroke="#00e5cc" strokeWidth="1.5" />
                <circle cx="29" cy="34" r="3" fill="#061d26" stroke="#00e5cc" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        label: "Today's Revenue",
        value: "$8,190",
        sub: "Across 4 loads",
        delta: "+12% vs last week",
        positive: true,
        color: "text-emerald-300",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <circle cx="20" cy="20" r="15" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />
                <path d="M14 20h12M20 14v12" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 10v2M20 28v2M10 20h2M28 20h2" stroke="#34d399" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        label: "On-Time Rate",
        value: "94.2%",
        sub: "Last 30 days",
        delta: "+1.4% this month",
        positive: true,
        color: "text-violet-300",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <circle cx="20" cy="20" r="14" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4" />
                <path d="M20 10v10l6 4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="2" fill="#a78bfa" />
            </svg>
        ),
    },
    {
        label: "At Risk",
        value: "1",
        sub: "Requires attention",
        delta: "ETA delay possible",
        positive: false,
        color: "text-rose-300",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <path d="M20 6L4 34h32L20 6z" stroke="#f87171" strokeWidth="1.5" strokeLinejoin="round" opacity="0.4" />
                <line x1="20" y1="18" x2="20" y2="26" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
                <circle cx="20" cy="30" r="1.5" fill="#f87171" />
            </svg>
        ),
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
    return (
        <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="6.5"  cy="16" r="2" fill="white" />
                        <circle cx="17.5" cy="16" r="2" fill="white" />
                        <path d="M2 11h11" stroke="white" strokeWidth="1" opacity="0.5" />
                    </svg>
                </div>
                <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-sm group-hover:bg-cyan-400/40 transition-colors" />
            </div>
            <span className="font-bold text-lg tracking-tight">
                <span className="text-white">fleet</span>
                <span className="text-cyan-400">pulse</span>
            </span>
        </a>
    );
}

function KPICard({ kpi }: { kpi: KPI }) {
    return (
        <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
                background: "rgba(6,29,42,0.7)",
                border: "1px solid rgba(0,229,204,0.12)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="p-2 rounded-xl"
                    style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.1)" }}
                >
                    {kpi.icon}
                </div>
                <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        kpi.positive
                            ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
                            : "text-rose-300 border-rose-500/30 bg-rose-500/10"
                    }`}
                >
                    {kpi.delta}
                </span>
            </div>
            <div className={`text-3xl font-bold ${kpi.color} mb-0.5`}>{kpi.value}</div>
            <div className="text-sm font-semibold text-slate-200">{kpi.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{kpi.sub}</div>
        </div>
    );
}

function LoadRow({ load, onClick, selected }: { load: Load; onClick: () => void; selected: boolean }) {
    return (
        <tr
            onClick={onClick}
            className="cursor-pointer transition-colors duration-150"
            style={{
                background: selected
                    ? "rgba(0,229,204,0.06)"
                    : "transparent",
                borderBottom: "1px solid rgba(0,229,204,0.07)",
            }}
        >
            {/* Load ID */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[load.priority]}`} />
                    <span className="text-cyan-400 font-mono text-sm font-semibold">{load.id}</span>
                </div>
            </td>
            {/* Driver */}
            <td className="px-4 py-3.5">
                <div className="text-sm text-slate-200 font-medium">{load.driver}</div>
                <div className="text-xs text-slate-500">{load.carrier}</div>
            </td>
            {/* Route */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span>{load.origin}</span>
                    <svg viewBox="0 0 16 8" fill="none" className="w-4 h-3 text-cyan-600 flex-shrink-0">
                        <path d="M0 4h14M11 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{load.destination}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{load.miles} mi · {load.weight}</div>
            </td>
            {/* ETA */}
            <td className="px-4 py-3.5">
                <div className="text-sm text-slate-300">{load.eta}</div>
                <div className="text-xs text-slate-500">{load.departure}</div>
            </td>
            {/* Progress */}
            <td className="px-4 py-3.5 w-36">
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-700/70 overflow-hidden">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${PROGRESS_GRADIENT[load.status]}`}
                            style={{ width: `${load.progress}%`, transition: "width 0.8s ease" }}
                        />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{load.progress}%</span>
                </div>
            </td>
            {/* Status */}
            <td className="px-4 py-3.5">
                <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLE[load.status]}`}>
                    {load.status.toUpperCase()}
                </span>
            </td>
            {/* Revenue */}
            <td className="px-4 py-3.5 text-right">
                <span className="text-sm font-semibold text-emerald-300">${load.revenue.toLocaleString()}</span>
            </td>
        </tr>
    );
}

function DetailPanel({ load, onClose }: { load: Load; onClose: () => void }) {
    return (
        <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
                background: "rgba(4,15,22,0.95)",
                border: "1px solid rgba(0,229,204,0.18)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 0 60px rgba(0,229,204,0.06), 0 24px 64px rgba(0,0,0,0.6)",
            }}
        >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, rgba(0,229,204,0.06) 0%, transparent 70%)" }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono font-bold text-lg">{load.id}</span>
                        <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLE[load.status]}`}>
                            {load.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-sm text-slate-400 mt-0.5">{load.commodity}</div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 transition-colors"
                    style={{ background: "rgba(0,229,204,0.06)" }}
                >
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Route visualization */}
            <div
                className="rounded-xl p-4 mb-5"
                style={{ background: "rgba(0,229,204,0.04)", border: "1px solid rgba(0,229,204,0.1)" }}
            >
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Origin</div>
                        <div className="text-sm font-semibold text-slate-200">{load.origin}</div>
                        <div className="text-xs text-slate-500">{load.departure}</div>
                    </div>
                    <div className="flex-1 mx-4 relative">
                        <div className="h-px bg-gradient-to-r from-cyan-500/30 via-cyan-400/60 to-cyan-500/30 relative">
                            <div
                                className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/60"
                                style={{ left: `${load.progress}%`, transform: "translate(-50%, -50%)" }}
                            />
                        </div>
                        <div className="text-center text-xs text-cyan-400 font-medium mt-2">{load.progress}% complete</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Destination</div>
                        <div className="text-sm font-semibold text-slate-200">{load.destination}</div>
                        <div className="text-xs text-slate-500">ETA {load.eta}</div>
                    </div>
                </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                    { label: "Driver",    value: load.driver },
                    { label: "Carrier",   value: load.carrier },
                    { label: "Shipper",   value: load.shipper },
                    { label: "Commodity", value: load.commodity },
                    { label: "Distance",  value: `${load.miles} miles` },
                    { label: "Weight",    value: load.weight },
                    { label: "Priority",  value: load.priority },
                    { label: "Revenue",   value: `$${load.revenue.toLocaleString()}` },
                ].map((item) => (
                    <div key={item.label}
                         className="rounded-lg px-3 py-2.5"
                         style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                        <div className={`text-sm font-medium ${item.label === "Revenue" ? "text-emerald-300" : "text-slate-200"}`}>
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#040f16] transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #00e5cc, #14b8a6)" }}
                >
                    Update Status
                </button>
                <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-300 transition-colors"
                    style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.15)" }}
                >
                    Contact Driver
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LoadManagementPage() {
    const [activeTab,   setActiveTab]   = useState<"All" | LoadStatus>("All");
    const [selectedId,  setSelectedId]  = useState<string | null>("LD-4821");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [scrolled,    setScrolled]    = useState<boolean>(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const TABS: Array<"All" | LoadStatus> = ["All", "In Transit", "Pending", "At Risk", "Delivered"];

    const filtered = LOADS.filter((l) => {
        const matchTab    = activeTab === "All" || l.status === activeTab;
        const matchSearch = !searchQuery || [l.id, l.driver, l.origin, l.destination, l.shipper]
            .some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchTab && matchSearch;
    });

    const selected = LOADS.find((l) => l.id === selectedId) ?? null;

    return (
        <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#040f16" }}>

            {/* ── Ambient background ───────────────────────── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full"
                     style={{ background: "radial-gradient(circle, rgba(0,229,204,0.04) 0%, transparent 70%)" }} />
                <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full"
                     style={{ background: "radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)" }} />
                {/* Grid pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00e5cc" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* ── Top bar (matches screenshot style) ───────── */}
            <header
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled ? "rgba(4,15,22,0.92)" : "rgba(4,15,22,0.75)",
                    backdropFilter: "blur(16px)",
                    borderBottom: "1px solid rgba(0,229,204,0.1)",
                }}
            >
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #34d399" }} />
                        <span className="text-sm font-semibold text-slate-200">Load Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#040f16]"
                             style={{ background: "linear-gradient(135deg, #00e5cc, #14b8a6)" }}>
                            AM
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-sm font-medium text-slate-200">Andrew Martin</div>
                            <div className="text-xs text-slate-500">Admin</div>
                        </div>
                        <button
                            className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                            style={{ background: "rgba(0,229,204,0.06)", border: "1px solid rgba(0,229,204,0.12)" }}
                        >
                            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                <path d="M6 2h8M6 8h8M6 14h8M2 2v.01M2 8v.01M2 14v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Page body ─────────────────────────────────── */}
            <main className="relative pt-24 pb-16 px-4 sm:px-6 max-w-screen-2xl mx-auto">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                         style={{ background: "rgba(0,229,204,0.08)", border: "1px solid rgba(0,229,204,0.2)", color: "#00e5cc" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                        FleetPulse Load Management
                    </div>
                </div>

                {/* Page title */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                            Load Management
                        </h1>
                        <p className="text-slate-400 mt-1.5 text-sm">
                            Track and manage all loads, assignments, and delivery status in real time.
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#040f16] transition-opacity hover:opacity-90 self-start sm:self-auto"
                        style={{ background: "linear-gradient(135deg, #00e5cc, #14b8a6)", boxShadow: "0 0 24px rgba(0,229,204,0.25)" }}
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        New Load
                    </button>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {KPIS.map((kpi) => <KPICard key={kpi.label} kpi={kpi} />)}
                </div>

                {/* Main split layout */}
                <div className="flex flex-col xl:flex-row gap-5">

                    {/* Left: table */}
                    <div className="flex-1 min-w-0">
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: "rgba(6,29,42,0.6)",
                                border: "1px solid rgba(0,229,204,0.1)",
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            {/* Toolbar */}
                            <div className="px-5 pt-5 pb-4"
                                 style={{ borderBottom: "1px solid rgba(0,229,204,0.07)" }}>
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                    {/* Search */}
                                    <div className="relative w-full sm:w-64">
                                        <svg viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                                            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search loads, drivers, routes…"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-colors"
                                            style={{
                                                background: "rgba(0,0,0,0.3)",
                                                border: "1px solid rgba(0,229,204,0.12)",
                                            }}
                                        />
                                    </div>
                                    {/* Count badge */}
                                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                                          style={{ background: "rgba(0,229,204,0.08)", color: "#00e5cc", border: "1px solid rgba(0,229,204,0.2)" }}>
                                        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                                    </span>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-1 mt-3 overflow-x-auto">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150"
                                            style={
                                                activeTab === tab
                                                    ? { background: "linear-gradient(135deg,#00e5cc,#14b8a6)", color: "#040f16" }
                                                    : { background: "rgba(0,229,204,0.04)", color: "#94a3b8",
                                                        border: "1px solid rgba(0,229,204,0.08)" }
                                            }
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(0,229,204,0.07)" }}>
                                        {["Load ID", "Driver", "Route", "ETA", "Progress", "Status", "Revenue"].map((h) => (
                                            <th key={h}
                                                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                                                No loads match your filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((load) => (
                                            <LoadRow
                                                key={load.id}
                                                load={load}
                                                selected={selectedId === load.id}
                                                onClick={() => setSelectedId(selectedId === load.id ? null : load.id)}
                                            />
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 flex items-center justify-between"
                                 style={{ borderTop: "1px solid rgba(0,229,204,0.07)" }}>
                                <span className="text-xs text-slate-500">
                                    Page 1 of 1 · {filtered.length} total loads
                                </span>
                                <div className="flex gap-1">
                                    {["←", "→"].map((a) => (
                                        <button key={a}
                                                className="w-7 h-7 rounded-lg text-xs text-slate-500 hover:text-cyan-300 transition-colors flex items-center justify-center"
                                                style={{ background: "rgba(0,229,204,0.04)", border: "1px solid rgba(0,229,204,0.08)" }}>
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: detail panel */}
                    <div className="xl:w-80 flex-shrink-0">
                        {selected ? (
                            <DetailPanel load={selected} onClose={() => setSelectedId(null)} />
                        ) : (
                            <div
                                className="rounded-2xl p-8 flex flex-col items-center justify-center text-center h-64 xl:h-full"
                                style={{
                                    background: "rgba(6,29,42,0.5)",
                                    border: "1px dashed rgba(0,229,204,0.15)",
                                }}
                            >
                                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 mb-3 opacity-30">
                                    <rect x="6" y="14" width="36" height="24" rx="4" stroke="#00e5cc" strokeWidth="1.5" />
                                    <path d="M6 22h36" stroke="#00e5cc" strokeWidth="1" opacity="0.5" />
                                    <circle cx="16" cy="38" r="3" fill="#061d26" stroke="#00e5cc" strokeWidth="1.5" />
                                    <circle cx="32" cy="38" r="3" fill="#061d26" stroke="#00e5cc" strokeWidth="1.5" />
                                </svg>
                                <div className="text-sm text-slate-500">Select a load to view details</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}