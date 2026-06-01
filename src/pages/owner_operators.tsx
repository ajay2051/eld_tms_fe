import { useEffect, useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Benefit {
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
}

interface Testimonial {
    name: string;
    role: string;
    trucks: string;
    quote: string;
    rating: number;
    initials: string;
    accent: string;
}

interface PricingFeature {
    text: string;
    included: boolean;
}

interface Stat {
    value: string;
    label: string;
    sub: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
    { value: "$480",   label: "avg saved/month",    sub: "per owner-operator" },
    { value: "4 min",  label: "DOT inspection",     sub: "average transfer time" },
    { value: "98.2%",  label: "HOS accuracy",       sub: "automated logging" },
    { value: "24/7",   label: "roadside support",   sub: "live dispatcher access" },
];

const BENEFITS: Benefit[] = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="20" r="17" stroke="#00e5cc" strokeWidth="1.5" opacity="0.3" />
                <path d="M10 20 Q15 10 20 20 Q25 30 30 20" stroke="#00e5cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3.5" fill="#00e5cc" />
                <path d="M20 4 v4 M20 32 v4 M4 20 h4 M32 20 h4" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </svg>
        ),
        title: "One-Truck ELD Built for Solo Ops",
        desc: "No fleet minimums. Get a fully FMCSA-certified ELD that plugs into your OBD-II port in minutes. Tracks HOS automatically — no manual input, no paper logs.",
        accent: "from-cyan-500/10 to-transparent border-cyan-500/20",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="6" y="10" width="28" height="22" rx="3" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4" />
                <path d="M13 19h14M13 24h9" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="31" cy="11" r="6" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M29 11h4M31 9v4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Load Board Sync & Profitability",
        desc: "Connect to DAT, Truckstop, and 10+ load boards. See fuel-adjusted profit per mile before you accept a load. Stop hauling blind.",
        accent: "from-amber-500/10 to-transparent border-amber-500/20",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M8 32 L8 18 L20 8 L32 18 L32 32 Z" stroke="#34d399" strokeWidth="1.5" fill="none" />
                <path d="M15 32v-10h10v10" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="32" cy="10" r="5" fill="#34d399" opacity="0.15" stroke="#34d399" strokeWidth="1.5" />
                <path d="M30 10h4M32 8v4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "IFTA Mileage Reporting — Automated",
        desc: "GPS miles per state calculated automatically every quarter. Export IFTA-ready reports in one click. No spreadsheets, no guesswork.",
        accent: "from-emerald-500/10 to-transparent border-emerald-500/20",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M10 28 L10 16 L20 8 L30 16 L30 28 Z" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
                <path d="M6 30 L13 18 L20 24 L27 12 L34 20" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="27" cy="12" r="3" fill="#a78bfa" />
            </svg>
        ),
        title: "Maintenance Tracking Without the Shop",
        desc: "Get ahead of breakdowns. FleetPulse reads your engine fault codes and schedules service reminders for oil, brakes, tires — reducing downtime on the road.",
        accent: "from-violet-500/10 to-transparent border-violet-500/20",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="7" y="7" width="26" height="26" rx="4" stroke="#f87171" strokeWidth="1.5" opacity="0.4" />
                <path d="M14 14h12M14 20h8M14 26h10" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="10" r="5" fill="#f87171" opacity="0.15" stroke="#f87171" strokeWidth="1.5" />
                <path d="M28 10l1.5 1.5L32 8" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "BOL & Document Management",
        desc: "Snap a photo of your Bill of Lading and upload it from the cab. Brokers and shippers get instant delivery confirmation. No fax machines, no delays.",
        accent: "from-rose-500/10 to-transparent border-rose-500/20",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="14" r="7" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="32" cy="12" r="5" fill="#60a5fa" opacity="0.15" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M30 12h4M32 10v4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "24/7 Live Dispatcher on Standby",
        desc: "Broke down at 2am? Need help finding a nearby truck stop or repair shop? Our fleet specialists are available around the clock by phone, chat, or in-app.",
        accent: "from-blue-500/10 to-transparent border-blue-500/20",
    },
];

const TESTIMONIALS: Testimonial[] = [
    {
        name: "Marcus T.",
        role: "Owner-Operator",
        trucks: "1 truck · 4 yrs OTR",
        quote: "Before FleetPulse I was handwriting logs and constantly worrying about DOT. Now I just drive. The ELD handles everything and the IFTA report takes me 2 minutes a quarter.",
        rating: 5,
        initials: "MT",
        accent: "border-cyan-500/30 bg-cyan-500/5",
    },
    {
        name: "Sandra R.",
        role: "Independent Operator",
        trucks: "2 trucks · Flatbed",
        quote: "The load profitability tool alone paid for the subscription 10x over. I was running lanes that barely broke even. Now I can see exactly what I'll net before I even call the broker.",
        rating: 5,
        initials: "SR",
        accent: "border-violet-500/30 bg-violet-500/5",
    },
    {
        name: "Devon K.",
        role: "Solo Trucker",
        trucks: "1 truck · Reefer",
        quote: "Setup was 15 minutes. Plug in the device, download the app, done. My last DOT inspection was 3 minutes and 40 seconds — officer said it was one of the cleanest ELD transfers he'd seen.",
        rating: 5,
        initials: "DK",
        accent: "border-amber-500/30 bg-amber-500/5",
    },
];

const PRICING_FEATURES: PricingFeature[] = [
    { text: "FMCSA-certified ELD device included",       included: true },
    { text: "Automatic HOS & duty status logging",       included: true },
    { text: "Real-time GPS tracking & geofencing",       included: true },
    { text: "IFTA mileage report (quarterly, 1-click)",  included: true },
    { text: "Load board integration (DAT, Truckstop+)",  included: true },
    { text: "Profit-per-mile calculator",                included: true },
    { text: "Engine fault code alerts (OBD-II)",         included: true },
    { text: "Document & BOL upload",                     included: true },
    { text: "24/7 live dispatcher support",              included: true },
    { text: "No fleet minimum — solo operators welcome", included: true },
];

const HOW_STEPS = [
    {
        num: "01",
        title: "Order your ELD plug",
        desc: "Ships in 1–2 business days. Free standard shipping anywhere in the US.",
        color: "text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/10",
    },
    {
        num: "02",
        title: "Plug into your OBD-II port",
        desc: "Takes under 2 minutes. Works with any Class 7–8 commercial vehicle, 2000 or newer.",
        color: "text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
    },
    {
        num: "03",
        title: "Download the FleetPulse app",
        desc: "Available on iOS and Android. Log in, pair your device, and you're live.",
        color: "text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/10",
    },
    {
        num: "04",
        title: "Drive — we handle the rest",
        desc: "HOS, IFTA, fault codes, and DOT transfers happen automatically in the background.",
        color: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
    },
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

function ELDStatusWidget() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setSeconds(s => (s + 1) % 60), 1000);
        return () => clearInterval(t);
    }, []);

    const driveHrs = 7 + seconds / 3600;
    const drivePercent = (driveHrs / 11) * 100;

    return (
        <div
            className="glass rounded-2xl p-6 w-full max-w-sm border border-cyan-500/20"
            style={{ boxShadow: "0 0 50px rgba(0,229,204,0.08), 0 24px 60px rgba(0,0,0,0.5)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Driver Status</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-semibold text-emerald-300">Driving</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500">Today</div>
                    <div className="text-sm font-mono text-cyan-300">
                        {String(Math.floor(driveHrs)).padStart(2, "0")}:{String(Math.floor((driveHrs % 1) * 60)).padStart(2, "0")}
                    </div>
                </div>
            </div>

            {/* Drive time bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Drive Time</span>
                    <span className="text-cyan-300 font-semibold">7h / 11h</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-700/70 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-1000"
                        style={{ width: `${Math.min(drivePercent, 100)}%` }}
                    />
                </div>
            </div>

            {/* On duty bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">On Duty</span>
                    <span className="text-amber-300 font-semibold">9.5h / 14h</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-700/70 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: "67.8%" }} />
                </div>
            </div>

            {/* Cycle bar */}
            <div className="mb-5">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Cycle (70hr)</span>
                    <span className="text-violet-300 font-semibold">38h / 70h</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-700/70 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400" style={{ width: "54.3%" }} />
                </div>
            </div>

            {/* Status pills */}
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-center">
                    <div className="text-xs text-slate-400 mb-0.5">Next break</div>
                    <div className="text-sm font-semibold text-emerald-300">3h 30m</div>
                </div>
                <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/25 p-2.5 text-center">
                    <div className="text-xs text-slate-400 mb-0.5">DOT Ready</div>
                    <div className="text-sm font-semibold text-cyan-300">✓ Synced</div>
                </div>
            </div>
        </div>
    );
}

function ProfitWidget() {
    return (
        <div
            className="glass rounded-2xl p-5 w-full max-w-xs border border-violet-500/20 animate-float"
            style={{ animationDelay: "0.5s", boxShadow: "0 0 40px rgba(167,139,250,0.08), 0 20px 50px rgba(0,0,0,0.5)" }}
        >
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-4">Load Profitability</div>

            {[
                { route: "Chicago → Dallas",   rate: "$1,840", rpm: "$2.62", profit: "+$490", color: "text-emerald-300" },
                { route: "Dallas → Atlanta",   rate: "$1,120", rpm: "$1.87", profit: "+$210", color: "text-emerald-300" },
                { route: "Atlanta → Miami",    rate: "$980",   rpm: "$1.63", profit: "+$95",  color: "text-amber-300" },
            ].map((load, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-700/40 last:border-0">
                    <div>
                        <div className="text-xs font-medium text-slate-200">{load.route}</div>
                        <div className="text-xs text-slate-500">{load.rate} · {load.rpm}/mi</div>
                    </div>
                    <div className={`text-sm font-bold font-display ${load.color}`}>{load.profit}</div>
                </div>
            ))}

            <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total net est.</span>
                <span className="text-base font-bold text-cyan-300 font-display">+$795</span>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OwnerOperatorsPage() {
    return (
        <div className="min-h-screen bg-[#040f16] text-white overflow-x-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[120px]" />
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
                                    Built for Owner-Operators
                                </div>

                                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none mb-6">
                                    <span className="text-white">Run your</span>
                                    <br />
                                    <span className="shimmer-text">own truck.</span>
                                    <br />
                                    <span className="text-slate-400 text-4xl sm:text-5xl font-600">
                                        Own your numbers.
                                    </span>
                                </h1>

                                <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                                    FleetPulse gives independent truckers the same enterprise-grade ELD, dispatch tools,
                                    and profit analytics that big fleets rely on — at a price built for one truck.
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
                                    No fleet minimum · ELD device included · Cancel anytime
                                </p>
                            </div>

                            {/* Right: Widget stack */}
                            <div className="relative flex flex-col items-center gap-6 lg:items-end">
                                <ELDStatusWidget />
                                <div className="lg:mr-10">
                                    <ProfitWidget />
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

                {/* ── Benefits ─────────────────────────────────────────────── */}
                <section className="relative py-24 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                EVERYTHING YOU NEED
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 mb-4">
                                <span className="text-white">The full stack,</span>
                                <br />
                                <span className="text-slate-400">built around one truck</span>
                            </h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Every feature designed for the realities of running solo — from the cab at 3am to
                                a roadside DOT inspection.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {BENEFITS.map((b, i) => (
                                <div
                                    key={i}
                                    className={`glass rounded-2xl p-6 card-glow group relative overflow-hidden border bg-gradient-to-br ${b.accent}`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />
                                    <div className="p-2.5 glass rounded-xl inline-block mb-4">{b.icon}</div>
                                    <h3 className="font-display text-lg font-600 text-white mb-2">{b.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
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
                <section id="how-it-works" className="py-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/6 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/6 rounded-full blur-[60px]" />

                            <div className="relative text-center mb-12">
                                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    SETUP IN MINUTES
                                </div>
                                <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                    From unboxing to<br />
                                    <span className="text-cyan-400">road-ready in 15 min</span>
                                </h2>
                                <p className="text-slate-400 max-w-lg mx-auto">
                                    No IT department required. No multi-day installation. Just plug, pair, and drive.
                                </p>
                            </div>

                            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Connector line (desktop) */}
                                <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20" />

                                {HOW_STEPS.map((step, i) => (
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

                {/* ── Testimonials ─────────────────────────────────────────── */}
                <section className="py-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                OWNER-OPERATORS TRUST US
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                From the cab, not the office
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Real feedback from independent truckers running FleetPulse every day.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {TESTIMONIALS.map((t, i) => (
                                <div
                                    key={i}
                                    className={`glass rounded-2xl p-6 border card-glow flex flex-col ${t.accent}`}
                                >
                                    <StarRating count={t.rating} />
                                    <p className="text-slate-300 text-sm leading-relaxed mt-4 flex-1">"{t.quote}"</p>
                                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-700/40">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-600/30 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">{t.name}</div>
                                            <div className="text-xs text-slate-500">{t.trucks}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Pricing ──────────────────────────────────────────────── */}
                <section className="py-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                STRAIGHTFORWARD PRICING
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                One price.<br />
                                <span className="text-cyan-400">Everything included.</span>
                            </h2>
                            <p className="text-slate-400 max-w-md mx-auto">
                                No hidden fees, no per-truck add-ons, no surprise invoices at end of month.
                            </p>
                        </div>

                        <div className="glass-strong rounded-3xl overflow-hidden border border-cyan-500/20"
                             style={{ boxShadow: "0 0 60px rgba(0,229,204,0.08)" }}>
                            {/* Price header */}
                            <div className="px-8 py-10 text-center border-b border-cyan-500/15">
                                <div className="text-sm text-slate-400 mb-2 uppercase tracking-wider">Owner-Operator Plan</div>
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                    <span className="font-display text-6xl font-800 text-white">$45</span>
                                    <span className="text-slate-400 text-lg">/month</span>
                                </div>
                                <div className="text-sm text-slate-500">ELD hardware included • Billed monthly • Cancel anytime</div>

                                <a
                                    href="/start-trial"
                                    className="btn-glow inline-block mt-6 font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-3.5 rounded-xl text-sm"
                                >
                                    Start 14-Day Free Trial
                                </a>
                            </div>

                            {/* Features list */}
                            <div className="px-8 py-8">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {PRICING_FEATURES.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                                                <svg viewBox="0 0 12 12" className="w-3 h-3">
                                                    <path d="M2 6l3 3 5-5" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-300">{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA Band ─────────────────────────────────────────────── */}
                <section className="py-24 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Your truck. Your business.</span>
                            <br />
                            <span className="shimmer-text">Your FleetPulse.</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Join thousands of owner-operators who run cleaner logs, smarter loads, and fewer headaches.
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
                            No credit card required · ELD device ships free · FMCSA registered
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}