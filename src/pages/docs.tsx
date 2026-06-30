import { useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocSection {
    id: string;
    label: string;
    icon: React.ReactNode;
    articles: DocArticle[];
}

interface DocArticle {
    id: string;
    title: string;
    desc: string;
    badge?: string;
    badgeColor?: string;
    readTime: string;
    updated: string;
}

interface QuickLink {
    icon: React.ReactNode;
    title: string;
    desc: string;
    href: string;
    accent: string;
    tag: string;
    tagColor: string;
}

interface ChangelogEntry {
    version: string;
    date: string;
    tag: string;
    tagColor: string;
    changes: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK_LINKS: QuickLink[] = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        ),
        title: "Getting Started",
        desc: "Install your ELD, pair the app, and go live in 15 minutes.",
        href: "#getting-started",
        accent: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
        tag: "START HERE",
        tagColor: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "API Reference",
        desc: "Full REST API docs with code samples in JS, Python, and cURL.",
        href: "#api-reference",
        accent: "border-violet-500/30 bg-violet-500/8 text-violet-300",
        tag: "DEVELOPERS",
        tagColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "HOS & ELD Compliance",
        desc: "FMCSA regulations, hours of service rules, and DOT audit guides.",
        href: "#eld-compliance",
        accent: "border-amber-500/30 bg-amber-500/8 text-amber-300",
        tag: "COMPLIANCE",
        tagColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        ),
        title: "Integrations",
        desc: "Connect to DAT, Truckstop, QuickBooks, your TMS, and more.",
        href: "#integrations",
        accent: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
        tag: "INTEGRATIONS",
        tagColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    },
];

const DOC_SECTIONS: DocSection[] = [
    {
        id: "getting-started",
        label: "Getting Started",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L2 7l8 5 8-5-8-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M2 12l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        articles: [
            { id: "eld-setup",       title: "ELD Hardware Setup",                desc: "Unbox, plug in, and pair your FleetPulse ELD device with the mobile app.",    badge: "START HERE", badgeColor: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",  readTime: "5 min", updated: "Jun 2026" },
            { id: "app-install",     title: "Driver App Installation",            desc: "Download, log in, and configure the driver app on iOS or Android.",            readTime: "3 min", updated: "May 2026" },
            { id: "first-log",       title: "Creating Your First Driver Log",     desc: "Step-by-step walkthrough of creating and submitting your first ELD log.",       readTime: "4 min", updated: "May 2026" },
            { id: "admin-setup",     title: "Fleet Admin Account Setup",          desc: "Configure your fleet profile, add trucks, invite drivers, and set permissions.", readTime: "7 min", updated: "Apr 2026" },
            { id: "billing",         title: "Billing & Subscription Management",  desc: "Understand your invoice, update payment methods, and manage plan changes.",     readTime: "3 min", updated: "Apr 2026" },
        ],
    },
    {
        id: "eld-compliance",
        label: "ELD & HOS Compliance",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        articles: [
            { id: "hos-overview",    title: "Hours of Service Overview",          desc: "Understand the 11-hour drive, 14-hour on-duty, 30-min break, and 70-hour cycle rules.", badge: "ESSENTIAL", badgeColor: "text-amber-300 border-amber-500/40 bg-amber-500/10", readTime: "8 min", updated: "Jun 2026" },
            { id: "duty-status",     title: "Duty Status Changes Explained",      desc: "How FleetPulse auto-detects and logs Off Duty, Sleeper Berth, Driving, and On Duty.",  readTime: "6 min", updated: "May 2026" },
            { id: "dvir",            title: "Pre & Post-Trip DVIR Inspections",   desc: "How to complete a Driver Vehicle Inspection Report in the app before and after trips.",  readTime: "4 min", updated: "May 2026" },
            { id: "dot-audit",       title: "DOT Roadside Inspection Transfer",   desc: "Transfer your ELD data to an officer via Bluetooth, USB, or telematics in seconds.",    readTime: "3 min", updated: "Apr 2026" },
            { id: "violations",      title: "Understanding HOS Violations",       desc: "What triggers a violation, how to annotate logs, and filing a DataQ dispute.",           readTime: "7 min", updated: "Apr 2026" },
            { id: "exempt",          title: "ELD Exemptions & Exceptions",        desc: "Short-haul exemption, adverse conditions, 16-hour short-haul exception, and more.",     readTime: "5 min", updated: "Mar 2026" },
        ],
    },
    {
        id: "fleet-management",
        label: "Fleet Management",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M2 10h12l3 4v2H2V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="5" cy="16" r="1.5" fill="currentColor" />
                <circle cx="14" cy="16" r="1.5" fill="currentColor" />
            </svg>
        ),
        articles: [
            { id: "live-tracking",   title: "Live GPS Fleet Tracking",            desc: "Understanding the map view, filtering trucks, and configuring location update intervals.", readTime: "5 min", updated: "Jun 2026" },
            { id: "geofencing",      title: "Setting Up Geofences",               desc: "Create arrival and departure alerts for yards, customers, and restricted zones.",          readTime: "4 min", updated: "May 2026" },
            { id: "dispatch",        title: "Dispatch Board & Load Assignment",   desc: "Use the drag-and-drop board to assign loads, message drivers, and track ETAs.",           readTime: "6 min", updated: "May 2026" },
            { id: "driver-scores",   title: "Driver Scorecards & Safety Events",  desc: "How scoring works, what triggers events, and how to coach drivers from the dashboard.",   readTime: "5 min", updated: "Apr 2026" },
            { id: "maintenance",     title: "Predictive Maintenance Alerts",      desc: "Configure OBD-II fault thresholds, mileage reminders, and maintenance workflows.",        readTime: "6 min", updated: "Apr 2026" },
        ],
    },
    {
        id: "api-reference",
        label: "API Reference",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M7 8l-4 4 4 4M13 8l4 4-4 4M11 4l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        articles: [
            { id: "api-auth",        title: "Authentication & API Keys",          desc: "Generate API keys, understand OAuth 2.0 scopes, and secure your integration.",       badge: "NEW", badgeColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10", readTime: "4 min", updated: "Jun 2026" },
            { id: "api-vehicles",    title: "Vehicles API",                       desc: "CRUD operations for vehicles, live location endpoints, and telemetry streams.",       readTime: "10 min", updated: "Jun 2026" },
            { id: "api-drivers",     title: "Drivers & HOS API",                  desc: "Read driver logs, duty status, violations, and push duty status changes via API.",    readTime: "12 min", updated: "May 2026" },
            { id: "api-loads",       title: "Loads & Dispatch API",               desc: "Create, update, and assign loads programmatically. Webhook events on status change.", readTime: "10 min", updated: "May 2026" },
            { id: "webhooks",        title: "Webhooks & Event Streaming",         desc: "Subscribe to real-time events: location updates, HOS alerts, load status changes.",  readTime: "7 min", updated: "Apr 2026" },
        ],
    },
    {
        id: "integrations",
        label: "Integrations",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="5"  cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        articles: [
            { id: "dat",             title: "DAT Freight Load Board",             desc: "Connect FleetPulse to DAT for automatic load posting and carrier search.",              readTime: "5 min", updated: "May 2026" },
            { id: "truckstop",       title: "Truckstop Integration",              desc: "Sync loads and book carriers directly from Truckstop inside FleetPulse.",              readTime: "4 min", updated: "May 2026" },
            { id: "quickbooks",      title: "QuickBooks Accounting Sync",         desc: "Export IFTA reports, invoices, and driver settlements directly to QuickBooks.",         readTime: "6 min", updated: "Apr 2026" },
            { id: "mcleod",          title: "McLeod TMS Integration",             desc: "Bidirectional sync between FleetPulse and McLeod for dispatch and billing.",           readTime: "8 min", updated: "Apr 2026" },
            { id: "fuel-cards",      title: "Fuel Card Integrations (EFS, Comdata)", desc: "Automatically import fuel transactions for IFTA and cost-per-mile reporting.",     readTime: "5 min", updated: "Mar 2026" },
        ],
    },
    {
        id: "ifta-reporting",
        label: "IFTA & Reporting",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        articles: [
            { id: "ifta-overview",   title: "IFTA Reporting Overview",            desc: "How FleetPulse calculates miles per jurisdiction and generates quarterly returns.",      badge: "POPULAR", badgeColor: "text-violet-300 border-violet-500/40 bg-violet-500/10", readTime: "6 min", updated: "Jun 2026" },
            { id: "ifta-export",     title: "Exporting IFTA Reports",             desc: "Download IFTA-ready PDFs, CSV files, or push directly to your filing software.",       readTime: "3 min", updated: "May 2026" },
            { id: "custom-reports",  title: "Custom Fleet Reports",               desc: "Build driver performance, fuel efficiency, and cost-per-mile reports from scratch.",    readTime: "7 min", updated: "Apr 2026" },
        ],
    },
];

const CHANGELOG: ChangelogEntry[] = [
    {
        version: "v3.8.0",
        date: "June 4, 2026",
        tag: "LATEST",
        tagColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
        changes: [
            "AI carrier matching now includes historical lane performance scoring",
            "Shipper portal supports custom subdomain (yourname.fleetpulse.com)",
            "New webhook events: load.delivered, driver.hos_violation",
        ],
    },
    {
        version: "v3.7.2",
        date: "May 19, 2026",
        tag: "PATCH",
        tagColor: "text-blue-300 border-blue-500/40 bg-blue-500/10",
        changes: [
            "Fixed duty status sync delay on Android 14 devices",
            "DVIR photo upload now supports HEIC format",
        ],
    },
    {
        version: "v3.7.0",
        date: "May 5, 2026",
        tag: "FEATURE",
        tagColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
        changes: [
            "IFTA export now generates state-by-state PDF breakdowns",
            "Dispatch board: multi-load drag-and-drop assignment",
            "Driver app: offline mode for logs when cell signal is unavailable",
        ],
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SearchBar({ query, onChange }: { query: string; onChange: (v: string) => void }) {
    return (
        <div className="relative">
            <svg viewBox="0 0 20 20" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M15 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
                type="text"
                value={query}
                onChange={e => onChange(e.target.value)}
                placeholder="Search documentation…"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors bg-transparent"
            />
            {query && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </div>
    );
}

function SidebarLink({
                         section,
                         active,
                         onClick,
                     }: {
    section: DocSection;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-150 ${
                active
                    ? "bg-cyan-500/12 border border-cyan-500/30 text-cyan-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
        >
            <span className={active ? "text-cyan-300" : "text-slate-500"}>{section.icon}</span>
            {section.label}
        </button>
    );
}

function ArticleCard({ article }: { article: DocArticle }) {
    return (
        <a
            href={`#${article.id}`}
            className="glass rounded-xl p-5 border border-slate-700/30 card-glow group hover:border-cyan-500/30 transition-all duration-200 block"
        >
            <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors leading-snug">
                    {article.title}
                </h3>
                {article.badge && (
                    <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${article.badgeColor}`}>
                        {article.badge}
                    </span>
                )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">{article.desc}</p>
            <div className="flex items-center gap-3 text-[10px] text-slate-600">
                <span className="flex items-center gap-1">
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                        <path d="M6 4v2l1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    {article.readTime} read
                </span>
                <span>Updated {article.updated}</span>
                <span className="ml-auto text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium">
                    Read
                    <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
        </a>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState<string>("getting-started");
    const [searchQuery, setSearchQuery]     = useState<string>("");
    const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

    const currentSection = DOC_SECTIONS.find(s => s.id === activeSection)!;

    // Filter articles by search query across all sections
    const searchResults = searchQuery.trim().length > 1
        ? DOC_SECTIONS.flatMap(s =>
            s.articles
                .filter(a =>
                    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.desc.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(a => ({ ...a, sectionLabel: s.label }))
        )
        : [];

    const showSearch = searchQuery.trim().length > 1;

    return (
        <div className="min-h-screen bg-[#040f16] text-white overflow-x-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-cyan-500/5  blur-[120px]" />
                <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-violet-500/4 blur-[100px]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-teal-500/3 blur-[140px]" />
                <div className="grid-bg absolute inset-0" />
            </div>

            <Navbar />

            <main className="relative pt-24">

                {/* ── Hero / Search Header ─────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14 border-b border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-2xl mx-auto text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                FleetPulse Documentation
                            </div>
                            <h1 className="font-display text-4xl sm:text-5xl font-800 text-white mb-4 leading-tight">
                                How can we help?
                            </h1>
                            <p className="text-slate-400 text-lg mb-8">
                                Guides, API references, compliance walkthroughs, and integration docs — all in one place.
                            </p>
                            <SearchBar query={searchQuery} onChange={setSearchQuery} />
                        </div>

                        {/* Quick link cards */}
                        {!showSearch && (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                {QUICK_LINKS.map((ql, i) => (
                                    <a
                                        key={i}
                                        href={ql.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const sectionId = ql.href.replace("#", "");
                                            setActiveSection(sectionId);
                                            setSearchQuery("");
                                        }}
                                        className={`glass rounded-xl p-5 border card-glow group hover:border-cyan-500/30 transition-all duration-200 ${ql.accent}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-2 glass rounded-lg ${ql.accent}`}>
                                                {ql.icon}
                                            </div>
                                            <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${ql.tagColor}`}>
                                                {ql.tag}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">{ql.title}</div>
                                        <div className="text-xs text-slate-500 leading-relaxed">{ql.desc}</div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Search Results ───────────────────────────────────────── */}
                {showSearch && (
                    <section className="px-4 sm:px-6 py-10">
                        <div className="max-w-7xl mx-auto">
                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-sm text-slate-400">
                                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for
                                </span>
                                <span className="glass rounded-full px-3 py-1 text-xs text-cyan-300 border border-cyan-500/30">
                                    "{searchQuery}"
                                </span>
                            </div>

                            {searchResults.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {searchResults.map((a) => (
                                        <div key={a.id} className="relative">
                                            <div className="absolute -top-2 left-3 z-10">
                                                <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60 text-slate-500 uppercase">
                                                    {a.sectionLabel}
                                                </span>
                                            </div>
                                            <ArticleCard article={a} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass rounded-2xl p-12 text-center border border-slate-700/30">
                                    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mx-auto mb-4 text-slate-600">
                                        <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M32 32l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M18 22h8M22 18v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <div className="text-slate-400 font-medium mb-1">No results found</div>
                                    <div className="text-xs text-slate-600">Try a different keyword or browse the sections below.</div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ── Main Docs Layout ─────────────────────────────────────── */}
                {!showSearch && (
                    <section className="px-4 sm:px-6 py-10">
                        <div className="max-w-7xl mx-auto flex gap-8">

                            {/* ── Sidebar (desktop) ──────────────────────── */}
                            <aside className="hidden lg:flex flex-col gap-1 w-56 flex-shrink-0 sticky top-24 self-start">
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">
                                    Documentation
                                </div>
                                {DOC_SECTIONS.map((s) => (
                                    <SidebarLink
                                        key={s.id}
                                        section={s}
                                        active={activeSection === s.id}
                                        onClick={() => setActiveSection(s.id)}
                                    />
                                ))}

                                {/* Divider */}
                                <div className="border-t border-slate-800/60 my-3" />
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">
                                    Resources
                                </div>
                                {[
                                    { label: "Changelog",    href: "#changelog"  },
                                    { label: "API Status",   href: "#status"     },
                                    { label: "Support",      href: "/support"    },
                                    { label: "Community",    href: "#community"  },
                                ].map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-200 hover:bg-slate-800/40 transition-all"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </aside>

                            {/* ── Mobile section picker ──────────────────── */}
                            <div className="lg:hidden w-full mb-6">
                                <button
                                    onClick={() => setMobileNavOpen(p => !p)}
                                    className="w-full glass rounded-xl px-4 py-3 text-sm text-slate-300 border border-slate-700/50 flex items-center justify-between"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-cyan-400">{currentSection.icon}</span>
                                        {currentSection.label}
                                    </span>
                                    <svg viewBox="0 0 12 12" fill="none" className={`w-3 h-3 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`}>
                                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                                {mobileNavOpen && (
                                    <div className="mt-1 glass rounded-xl border border-slate-700/50 overflow-hidden">
                                        {DOC_SECTIONS.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => { setActiveSection(s.id); setMobileNavOpen(false); }}
                                                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left border-b border-slate-800/50 last:border-0 transition-colors ${
                                                    activeSection === s.id ? "text-cyan-300 bg-cyan-500/8" : "text-slate-400 hover:text-slate-200"
                                                }`}
                                            >
                                                {s.icon}
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ── Main content ───────────────────────────── */}
                            <div className="flex-1 min-w-0">

                                {/* Section header */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                        <span>Docs</span>
                                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="text-cyan-400">{currentSection.label}</span>
                                    </div>
                                    <h2 className="font-display text-3xl font-700 text-white mb-2">{currentSection.label}</h2>
                                    <p className="text-slate-500 text-sm">
                                        {currentSection.articles.length} articles
                                    </p>
                                </div>

                                {/* Article grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {currentSection.articles.map((article) => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))}
                                </div>

                                {/* ── Changelog ──────────────────────────── */}
                                <div id="changelog" className="mt-14">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h3 className="font-display text-xl font-700 text-white">Changelog</h3>
                                        <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border text-emerald-300 border-emerald-500/40 bg-emerald-500/10">
                                            LATEST v3.8.0
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {CHANGELOG.map((entry, i) => (
                                            <div key={i} className="glass rounded-xl p-5 border border-slate-700/30">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="font-display text-base font-700 text-white">{entry.version}</span>
                                                    <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${entry.tagColor}`}>
                                                        {entry.tag}
                                                    </span>
                                                    <span className="text-xs text-slate-500 ml-auto">{entry.date}</span>
                                                </div>
                                                <ul className="space-y-1.5">
                                                    {entry.changes.map((c, j) => (
                                                        <li key={j} className="flex items-start gap-2.5 text-sm text-slate-400">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 mt-1.5 flex-shrink-0" />
                                                            {c}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── API Status ─────────────────────────── */}
                                <div id="status" className="mt-10">
                                    <h3 className="font-display text-xl font-700 text-white mb-5">API Status</h3>
                                    <div className="glass rounded-xl p-5 border border-emerald-500/20 bg-emerald-500/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-sm font-semibold text-emerald-300">All systems operational</span>
                                            <span className="text-xs text-slate-500 ml-auto">Updated 2 min ago</span>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-2">
                                            {[
                                                { name: "REST API",          status: "Operational" },
                                                { name: "Webhooks",          status: "Operational" },
                                                { name: "GPS Tracking",      status: "Operational" },
                                                { name: "ELD Sync",          status: "Operational" },
                                                { name: "Shipper Portal",    status: "Operational" },
                                                { name: "Driver Mobile App", status: "Operational" },
                                            ].map((svc) => (
                                                <div key={svc.name} className="flex items-center justify-between py-1.5 border-b border-slate-800/40 last:border-0">
                                                    <span className="text-xs text-slate-400">{svc.name}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        <span className="text-xs text-emerald-300">{svc.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Help CTA ───────────────────────────── */}
                                <div className="mt-10 glass-strong rounded-2xl p-7 border border-cyan-500/15 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/6 rounded-full blur-[60px]" />
                                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                                        <div>
                                            <h3 className="font-display text-lg font-700 text-white mb-1">Still need help?</h3>
                                            <p className="text-sm text-slate-400">Our support team is available 24/7 — by phone, chat, or email.</p>
                                        </div>
                                        <div className="flex gap-3 flex-shrink-0">
                                            <a
                                                href="/support"
                                                className="btn-glow text-sm font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-5 py-2.5 rounded-lg whitespace-nowrap"
                                            >
                                                Contact Support
                                            </a>
                                            <a
                                                href="#community"
                                                className="glass text-sm text-slate-300 hover:text-cyan-300 border border-slate-600/50 hover:border-cyan-500/40 px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
                                            >
                                                Community
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
}