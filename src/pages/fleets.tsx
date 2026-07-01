import { useEffect, useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stat {
    value: string;
    label: string;
    sub: string;
}

interface Feature {
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
    badge: string;
    badgeColor: string;
}

interface Testimonial {
    name: string;
    role: string;
    company: string;
    trucks: string;
    quote: string;
    rating: number;
    initials: string;
    accent: string;
}

interface PricingTier {
    name: string;
    price: string;
    period: string;
    desc: string;
    highlight: boolean;
    badge?: string;
    features: string[];
    cta: string;
    ctaHref: string;
}

interface IntegrationLogo {
    name: string;
    abbr: string;
    color: string;
    bg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
    { value: "40%",    label: "reduction in idle time",   sub: "avg across fleet customers" },
    { value: "2,200+", label: "fleets onboarded",         sub: "from 5 to 500+ trucks"      },
    { value: "$1,200", label: "saved per truck/yr",       sub: "fuel, maintenance & fines"  },
    { value: "< 1 hr", label: "full fleet onboarding",    sub: "plug-and-play setup"        },
];

const FEATURES: Feature[] = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="20" r="17" stroke="#00e5cc" strokeWidth="1.5" opacity="0.3" />
                <path d="M8 20 Q14 10 20 20 Q26 30 32 20" stroke="#00e5cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3.5" fill="#00e5cc" />
                <circle cx="8"  cy="20" r="2"   fill="#00e5cc" opacity="0.5" />
                <circle cx="32" cy="20" r="2"   fill="#00e5cc" opacity="0.5" />
                <path d="M20 4v3M20 33v3M4 20h3M33 20h3" stroke="#00e5cc" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
            </svg>
        ),
        title: "Live Fleet Map",
        desc: "Every truck on one map, updated every 30 seconds. Filter by driver, status, or load. Drill into any vehicle for speed, idle time, and route deviation.",
        accent: "from-cyan-500/10 to-transparent border-cyan-500/20",
        badge: "LIVE",
        badgeColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="5" y="8" width="30" height="24" rx="3" stroke="#f59e0b" strokeWidth="1.5" opacity="0.35" />
                <path d="M11 18h18M11 24h12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="31" cy="10" r="6" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M29 10l1.5 1.5L33 8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Fleet-Wide ELD & HOS Compliance",
        desc: "FMCSA-certified ELDs for every truck in your fleet. Automated duty-status changes, centralized violation dashboard, and one-click DOT audit exports for any driver.",
        accent: "from-amber-500/10 to-transparent border-amber-500/20",
        badge: "FMCSA",
        badgeColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M6 30 L13 18 L20 24 L27 12 L34 20" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="27" cy="12" r="3" fill="#a78bfa" />
                <line x1="6" y1="34" x2="34" y2="34" stroke="#a78bfa" strokeWidth="1.5" opacity="0.35" />
                <rect x="8"  y="26" width="4" height="8" rx="1" fill="#a78bfa" opacity="0.25" />
                <rect x="18" y="20" width="4" height="14" rx="1" fill="#a78bfa" opacity="0.25" />
                <rect x="28" y="16" width="4" height="18" rx="1" fill="#a78bfa" opacity="0.25" />
            </svg>
        ),
        title: "Dispatch & Load Automation",
        desc: "Drag-and-drop dispatch board across your entire fleet. AI-assisted driver-load matching based on HOS availability, location, and truck type. Push assignments to drivers instantly.",
        accent: "from-violet-500/10 to-transparent border-violet-500/20",
        badge: "AI",
        badgeColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="14" r="6"  stroke="#34d399" strokeWidth="1.5" />
                <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="30" cy="12" r="5"  fill="#34d399" opacity="0.15" stroke="#34d399" strokeWidth="1.5" />
                <path d="M28 12l1.5 1.5L32 10" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Driver Scorecards & Safety",
        desc: "Automated safety scoring for every driver: harsh braking, speeding, hard cornering, and idle time. Weekly coaching reports sent directly to drivers or fleet managers.",
        accent: "from-emerald-500/10 to-transparent border-emerald-500/20",
        badge: "SAFETY",
        badgeColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="7"  y="12" width="26" height="18" rx="2" stroke="#f87171" strokeWidth="1.5" opacity="0.35" />
                <path d="M13 21h5M13 26h8" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 8v5M20 27v5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
                <circle cx="20" cy="20" r="3" fill="#f87171" opacity="0.25" stroke="#f87171" strokeWidth="1.5" />
                <path d="M24 16l2-2M24 24l2 2M16 16l-2-2M16 24l-2 2" stroke="#f87171" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            </svg>
        ),
        title: "Predictive Maintenance Fleet-Wide",
        desc: "Aggregate OBD-II fault codes and engine health across every vehicle. Schedule preventive maintenance by mileage, engine hours, or fault triggers before breakdowns happen.",
        accent: "from-rose-500/10 to-transparent border-rose-500/20",
        badge: "OBD-II",
        badgeColor: "text-rose-300 border-rose-500/40 bg-rose-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M8 30 L8 18 L20 8 L32 18 L32 30 Z" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
                <path d="M15 30v-9h10v9" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="32" cy="10" r="5" fill="#60a5fa" opacity="0.15" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M30 10h4M32 8v4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "IFTA, Fuel & Cost Reporting",
        desc: "Automated quarterly IFTA reports across all trucks. Fuel card integrations, cost-per-mile breakdowns by driver or lane, and exportable P&L summaries for your accountant.",
        accent: "from-blue-500/10 to-transparent border-blue-500/20",
        badge: "IFTA",
        badgeColor: "text-blue-300 border-blue-500/40 bg-blue-500/10",
    },
];

const TESTIMONIALS: Testimonial[] = [
    {
        name: "James Okafor",
        role: "VP of Operations",
        company: "Horizon Freight LLC",
        trucks: "48 trucks · Dry Van",
        quote: "We cut our HOS violations by 91% in the first quarter. The centralized compliance dashboard means my safety director can see every driver's status at a glance — no more chasing paper logs.",
        rating: 5,
        initials: "JO",
        accent: "border-cyan-500/30 bg-cyan-500/5",
    },
    {
        name: "Priya Mehta",
        role: "Fleet Manager",
        company: "Crestline Transport",
        trucks: "22 trucks · Reefer",
        quote: "The dispatch automation alone saved us two full-time coordinator positions. AI load matching gets the right driver to the right load in seconds — and drivers actually love the app.",
        rating: 5,
        initials: "PM",
        accent: "border-violet-500/30 bg-violet-500/5",
    },
    {
        name: "Bill Hargrove",
        role: "Owner",
        company: "Hargrove Logistics",
        trucks: "11 trucks · Flatbed",
        quote: "IFTA reporting used to take my bookkeeper two days every quarter. Now it's 8 minutes. The fuel cost breakdowns by lane changed how we bid new freight contracts entirely.",
        rating: 5,
        initials: "BH",
        accent: "border-amber-500/30 bg-amber-500/5",
    },
];

const PRICING_TIERS: PricingTier[] = [
    {
        name: "Starter Fleet",
        price: "$35",
        period: "/truck/mo",
        desc: "For small fleets getting off paper logs and spreadsheets.",
        highlight: false,
        features: [
            "FMCSA ELD device per truck",
            "HOS & duty status logging",
            "Real-time GPS tracking",
            "Driver mobile app",
            "Basic compliance dashboard",
            "Email support",
        ],
        cta: "Start Free Trial",
        ctaHref: "/start-trial",
    },
    {
        name: "Pro Fleet",
        price: "$52",
        period: "/truck/mo",
        desc: "The full platform for growing fleets that need automation.",
        highlight: true,
        badge: "MOST POPULAR",
        features: [
            "Everything in Starter Fleet",
            "AI dispatch & load matching",
            "Driver scorecards & coaching",
            "IFTA automated reports",
            "Load board integrations",
            "Predictive maintenance alerts",
            "Fuel card sync",
            "Priority phone support",
        ],
        cta: "Start Free Trial",
        ctaHref: "/start-trial",
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        desc: "For large fleets needing custom integrations and SLAs.",
        highlight: false,
        features: [
            "Everything in Pro Fleet",
            "Dedicated account manager",
            "Custom API & TMS integration",
            "White-label driver app option",
            "Custom reporting & BI exports",
            "99.9% uptime SLA",
            "24/7 dedicated support line",
        ],
        cta: "Contact Sales",
        ctaHref: "/contact",
    },
];

const INTEGRATIONS: IntegrationLogo[] = [
    { name: "DAT",        abbr: "DAT",  color: "text-orange-300", bg: "bg-orange-500/10 border-orange-500/20" },
    { name: "Truckstop",  abbr: "TS+",  color: "text-blue-300",   bg: "bg-blue-500/10   border-blue-500/20"  },
    { name: "McLeod",     abbr: "MCL",  color: "text-cyan-300",   bg: "bg-cyan-500/10   border-cyan-500/20"  },
    { name: "Samsara",    abbr: "SAM",  color: "text-teal-300",   bg: "bg-teal-500/10   border-teal-500/20"  },
    { name: "QuickBooks", abbr: "QB",   color: "text-green-300",  bg: "bg-green-500/10  border-green-500/20" },
    { name: "EFS Fuel",   abbr: "EFS",  color: "text-amber-300",  bg: "bg-amber-500/10  border-amber-500/20" },
    { name: "Comdata",    abbr: "COM",  color: "text-violet-300", bg: "bg-violet-500/10 border-violet-500/20" },
    { name: "FourKites",  abbr: "4K",   color: "text-rose-300",   bg: "bg-rose-500/10   border-rose-500/20"  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 12 12" className={`w-3.5 h-3.5 ${i < count ? "text-amber-400" : "text-slate-600"}`} fill="currentColor">
                    <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z" />
                </svg>
            ))}
        </div>
    );
}

// Animated fleet map widget
function FleetMapWidget() {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTick(p => p + 1), 1200);
        return () => clearInterval(t);
    }, []);

    const trucks = [
        { id: "TRK-041", driver: "R. Santos",  status: "Driving",  statusColor: "text-emerald-300", dot: "bg-emerald-400", x: 30 + (tick * 2.1) % 40,  y: 38 },
        { id: "TRK-028", driver: "K. Williams", status: "On Duty",  statusColor: "text-amber-300",   dot: "bg-amber-400",   x: 55 + (tick * 1.3) % 25,  y: 55 },
        { id: "TRK-017", driver: "A. Torres",   status: "Break",    statusColor: "text-blue-300",    dot: "bg-blue-400",    x: 18,                        y: 62 },
        { id: "TRK-033", driver: "M. Johnson",  status: "Driving",  statusColor: "text-emerald-300", dot: "bg-emerald-400", x: 68 + (tick * 1.8) % 20,  y: 28 },
        { id: "TRK-059", driver: "P. Davis",    status: "Off Duty", statusColor: "text-slate-400",   dot: "bg-slate-500",   x: 44,                        y: 72 },
    ];

    return (
        <div
            className="glass rounded-2xl overflow-hidden border border-cyan-500/20 w-full max-w-lg"
            style={{ boxShadow: "0 0 50px rgba(0,229,204,0.08), 0 24px 60px rgba(0,0,0,0.5)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Live Fleet Map</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">5 trucks active</span>
                    <span className="text-xs text-cyan-400 font-medium">Updated just now</span>
                </div>
            </div>

            {/* Pseudo-map */}
            <div className="relative h-36 bg-[#061824] overflow-hidden">
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {[20, 40, 60, 80].map(v => (
                        <g key={v}>
                            <line x1={v} y1="0" x2={v} y2="100" stroke="#00e5cc" strokeWidth="0.3" />
                            <line x1="0" y1={v} x2="100" y2={v} stroke="#00e5cc" strokeWidth="0.3" />
                        </g>
                    ))}
                    {/* Roads */}
                    <path d="M0 50 Q25 45 50 50 Q75 55 100 50" stroke="#1e4a5a" strokeWidth="1.5" fill="none" />
                    <path d="M30 0 Q35 50 30 100" stroke="#1e4a5a" strokeWidth="1" fill="none" />
                    <path d="M70 0 Q65 50 70 100" stroke="#1e4a5a" strokeWidth="1" fill="none" />
                </svg>
                {/* Truck dots */}
                {trucks.map((tr) => (
                    <div
                        key={tr.id}
                        className="absolute transition-all duration-1000"
                        style={{ left: `${tr.x}%`, top: `${tr.y}%`, transform: "translate(-50%,-50%)" }}
                    >
                        <div className={`w-3 h-3 rounded-full ${tr.dot} shadow-lg`} style={{ boxShadow: tr.dot.includes("emerald") ? "0 0 8px rgba(52,211,153,0.6)" : undefined }} />
                    </div>
                ))}
            </div>

            {/* Truck list */}
            <div className="divide-y divide-slate-700/30">
                {trucks.slice(0, 4).map((tr) => (
                    <div key={tr.id} className="flex items-center justify-between px-5 py-2.5">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${tr.dot}`} />
                            <span className="text-xs font-mono text-slate-300">{tr.id}</span>
                            <span className="text-xs text-slate-500">{tr.driver}</span>
                        </div>
                        <span className={`text-xs font-medium ${tr.statusColor}`}>{tr.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Fleet compliance summary widget
function ComplianceWidget() {
    return (
        <div
            className="glass rounded-2xl p-5 w-full max-w-xs border border-violet-500/20 animate-float"
            style={{ animationDelay: "0.4s", boxShadow: "0 0 40px rgba(167,139,250,0.08), 0 20px 50px rgba(0,0,0,0.5)" }}
        >
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-4">Fleet Compliance</div>

            <div className="flex items-end gap-2 mb-1">
                <span className="font-display text-4xl font-700 text-emerald-300">97%</span>
                <span className="text-xs text-emerald-400 pb-1.5">compliance rate</span>
            </div>
            <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden mb-5">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: "97%" }} />
            </div>

            {[
                { label: "Active drivers",   val: "23 / 24",  color: "text-cyan-300"    },
                { label: "HOS violations",   val: "0 today",  color: "text-emerald-300" },
                { label: "Pending DVIRs",    val: "2",        color: "text-amber-300"   },
                { label: "ELDs synced",      val: "24 / 24",  color: "text-cyan-300"    },
            ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                    <span className="text-xs text-slate-400">{row.label}</span>
                    <span className={`text-xs font-semibold ${row.color}`}>{row.val}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FleetsPage() {
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

            <main>
                {/* ── Hero ─────────────────────────────────────────────────── */}
                <section className="relative pt-32 pb-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            {/* Left: Copy */}
                            <div>
                                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-8">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    Built for Fleet Managers
                                </div>

                                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none mb-6">
                                    <span className="text-white">Manage every</span>
                                    <br />
                                    <span className="shimmer-text">truck at once.</span>
                                    <br />
                                    <span className="text-slate-400 text-4xl sm:text-5xl font-600">
                                        From one dashboard.
                                    </span>
                                </h1>

                                <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                                    FleetPulse gives fleet managers real-time visibility, automated compliance, AI-assisted
                                    dispatch, and deep cost analytics — whether you run 5 trucks or 500.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="/start-trial"
                                        className="btn-glow w-full sm:w-auto text-center font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-8 py-4 rounded-xl text-base"
                                    >
                                        Start Free Trial
                                    </a>
                                    <a
                                        href="#pricing"
                                        className="w-full sm:w-auto text-center glass rounded-xl px-8 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                                    >
                                        View Pricing
                                    </a>
                                </div>

                                <p className="text-xs text-slate-500 mt-4">
                                    Scales from 5 trucks · ELD devices included · No IT team required
                                </p>
                            </div>

                            {/* Right: Widgets */}
                            <div className="relative flex flex-col items-center gap-6 lg:items-end">
                                <FleetMapWidget />
                                <div className="lg:mr-10">
                                    <ComplianceWidget />
                                </div>
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
                            {STATS.map((s, i) => (
                                <div key={i} className="glass rounded-xl px-6 py-5 text-center card-glow">
                                    <div className="font-display text-2xl sm:text-3xl font-700 text-cyan-300">{s.value}</div>
                                    <div className="text-sm text-white font-medium mt-1">{s.label}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features ─────────────────────────────────────────────── */}
                <section className="relative py-24 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                PLATFORM FEATURES
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 mb-4">
                                <span className="text-white">Command your fleet.</span>
                                <br />
                                <span className="text-slate-400">Stop chasing problems.</span>
                            </h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Every tool your operations team needs — unified in one platform that grows with your fleet.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {FEATURES.map((f, i) => (
                                <div
                                    key={i}
                                    className={`glass rounded-2xl p-6 card-glow group relative overflow-hidden border bg-linear-to-br ${f.accent}`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-cyan-500/5 to-transparent rounded-2xl" />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 glass rounded-xl">{f.icon}</div>
                                        <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${f.badgeColor}`}>
                                            {f.badge}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-lg font-600 text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>

                                    <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                        Learn more
                                        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                                            <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Compliance Highlight ─────────────────────────────────── */}
                <section className="py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/8 rounded-full blur-[60px]" />

                            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        COMPLIANCE COMMAND CENTER
                                    </div>
                                    <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-4 leading-tight">
                                        One screen to manage
                                        <br />
                                        <span className="text-cyan-400">every driver's compliance</span>
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed mb-8">
                                        Get a bird's-eye view of your entire fleet's HOS status, violation risk, and
                                        upcoming break requirements in real time. Dispatch smarter by knowing exactly
                                        who has hours available before you make the call.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Fleet-wide HOS dashboard with colour-coded risk levels",
                                            "Automatic violation alerts before they become fines",
                                            "One-click DOT audit package for any driver, any date",
                                            "Centralized DVIR inspection history across all vehicles",
                                            "FMCSA DataQ dispute filing support built in",
                                        ].map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                                <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                                                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                                                        <path d="M2 6l3 3 5-5" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Compliance score panel */}
                                <div className="flex justify-center">
                                    <div
                                        className="glass rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20"
                                        style={{ boxShadow: "0 0 50px rgba(0,229,204,0.08)" }}
                                    >
                                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-5">Fleet Safety Score</div>

                                        {/* Big score */}
                                        <div className="flex items-end gap-3 mb-6">
                                            <span className="font-display text-7xl font-800 text-emerald-300 leading-none">94</span>
                                            <div className="pb-2">
                                                <div className="text-xs text-emerald-400 font-medium">/ 100</div>
                                                <div className="text-xs text-slate-500">excellent</div>
                                            </div>
                                        </div>

                                        {/* Sub-scores */}
                                        {[
                                            { label: "HOS Adherence",  score: 98, color: "from-emerald-500 to-teal-400" },
                                            { label: "Speeding",       score: 91, color: "from-cyan-500 to-blue-400"    },
                                            { label: "Harsh Events",   score: 88, color: "from-amber-500 to-orange-400" },
                                            { label: "Vehicle Health", score: 96, color: "from-violet-500 to-purple-400" },
                                        ].map((s) => (
                                            <div key={s.label} className="mb-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-400">{s.label}</span>
                                                    <span className="text-slate-200 font-medium">{s.score}</span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                                                    <div className={`h-full rounded-full bg-linear-to-r ${s.color}`} style={{ width: `${s.score}%` }} />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span className="text-xs text-emerald-300 font-medium">Top 8% of all fleets this month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Integrations ─────────────────────────────────────────── */}
                <section className="py-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-blue-300 mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            INTEGRATIONS
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
                            Plugs into your existing stack
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto mb-10">
                            Connect FleetPulse to your TMS, fuel cards, load boards, and accounting tools in minutes — no custom dev work.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {INTEGRATIONS.map((ig) => (
                                <div
                                    key={ig.name}
                                    className={`glass rounded-xl px-5 py-3 border flex items-center gap-2.5 ${ig.bg} card-glow`}
                                >
                                    <div className={`w-8 h-8 rounded-lg ${ig.bg} border flex items-center justify-center font-display text-xs font-700 ${ig.color}`}>
                                        {ig.abbr}
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">{ig.name}</span>
                                </div>
                            ))}
                            <div className="glass rounded-xl px-5 py-3 border border-slate-600/30 flex items-center gap-2 text-slate-500 text-sm">
                                + 40 more
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ─────────────────────────────────────────── */}
                <section className="py-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                FLEET MANAGERS TRUST US
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                The ops team's new best tool
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Feedback from fleet managers running FleetPulse across hundreds of trucks.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {TESTIMONIALS.map((t, i) => (
                                <div key={i} className={`glass rounded-2xl p-6 border card-glow flex flex-col ${t.accent}`}>
                                    <StarRating count={t.rating} />
                                    <p className="text-slate-300 text-sm leading-relaxed mt-4 flex-1">"{t.quote}"</p>
                                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-700/40">
                                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-500/30 to-teal-600/30 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">{t.name}</div>
                                            <div className="text-xs text-slate-500">{t.company} · {t.trucks}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Pricing ──────────────────────────────────────────────── */}
                <section id="pricing" className="py-20 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                FLEET PRICING
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                Scales with your fleet.
                                <br />
                                <span className="text-cyan-400">No surprises.</span>
                            </h2>
                            <p className="text-slate-400 max-w-md mx-auto">
                                Per-truck pricing means you only pay for what's active. Add or remove trucks anytime.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5 items-start">
                            {PRICING_TIERS.map((tier, i) => (
                                <div
                                    key={i}
                                    className={`rounded-3xl overflow-hidden relative ${
                                        tier.highlight
                                            ? "border border-cyan-500/40 bg-linear-to-b from-cyan-500/10 to-transparent"
                                            : "glass border border-slate-700/40"
                                    }`}
                                    style={tier.highlight ? { boxShadow: "0 0 60px rgba(0,229,204,0.1)" } : undefined}
                                >
                                    {tier.badge && (
                                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                                            <div className="bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] text-[10px] font-bold tracking-widest px-4 py-1 rounded-b-lg">
                                                {tier.badge}
                                            </div>
                                        </div>
                                    )}

                                    <div className={`px-7 ${tier.badge ? "pt-9" : "pt-7"} pb-7`}>
                                        <div className="text-sm font-semibold text-slate-300 mb-2">{tier.name}</div>
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className={`font-display font-800 leading-none ${tier.price === "Custom" ? "text-3xl text-slate-200" : "text-5xl text-white"}`}>
                                                {tier.price}
                                            </span>
                                            <span className="text-slate-500 text-sm">{tier.period}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-6">{tier.desc}</p>

                                        <a
                                            href={tier.ctaHref}
                                            className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                                                tier.highlight
                                                    ? "btn-glow bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16]"
                                                    : "glass border border-slate-600/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40"
                                            }`}
                                        >
                                            {tier.cta}
                                        </a>

                                        <ul className="mt-6 space-y-2.5">
                                            {tier.features.map((feat, j) => (
                                                <li key={j} className="flex items-start gap-2.5 text-sm text-slate-400">
                                                    <div className="w-4 h-4 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
                                                            <path d="M2 5l2 2 4-4" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-xs text-slate-500 mt-6">
                            All plans include a 14-day free trial · ELD hardware included · Cancel or scale anytime
                        </p>
                    </div>
                </section>

                {/* ── CTA Band ─────────────────────────────────────────────── */}
                <section className="py-24 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Ready to run a tighter fleet?</span>
                            <br />
                            <span className="shimmer-text">Start in under an hour.</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Join thousands of fleet managers who ditched the spreadsheets and took back control of
                            their operations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/start-trial"
                                className="btn-glow font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-base"
                            >
                                Start 14-Day Free Trial
                            </a>
                            <a
                                href="#"
                                className="glass rounded-xl px-10 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                            >
                                Schedule a Demo
                            </a>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">
                            No credit card required · Scales from 5 trucks · FMCSA registered ELD
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}