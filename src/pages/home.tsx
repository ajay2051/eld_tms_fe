import { useEffect, useRef, useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// import "../styles/globals.css"; // uncomment if this file lives under src/pages or src/app

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stat {
    value: string;
    label: string;
}

interface Feature {
    icon: React.ReactNode;
    title: string;
    desc: string;
    badge: string;
}

type BadgeKey = "LIVE" | "CERTIFIED" | "AI" | "NEW" | "OBD-II" | "AUTO";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
    { value: "12,400+", label: "Active Trucks" },
    { value: "99.8%",   label: "Uptime SLA" },
    { value: "3.2M",    label: "Miles Logged" },
    { value: "FMCSA",   label: "Certified ELD" },
];

const FEATURES: Feature[] = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="20" r="18" stroke="#00e5cc" strokeWidth="1.5" opacity="0.4" />
                <path d="M8 20 Q14 10 20 20 Q26 30 32 20" stroke="#00e5cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3" fill="#00e5cc" />
                <circle cx="8"  cy="20" r="2" fill="#00e5cc" opacity="0.6" />
                <circle cx="32" cy="20" r="2" fill="#00e5cc" opacity="0.6" />
            </svg>
        ),
        title: "Live GPS Tracking",
        desc: "Real-time location updates every 30 seconds. Full route history, geofencing alerts, and ETA predictions powered by traffic data.",
        badge: "LIVE",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="6" y="8" width="28" height="24" rx="3" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4" />
                <path d="M12 20h16M12 15h10M12 25h14" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="10" r="5" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="27.5" y="13.5" fontSize="6" fill="#f59e0b" fontWeight="bold">!</text>
            </svg>
        ),
        title: "ELD Compliance",
        desc: "FMCSA-certified electronic logging device. Auto HOS tracking, violation alerts, DVIR inspections, and one-tap DOT audit reports.",
        badge: "CERTIFIED",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M6 30 L13 18 L20 24 L27 12 L34 20" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="27" cy="12" r="3" fill="#a78bfa" />
                <line x1="6" y1="34" x2="34" y2="34" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4" />
            </svg>
        ),
        title: "Load Intelligence",
        desc: "Smart load matching, fuel cost estimator, and profitability scoring per trip. Integrate with major load boards automatically.",
        badge: "AI",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="14" r="6" stroke="#34d399" strokeWidth="1.5" />
                <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="30" cy="26" r="6" fill="#34d399" opacity="0.15" stroke="#34d399" strokeWidth="1.5" />
                <path d="M27 26l2 2 4-3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Driver Management",
        desc: "Driver scorecards, safety events, coaching alerts, and fatigue monitoring. Assign loads, send messages, and manage shifts from one hub.",
        badge: "NEW",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="8" y="12" width="24" height="16" rx="2" stroke="#f87171" strokeWidth="1.5" opacity="0.4" />
                <path d="M14 20h4M22 20h4" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 10v4M20 26v4" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <circle cx="20" cy="20" r="3" fill="#f87171" opacity="0.3" stroke="#f87171" strokeWidth="1.5" />
            </svg>
        ),
        title: "Maintenance Alerts",
        desc: "Predictive maintenance scheduling from engine diagnostics. DTC fault codes, oil life, brake wear, and tire pressure monitoring.",
        badge: "OBD-II",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M10 28 L10 16 L20 8 L30 16 L30 28 Z" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
                <path d="M16 28v-8h8v8" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="32" cy="10" r="5" fill="#60a5fa" opacity="0.15" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M30 10h4M32 8v4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Dispatch Automation",
        desc: "Drag-and-drop dispatch board with automated driver assignment, customer notifications, and proof-of-delivery capture.",
        badge: "AUTO",
    },
];

const BADGE_COLORS: Record<BadgeKey, string> = {
    LIVE:       "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    CERTIFIED:  "text-amber-300   border-amber-500/40   bg-amber-500/10",
    AI:         "text-violet-300  border-violet-500/40  bg-violet-500/10",
    NEW:        "text-cyan-300    border-cyan-500/40    bg-cyan-500/10",
    "OBD-II":   "text-rose-300    border-rose-500/40    bg-rose-500/10",
    AUTO:       "text-blue-300    border-blue-500/40    bg-blue-500/10",
};

const HOS_BARS = [
    { label: "Drive Time",   used: 7.5, max: 11, gradient: "from-cyan-500 to-teal-400",    text: "text-cyan-300" },
    { label: "On Duty",      used: 10,  max: 14, gradient: "from-amber-500 to-orange-400", text: "text-amber-300" },
    { label: "Cycle (70hr)", used: 42,  max: 70, gradient: "from-violet-500 to-purple-400",text: "text-violet-300" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TruckScene() {
    const [pos, setPos] = useState<number>(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        let p = 0;
        const animate = () => {
            p = (p + 0.15) % 100;
            setPos(p);
            frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    const x = (pos / 100) * 680 - 40;

    return (
        <svg viewBox="0 0 700 80" className="w-full opacity-60" preserveAspectRatio="none">
            <rect x="0" y="38" width="700" height="20" rx="2" fill="#0f2a35" opacity="0.6" />
            {[0, 80, 160, 240, 320, 400, 480, 560, 640].map((i) => (
                <rect key={i} x={i + 5} y="47" width="50" height="2" rx="1" fill="#1e4a5a" />
            ))}
            <g transform={`translate(${x}, 22)`}>
                <rect x="0"  y="8"  width="42" height="16" rx="2" fill="#0d3d4f" stroke="#00e5cc" strokeWidth="0.8" />
                <rect x="28" y="4"  width="14" height="20" rx="2" fill="#0a2d3d" stroke="#00e5cc" strokeWidth="0.8" />
                <rect x="30" y="6"  width="10" height="8"  rx="1" fill="#00e5cc" opacity="0.25" />
                <circle cx="8"  cy="24" r="4" fill="#061d26" stroke="#00e5cc" strokeWidth="0.8" />
                <circle cx="8"  cy="24" r="1.5" fill="#00e5cc" opacity="0.5" />
                <circle cx="34" cy="24" r="4" fill="#061d26" stroke="#00e5cc" strokeWidth="0.8" />
                <circle cx="34" cy="24" r="1.5" fill="#00e5cc" opacity="0.5" />
                <ellipse cx="21" cy="28" rx="22" ry="3" fill="#00e5cc" opacity="0.08" />
                <path d="M42 12 L70 8 L70 18 L42 18 Z" fill="#00e5cc" opacity="0.06" />
            </g>
        </svg>
    );
}

function HOSWidget() {
    return (
        <div
            className="glass rounded-2xl p-6 w-full max-w-xs border border-cyan-500/20 animate-float"
            style={{ boxShadow: "0 0 40px rgba(0,229,204,0.1), 0 20px 60px rgba(0,0,0,0.5)" }}
        >
            <div className="flex items-center justify-between mb-5">
                <span className="text-xs text-slate-400 uppercase tracking-wider">HOS Status</span>
                <span className="text-xs text-emerald-400 font-medium">● On Duty</span>
            </div>

            {HOS_BARS.map((bar) => (
                <div key={bar.label} className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-slate-400">{bar.label}</span>
                        <span className={`text-xs font-semibold font-display ${bar.text}`}>
              {bar.used}h / {bar.max}h
            </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${bar.gradient}`}
                            style={{ width: `${(bar.used / bar.max) * 100}%` }}
                        />
                    </div>
                </div>
            ))}

            <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-300 font-medium">No violations detected</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 pl-4">Next break due in 2h 15m</div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#040f16] text-white overflow-x-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-cyan-500/5  blur-[120px]" />
                <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-teal-500/5  blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/3 blur-[140px]" />
                <div className="grid-bg absolute inset-0" />
            </div>

            <Navbar />

            <main>
                {/* ── Hero ────────────────────────────────────────────────────── */}
                <section className="relative pt-32 pb-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        {/* Pill badge */}
                        <div className="animate-fade-in inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            FMCSA Certified ELD · DOT Compliant
                        </div>

                        {/* Heading */}
                        <h1 className="animate-slide-up font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-800 leading-none mb-6">
                            <span className="text-white">Fleet Tracking</span>
                            <br />
                            <span className="shimmer-text">&amp; ELD Compliance</span>
                            <br />
                            <span className="text-slate-400 text-4xl sm:text-5xl md:text-6xl font-600">
                Built for the Road
              </span>
                        </h1>

                        <p className="animate-slide-up delay-200 max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl leading-relaxed mb-10">
                            Real-time GPS tracking, electronic logging for HOS compliance, and intelligent dispatch
                            automation — all in one unified platform trusted by thousands of carriers.
                        </p>

                        <div className="animate-slide-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="/start-trial"
                                className="btn-glow w-full sm:w-auto font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-8 py-4 rounded-xl text-base"
                            >
                                Start Free Trial
                            </a>
                            <a
                                href="#"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 glass rounded-xl px-8 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                            >
                                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 7l5 3-5 3V7z" fill="currentColor" />
                                </svg>
                                Watch Demo
                            </a>
                        </div>

                        {/* Truck animation */}
                        <div className="animate-fade-in delay-500 mt-16">
                            <div className="glass rounded-2xl p-4 overflow-hidden">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                    Live Fleet Activity
                  </span>
                                    <div className="ml-auto text-xs text-cyan-400 font-medium">3 trucks on route</div>
                                </div>
                                <TruckScene />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            {STATS.map((s, i) => (
                                <div
                                    key={i}
                                    className={`glass rounded-xl px-6 py-5 text-center card-glow animate-slide-up delay-${(i + 1) * 100}`}
                                >
                                    <div className="font-display text-2xl sm:text-3xl font-700 text-cyan-300">{s.value}</div>
                                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Features ────────────────────────────────────────────────── */}
                <section className="relative py-24 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                PLATFORM FEATURES
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 mb-4">
                                <span className="text-white">Everything your fleet</span>
                                <br />
                                <span className="text-slate-400">needs to stay moving</span>
                            </h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                From live GPS pings to automated ELD logs and dispatcher tools — FleetPulse covers
                                every mile of your operation.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {FEATURES.map((f, i) => (
                                <div
                                    key={i}
                                    className="glass rounded-2xl p-6 card-glow group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 glass rounded-xl">{f.icon}</div>
                                        <span
                                            className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${
                                                BADGE_COLORS[f.badge as BadgeKey]
                                            }`}
                                        >
                      {f.badge}
                    </span>
                                    </div>

                                    <h3 className="font-display text-lg font-600 text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>

                                    <div className="mt-4 flex items-center gap-1 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
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

                {/* ── ELD Highlight ───────────────────────────────────────────── */}
                <section className="py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/8 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/8 rounded-full blur-[60px]" />

                            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        ELD MANDATE COMPLIANT
                                    </div>
                                    <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-4 leading-tight">
                                        Never worry about
                                        <br />
                                        <span className="text-cyan-400">HOS violations</span> again
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed mb-8">
                                        Our FMCSA-registered ELD automatically records driving time, engine hours, vehicle
                                        movement, and miles driven. Drivers get real-time alerts before they approach
                                        limits — keeping them safe and you compliant.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Automatic duty status changes",
                                            "11-hour driving / 14-hour on-duty tracking",
                                            "30-minute break reminders",
                                            "Instant DOT inspection transfer",
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

                                <div className="flex justify-center">
                                    <HOSWidget />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA Band ────────────────────────────────────────────────── */}
                <section className="py-24 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Ready to modernize</span>
                            <br />
                            <span className="shimmer-text">your fleet operations?</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Join thousands of carriers who trust FleetPulse to keep their trucks moving and their
                            drivers compliant.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#"
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
                            No credit card required · Cancel anytime · FMCSA registered ELD
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}