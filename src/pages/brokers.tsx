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
    loads: string;
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

interface WorkflowStep {
    num: string;
    title: string;
    desc: string;
    color: string;
    border: string;
    bg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
    { value: "68%",    label: "faster carrier booking",  sub: "vs phone & email workflows"  },
    { value: "4,100+", label: "verified carriers",       sub: "in the FleetPulse network"   },
    { value: "99.1%",  label: "on-time delivery rate",   sub: "across brokered loads"       },
    { value: "< 8 min",label: "avg load coverage time",  sub: "from post to carrier accept" },
];

const FEATURES: Feature[] = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="20" r="17" stroke="#00e5cc" strokeWidth="1.5" opacity="0.3" />
                <path d="M10 20 Q15 10 20 20 Q25 30 30 20" stroke="#00e5cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3.5" fill="#00e5cc" />
                <circle cx="8"  cy="20" r="2"   fill="#00e5cc" opacity="0.5" />
                <circle cx="32" cy="20" r="2"   fill="#00e5cc" opacity="0.5" />
            </svg>
        ),
        title: "Live Carrier Tracking & Visibility",
        desc: "Share a real-time tracking link with shippers the moment a carrier accepts. GPS updates every 30 seconds, ETA predictions, and geofence alerts at pickup and delivery.",
        accent: "from-cyan-500/10 to-transparent border-cyan-500/20",
        badge: "LIVE",
        badgeColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
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
        title: "AI-Powered Carrier Matching",
        desc: "Post a load and get ranked carrier recommendations in seconds — scored by lane history, on-time record, equipment type, and current location. No more cold calling.",
        accent: "from-violet-500/10 to-transparent border-violet-500/20",
        badge: "AI",
        badgeColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="5" y="8" width="30" height="24" rx="3" stroke="#f59e0b" strokeWidth="1.5" opacity="0.35" />
                <path d="M11 18h18M11 24h12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="31" cy="10" r="6" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M28.5 10l1.5 1.5L33 8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Carrier Compliance Verification",
        desc: "Automatic MC/DOT authority checks, insurance certificate validation, and safety rating pulls on every carrier before they touch your loads. FMCSA data refreshed daily.",
        accent: "from-amber-500/10 to-transparent border-amber-500/20",
        badge: "VERIFIED",
        badgeColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="7"  y="7"  width="26" height="26" rx="4" stroke="#34d399" strokeWidth="1.5" opacity="0.35" />
                <path d="M13 14h14M13 20h9M13 26h11" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="10" r="5" fill="#34d399" opacity="0.15" stroke="#34d399" strokeWidth="1.5" />
                <path d="M30 10h4M32 8v4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Digital Rate Confirmation & BOL",
        desc: "Send rate cons, get e-signatures, and attach POD documents — all from one screen. Carriers sign from their phone. Your team gets instant notification on completion.",
        accent: "from-emerald-500/10 to-transparent border-emerald-500/20",
        badge: "E-SIGN",
        badgeColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="14" cy="14" r="7" stroke="#f87171" strokeWidth="1.5" opacity="0.5" />
                <circle cx="26" cy="26" r="7" stroke="#f87171" strokeWidth="1.5" opacity="0.5" />
                <path d="M19 14 Q26 14 26 19" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="14" cy="14" r="2.5" fill="#f87171" />
                <circle cx="26" cy="26" r="2.5" fill="#f87171" />
            </svg>
        ),
        title: "Lane & Market Rate Intelligence",
        desc: "See spot rate benchmarks, historical lane trends, and carrier capacity signals in real time. Know when to lock in contract rates and when spot is the better play.",
        accent: "from-rose-500/10 to-transparent border-rose-500/20",
        badge: "MARKET",
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
        title: "Shipper Portal & Automated Updates",
        desc: "Give every shipper a branded tracking portal. Automated check-call updates, exception alerts, and delivery confirmations sent without a single rep picking up the phone.",
        accent: "from-blue-500/10 to-transparent border-blue-500/20",
        badge: "PORTAL",
        badgeColor: "text-blue-300 border-blue-500/40 bg-blue-500/10",
    },
];

const WORKFLOW_STEPS: WorkflowStep[] = [
    {
        num: "01",
        title: "Post your load",
        desc: "Enter origin, destination, equipment, and rate. Instantly visible to your vetted carrier network.",
        color: "text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/10",
    },
    {
        num: "02",
        title: "AI matches carriers",
        desc: "Ranked carrier suggestions based on lane fit, safety score, and live location — in under 30 seconds.",
        color: "text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/10",
    },
    {
        num: "03",
        title: "Send & sign rate con",
        desc: "Digital rate confirmation dispatched in one click. Carrier e-signs from their mobile app.",
        color: "text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
    },
    {
        num: "04",
        title: "Track & notify shipper",
        desc: "Live GPS link shared automatically. Shipper gets updates at pickup, in-transit, and delivery.",
        color: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
    },
];

const TESTIMONIALS: Testimonial[] = [
    {
        name: "Rachel Kim",
        role: "Chief Operating Officer",
        company: "Nexus Freight Partners",
        loads: "~600 loads/month",
        quote: "Our average load coverage time dropped from 47 minutes to under 9 minutes after switching to FleetPulse. The AI carrier matching is genuinely uncanny — it surfaces the right carrier almost every time.",
        rating: 5,
        initials: "RK",
        accent: "border-cyan-500/30 bg-cyan-500/5",
    },
    {
        name: "Tyler Bonham",
        role: "Senior Broker",
        company: "Summit Logistics Group",
        loads: "~180 loads/month",
        quote: "The shipper portal eliminated about 40 check calls a day from my queue. Shippers log in, see the truck on the map, and stop calling me. That time goes back into booking more freight.",
        rating: 5,
        initials: "TB",
        accent: "border-violet-500/30 bg-violet-500/5",
    },
    {
        name: "Dana Osei",
        role: "Operations Manager",
        company: "Clearwater Transport Brokerage",
        loads: "~320 loads/month",
        quote: "The compliance verification alone is worth the price. Before FleetPulse we had two cargo claims in six months from carriers we never should have booked. Haven't had a single one since.",
        rating: 5,
        initials: "DO",
        accent: "border-amber-500/30 bg-amber-500/5",
    },
];

const PRICING_TIERS: PricingTier[] = [
    {
        name: "Starter Broker",
        price: "$149",
        period: "/month",
        desc: "For independent brokers and small teams moving freight efficiently.",
        highlight: false,
        features: [
            "Up to 100 loads/month",
            "AI carrier matching",
            "Live GPS tracking links",
            "Digital rate confirmations",
            "Basic carrier compliance checks",
            "Shipper tracking portal",
            "Email & chat support",
        ],
        cta: "Start Free Trial",
        ctaHref: "/start-trial",
    },
    {
        name: "Pro Broker",
        price: "$349",
        period: "/month",
        desc: "For growing brokerages that need automation and deeper analytics.",
        highlight: true,
        badge: "MOST POPULAR",
        features: [
            "Unlimited loads/month",
            "Everything in Starter Broker",
            "Automated shipper notifications",
            "Lane rate intelligence & benchmarks",
            "Full MC/DOT/insurance verification",
            "E-signature BOL & POD capture",
            "TMS & load board integrations",
            "Priority phone support",
        ],
        cta: "Start Free Trial",
        ctaHref: "/start-trial",
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        desc: "For high-volume brokerages needing custom integrations and SLAs.",
        highlight: false,
        features: [
            "Everything in Pro Broker",
            "Dedicated account manager",
            "Custom TMS API integration",
            "White-label shipper portal",
            "Advanced BI & margin reporting",
            "99.9% uptime SLA",
            "24/7 dedicated support line",
        ],
        cta: "Contact Sales",
        ctaHref: "/contact",
    },
];

const INTEGRATIONS: IntegrationLogo[] = [
    { name: "DAT Freight",   abbr: "DAT",  color: "text-orange-300", bg: "bg-orange-500/10 border-orange-500/20" },
    { name: "Truckstop",     abbr: "TS+",  color: "text-blue-300",   bg: "bg-blue-500/10   border-blue-500/20"  },
    { name: "McLeod TMS",    abbr: "MCL",  color: "text-cyan-300",   bg: "bg-cyan-500/10   border-cyan-500/20"  },
    { name: "Turvo",         abbr: "TRV",  color: "text-teal-300",   bg: "bg-teal-500/10   border-teal-500/20"  },
    { name: "Mercury Gate",  abbr: "MG",   color: "text-violet-300", bg: "bg-violet-500/10 border-violet-500/20" },
    { name: "Salesforce",    abbr: "SF",   color: "text-blue-300",   bg: "bg-blue-500/10   border-blue-500/20"  },
    { name: "QuickBooks",    abbr: "QB",   color: "text-green-300",  bg: "bg-green-500/10  border-green-500/20" },
    { name: "FourKites",     abbr: "4K",   color: "text-rose-300",   bg: "bg-rose-500/10   border-rose-500/20"  },
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

// Animated load board widget
function LoadBoardWidget() {
    const [activeLoad, setActiveLoad] = useState<number | null>(null);
    const [, setTick] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setTick(p => p + 1), 2000);
        return () => clearInterval(t);
    }, []);

    const loads = [
        { id: "LD-8841", origin: "Chicago, IL",    dest: "Dallas, TX",     rate: "$1,840", equipment: "Dry Van", status: "Covered",  statusColor: "text-emerald-300", dot: "bg-emerald-400", carriers: 3 },
        { id: "LD-8842", origin: "Atlanta, GA",    dest: "Miami, FL",      rate: "$980",   equipment: "Reefer",  status: "Pending",  statusColor: "text-amber-300",   dot: "bg-amber-400",   carriers: 1 },
        { id: "LD-8843", origin: "Los Angeles, CA",dest: "Phoenix, AZ",    rate: "$720",   equipment: "Flatbed", status: "Posted",   statusColor: "text-cyan-300",    dot: "bg-cyan-400",    carriers: 0 },
        { id: "LD-8844", origin: "Houston, TX",    dest: "Denver, CO",     rate: "$1,260", equipment: "Dry Van", status: "In Transit",statusColor:"text-blue-300",    dot: "bg-blue-400",    carriers: 1 },
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
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Load Board</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">4 active loads</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-medium">AI Matching On</span>
                </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-4 px-5 py-2 border-b border-slate-700/20">
                {["Load ID", "Lane", "Rate", "Status"].map(h => (
                    <span key={h} className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</span>
                ))}
            </div>

            {/* Load rows */}
            <div className="divide-y divide-slate-700/20">
                {loads.map((load, i) => (
                    <div
                        key={load.id}
                        className={`grid grid-cols-4 items-center px-5 py-3 cursor-pointer transition-colors duration-150 ${activeLoad === i ? "bg-cyan-500/5" : "hover:bg-slate-800/30"}`}
                        onMouseEnter={() => setActiveLoad(i)}
                        onMouseLeave={() => setActiveLoad(null)}
                    >
                        <span className="text-xs font-mono text-slate-300">{load.id}</span>
                        <div>
                            <div className="text-xs text-slate-300 truncate">{load.origin.split(",")[0]}</div>
                            <div className="text-[10px] text-slate-500 truncate">→ {load.dest.split(",")[0]}</div>
                        </div>
                        <span className="text-xs font-semibold text-white">{load.rate}</span>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${load.dot}`} />
                            <span className={`text-xs font-medium ${load.statusColor}`}>{load.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer summary */}
            <div className="px-5 py-3 border-t border-slate-700/30 flex items-center justify-between bg-slate-800/20">
                <span className="text-xs text-slate-500">Avg coverage time today</span>
                <span className="text-xs font-semibold text-cyan-300">7m 42s</span>
            </div>
        </div>
    );
}

// Carrier match widget
function CarrierMatchWidget() {
    const [selected, setSelected] = useState<number>(0);

    const carriers = [
        { name: "Eagle Trans. LLC",   score: 98, lanes: "Chicago → TX",  rate: "$1,840", safety: "Satisfactory", color: "text-emerald-300", bar: "from-emerald-500 to-teal-400" },
        { name: "Midland Freight",    score: 94, lanes: "IL → TX",       rate: "$1,760", safety: "Satisfactory", color: "text-cyan-300",    bar: "from-cyan-500 to-blue-400"    },
        { name: "Patriot Carriers",   score: 89, lanes: "Midwest → South",rate: "$1,680", safety: "Satisfactory", color: "text-violet-300",  bar: "from-violet-500 to-purple-400"},
    ];

    return (
        <div
            className="glass rounded-2xl p-5 w-full max-w-xs border border-violet-500/20 animate-float"
            style={{ animationDelay: "0.4s", boxShadow: "0 0 40px rgba(167,139,250,0.08), 0 20px 50px rgba(0,0,0,0.5)" }}
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider">AI Carrier Match</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-medium">LD-8843</span>
            </div>

            <div className="space-y-2">
                {carriers.map((c, i) => (
                    <div
                        key={c.name}
                        onClick={() => setSelected(i)}
                        className={`rounded-xl p-3 border cursor-pointer transition-all duration-150 ${
                            selected === i
                                ? "border-cyan-500/40 bg-cyan-500/8"
                                : "border-slate-700/40 hover:border-slate-600/60"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-200">{c.name}</span>
                            <span className={`text-xs font-bold ${c.color}`}>{c.score}</span>
                        </div>
                        <div className="h-1 rounded-full bg-slate-700/60 overflow-hidden mb-2">
                            <div className={`h-full rounded-full bg-gradient-to-r ${c.bar}`} style={{ width: `${c.score}%` }} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">{c.lanes}</span>
                            <span className="text-[10px] font-semibold text-white">{c.rate}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] text-xs font-bold transition-opacity hover:opacity-90">
                Send Rate Con to #{selected + 1}
            </button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BrokersPage() {
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
                                    Built for Freight Brokers
                                </div>

                                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none mb-6">
                                    <span className="text-white">Cover more loads.</span>
                                    <br />
                                    <span className="shimmer-text">Make more margin.</span>
                                    <br />
                                    <span className="text-slate-400 text-4xl sm:text-5xl font-600">
                                        Less time on hold.
                                    </span>
                                </h1>

                                <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                                    FleetPulse gives freight brokers AI carrier matching, live shipment visibility,
                                    automated shipper updates, and compliance verification — all from one platform.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="/start-trial"
                                        className="btn-glow w-full sm:w-auto text-center font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-8 py-4 rounded-xl text-base"
                                    >
                                        Start Free Trial
                                    </a>
                                    <a
                                        href="#how-it-works"
                                        className="w-full sm:w-auto text-center glass rounded-xl px-8 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                                    >
                                        See How It Works
                                    </a>
                                </div>

                                <p className="text-xs text-slate-500 mt-4">
                                    No long-term contract · Setup in one day · 4,100+ verified carriers ready
                                </p>
                            </div>

                            {/* Right: Widgets */}
                            <div className="relative flex flex-col items-center gap-6 lg:items-end">
                                <LoadBoardWidget />
                                <div className="lg:mr-10">
                                    <CarrierMatchWidget />
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
                                BROKER PLATFORM
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 mb-4">
                                <span className="text-white">Everything from post</span>
                                <br />
                                <span className="text-slate-400">to proof of delivery.</span>
                            </h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Every tool your brokerage needs to move freight faster, protect your margins, and keep
                                shippers coming back.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {FEATURES.map((f, i) => (
                                <div
                                    key={i}
                                    className={`glass rounded-2xl p-6 card-glow group relative overflow-hidden border bg-gradient-to-br ${f.accent}`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />

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

                {/* ── How It Works ─────────────────────────────────────────── */}
                <section id="how-it-works" className="py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/6 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/6 rounded-full blur-[60px]" />

                            <div className="relative text-center mb-12">
                                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                    LOAD LIFECYCLE
                                </div>
                                <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                    From post to POD
                                    <br />
                                    <span className="text-cyan-400">in four steps</span>
                                </h2>
                                <p className="text-slate-400 max-w-lg mx-auto">
                                    No more tab-switching, phone tag, or manual tracking updates. The entire load lifecycle
                                    lives in FleetPulse.
                                </p>
                            </div>

                            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20" />

                                {WORKFLOW_STEPS.map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-5`}>
                                            <span className={`font-display text-xl font-700 ${step.color}`}>{step.num}</span>
                                        </div>
                                        <h3 className="font-display font-600 text-white text-lg mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Visibility Highlight ─────────────────────────────────── */}
                <section className="py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/8 rounded-full blur-[60px]" />

                            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                                {/* Left copy */}
                                <div>
                                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                        SHIPPER VISIBILITY
                                    </div>
                                    <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-4 leading-tight">
                                        Stop answering
                                        <br />
                                        <span className="text-cyan-400">"Where's my truck?"</span>
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed mb-8">
                                        Every shipper gets a branded tracking portal the moment you book a load.
                                        They see live GPS, ETAs, and status updates without ever calling your office.
                                        You look professional. Your team gets time back.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Branded shipper portal with your logo and colours",
                                            "Automated pickup, in-transit, and delivery notifications",
                                            "Exception alerts for delays, breakdowns, or route changes",
                                            "Digital POD with e-signature, instantly emailed to shipper",
                                            "Full load history exportable for any audit or dispute",
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

                                {/* Right: shipment status card */}
                                <div className="flex justify-center">
                                    <div
                                        className="glass rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20"
                                        style={{ boxShadow: "0 0 50px rgba(0,229,204,0.08)" }}
                                    >
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Shipment Tracker</div>
                                                <div className="text-sm font-semibold text-white">LD-8841 · Chicago → Dallas</div>
                                            </div>
                                            <div className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-semibold text-blue-300">
                                                In Transit
                                            </div>
                                        </div>

                                        {/* Progress steps */}
                                        {[
                                            { label: "Dispatched",      time: "8:02 AM",  done: true  },
                                            { label: "Picked Up",       time: "9:47 AM",  done: true  },
                                            { label: "In Transit",      time: "Now",      done: true, active: true },
                                            { label: "Delivery ETA",    time: "4:15 PM",  done: false },
                                        ].map((step, i, arr) => (
                                            <div key={step.label} className="flex gap-3 mb-0">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                        step.active
                                                            ? "border-cyan-400 bg-cyan-400/20"
                                                            : step.done
                                                                ? "border-emerald-400 bg-emerald-400/20"
                                                                : "border-slate-600 bg-transparent"
                                                    }`}>
                                                        {step.done && !step.active && (
                                                            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5">
                                                                <path d="M2 5l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                        {step.active && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                                                    </div>
                                                    {i < arr.length - 1 && (
                                                        <div className={`w-px flex-1 my-1 ${step.done ? "bg-emerald-500/40" : "bg-slate-700/40"}`} style={{ minHeight: "20px" }} />
                                                    )}
                                                </div>
                                                <div className={`pb-4 ${i === arr.length - 1 ? "pb-0" : ""}`}>
                                                    <div className={`text-xs font-medium ${step.active ? "text-cyan-300" : step.done ? "text-slate-200" : "text-slate-500"}`}>
                                                        {step.label}
                                                    </div>
                                                    <div className={`text-xs ${step.active ? "text-cyan-400" : "text-slate-500"}`}>{step.time}</div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-4 p-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20 flex items-center justify-between">
                                            <span className="text-xs text-slate-400">Next update in</span>
                                            <span className="text-xs font-semibold text-cyan-300">30 sec</span>
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
                            Connects with your TMS & load boards
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto mb-10">
                            FleetPulse syncs bidirectionally with the tools your brokerage already relies on — no
                            manual re-entry, no data silos.
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
                                + 35 more
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
                                BROKERS TRUST US
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                Built for how brokers work
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Real feedback from brokers moving hundreds of loads a month with FleetPulse.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {TESTIMONIALS.map((t, i) => (
                                <div key={i} className={`glass rounded-2xl p-6 border card-glow flex flex-col ${t.accent}`}>
                                    <StarRating count={t.rating} />
                                    <p className="text-slate-300 text-sm leading-relaxed mt-4 flex-1">"{t.quote}"</p>
                                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-700/40">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-600/30 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">{t.name}</div>
                                            <div className="text-xs text-slate-500">{t.company} · {t.loads}</div>
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
                                BROKER PRICING
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                Pricing that scales
                                <br />
                                <span className="text-cyan-400">with your volume.</span>
                            </h2>
                            <p className="text-slate-400 max-w-md mx-auto">
                                Flat monthly pricing — no per-load fees eating into your margin.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5 items-start">
                            {PRICING_TIERS.map((tier, i) => (
                                <div
                                    key={i}
                                    className={`rounded-3xl overflow-hidden relative ${
                                        tier.highlight
                                            ? "border border-cyan-500/40 bg-gradient-to-b from-cyan-500/10 to-transparent"
                                            : "glass border border-slate-700/40"
                                    }`}
                                    style={tier.highlight ? { boxShadow: "0 0 60px rgba(0,229,204,0.1)" } : undefined}
                                >
                                    {tier.badge && (
                                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                                            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] text-[10px] font-bold tracking-widest px-4 py-1 rounded-b-lg">
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
                                                    ? "btn-glow bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16]"
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
                            All plans include a 14-day free trial · No per-load fees · Cancel anytime
                        </p>
                    </div>
                </section>

                {/* ── CTA Band ─────────────────────────────────────────────── */}
                <section className="py-24 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Ready to move freight faster?</span>
                            <br />
                            <span className="shimmer-text">Your first load is waiting.</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Join thousands of brokers using FleetPulse to cover loads faster, keep shippers happy,
                            and protect their margin on every shipment.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/start-trial"
                                className="btn-glow font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-base"
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
                            No credit card required · Setup in one day · 4,100+ verified carriers ready
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}