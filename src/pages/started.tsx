import { useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    desc: string;
    highlight: boolean;
    badge?: string;
    features: string[];
    accentBorder: string;
    accentGlow: string;
}

interface RoleCard {
    id: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
    iconColor: string;
    bestPlan: string;
}

interface Step {
    num: string;
    title: string;
    desc: string;
    color: string;
    border: string;
    bg: string;
}

interface Faq {
    q: string;
    a: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
    {
        id: "owner-op",
        name: "Owner-Operator",
        price: "$45",
        period: "/month",
        desc: "Everything one independent trucker needs — ELD included, no fleet minimum.",
        highlight: false,
        accentBorder: "border-slate-700/40",
        accentGlow: "",
        features: [
            "FMCSA-certified ELD device included",
            "Automatic HOS & duty status logging",
            "Real-time GPS tracking",
            "IFTA quarterly reports (1-click)",
            "Load board integration",
            "Profit-per-mile calculator",
            "OBD-II fault code alerts",
            "24/7 phone & chat support",
        ],
    },
    {
        id: "pro-fleet",
        name: "Pro Fleet",
        price: "$52",
        period: "/truck/mo",
        desc: "The full platform for growing fleets. AI dispatch, scorecards, and full compliance.",
        highlight: true,
        badge: "MOST POPULAR",
        accentBorder: "border-cyan-500/40",
        accentGlow: "0 0 60px rgba(0,229,204,0.10)",
        features: [
            "Everything in Owner-Operator",
            "Fleet-wide compliance dashboard",
            "AI dispatch & load matching",
            "Driver scorecards & coaching",
            "Predictive maintenance alerts",
            "Fuel card sync",
            "IFTA across all vehicles",
            "Priority phone support",
        ],
    },
    {
        id: "broker",
        name: "Pro Broker",
        price: "$349",
        period: "/month",
        desc: "AI carrier matching, live shipment visibility, and automated shipper updates.",
        highlight: false,
        accentBorder: "border-slate-700/40",
        accentGlow: "",
        features: [
            "Unlimited loads/month",
            "AI carrier matching",
            "Live GPS tracking links",
            "Digital rate confirmations",
            "MC/DOT/insurance verification",
            "Automated shipper notifications",
            "Lane rate intelligence",
            "TMS & load board integrations",
        ],
    },
];

const ROLES: RoleCard[] = [
    {
        id: "owner-op",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M4 28 L10 16 L20 22 L30 10 L36 18" stroke="#00e5cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="22" r="3" fill="#00e5cc" />
                <rect x="4" y="30" width="32" height="2" rx="1" fill="#00e5cc" opacity="0.3" />
            </svg>
        ),
        title: "Owner-Operator",
        desc: "Running your own truck solo? Get ELD compliance, IFTA, and load profitability tools for one truck.",
        accent: "border-cyan-500/25 bg-cyan-500/5",
        iconColor: "text-cyan-300",
        bestPlan: "owner-op",
    },
    {
        id: "fleet",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M3 26 L9 18 L18 22 L27 12 L35 18" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9"  cy="18" r="2.5" fill="#a78bfa" opacity="0.6" />
                <circle cx="18" cy="22" r="2.5" fill="#a78bfa" opacity="0.6" />
                <circle cx="27" cy="12" r="2.5" fill="#a78bfa" />
                <circle cx="35" cy="18" r="2.5" fill="#a78bfa" opacity="0.6" />
            </svg>
        ),
        title: "Fleet Manager",
        desc: "Managing 5–500 trucks? Centralized HOS, live GPS, AI dispatch, and driver scorecards.",
        accent: "border-violet-500/25 bg-violet-500/5",
        iconColor: "text-violet-300",
        bestPlan: "pro-fleet",
    },
    {
        id: "broker",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="12" cy="14" r="6" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
                <circle cx="28" cy="26" r="6" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
                <path d="M16 14 Q28 14 28 20" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="12" cy="14" r="2.5" fill="#f59e0b" />
                <circle cx="28" cy="26" r="2.5" fill="#f59e0b" />
            </svg>
        ),
        title: "Freight Broker",
        desc: "Cover loads faster with AI carrier matching, live tracking, and automated shipper updates.",
        accent: "border-amber-500/25 bg-amber-500/5",
        iconColor: "text-amber-300",
        bestPlan: "broker",
    },
];

const STEPS: Step[] = [
    {
        num: "01",
        title: "Choose your plan",
        desc: "Pick the plan that fits your role — Owner-Operator, Fleet, or Broker. All plans start with a 14-day free trial.",
        color: "text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/10",
    },
    {
        num: "02",
        title: "Create your account",
        desc: "Enter your name, email, and company. No credit card required to start your trial.",
        color: "text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/10",
    },
    {
        num: "03",
        title: "Receive your ELD",
        desc: "For fleet and owner-op plans, your ELD device ships same day. It arrives in 1–2 business days.",
        color: "text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
    },
    {
        num: "04",
        title: "Plug in and drive",
        desc: "15-minute setup. Plug the ELD into your OBD-II port, download the app, and you're compliant.",
        color: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
    },
];

const FAQS: Faq[] = [
    {
        q: "Do I need a credit card to start the free trial?",
        a: "No. You can start your 14-day free trial with just an email address. We'll ask for payment details only when your trial ends.",
    },
    {
        q: "How long does ELD setup take?",
        a: "Most drivers are live in under 15 minutes. Plug the ELD into your OBD-II port, download the FleetPulse driver app, pair the device via Bluetooth, and you're logging.",
    },
    {
        q: "Can I add more trucks later?",
        a: "Yes. Fleet plans scale up or down anytime. Add a truck and a new ELD ships automatically. Remove a truck and it drops off your next bill.",
    },
    {
        q: "What if I'm already using another ELD?",
        a: "You can switch mid-subscription. We'll walk you through the transition and make sure there's no compliance gap during the changeover.",
    },
    {
        q: "Is there a contract or minimum term?",
        a: "No long-term contract. All plans are month-to-month. Cancel anytime from your account settings — your access continues until the end of the billing period.",
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqAccordion({ faqs }: { faqs: Faq[] }) {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <div className="space-y-3">
            {faqs.map((faq, i) => (
                <div
                    key={i}
                    className={`glass rounded-xl border transition-all duration-200 overflow-hidden ${
                        open === i ? "border-cyan-500/30" : "border-slate-700/30 hover:border-slate-600/50"
                    }`}
                >
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                        <span className={`text-sm font-medium leading-snug transition-colors ${open === i ? "text-cyan-300" : "text-slate-200"}`}>
                            {faq.q}
                        </span>
                        <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`w-3.5 h-3.5 shrink-0 text-slate-500 transition-transform duration-200 ${open === i ? "rotate-180 text-cyan-400" : ""}`}
                        >
                            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    {open === i && (
                        <div className="px-5 pb-5">
                            <div className="h-px bg-slate-800/60 mb-4" />
                            <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function SignupForm({ selectedPlan }: { selectedPlan: string }) {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", company: "",
        dotNumber: "", trucks: "", phone: "",
    });

    const plan = PLANS.find(p => p.id === selectedPlan) ?? PLANS[1];

    if (submitted) {
        return (
            <div className="glass rounded-2xl p-10 border border-emerald-500/25 bg-emerald-500/5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-400">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="font-display text-2xl font-700 text-white mb-2">You're in!</h3>
                <p className="text-sm text-slate-400 mb-1">
                    Welcome to FleetPulse, <span className="text-white">{form.firstName}</span>.
                </p>
                <p className="text-sm text-slate-500 mb-2">
                    Check <span className="text-cyan-300">{form.email}</span> for your activation link.
                </p>
                {selectedPlan !== "broker" && (
                    <p className="text-xs text-slate-600 mb-6">
                        Your ELD device will ship within 1 business day.
                    </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                        href="/dashboard"
                        className="btn-glow text-sm font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-7 py-3 rounded-xl"
                    >
                        Go to Dashboard
                    </a>
                    <a
                        href="/docs#eld-setup"
                        className="glass text-sm text-slate-300 hover:text-cyan-300 border border-slate-600/50 hover:border-cyan-500/40 px-7 py-3 rounded-xl transition-all"
                    >
                        Setup Guide
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-7 sm:p-9 border border-slate-700/30">
            {/* Selected plan badge */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-display text-xl font-700 text-white mb-0.5">Start your free trial</h2>
                    <p className="text-xs text-slate-400">14 days free · No credit card required</p>
                </div>
                <div className={`glass rounded-xl px-4 py-2 border text-center ${plan.accentBorder}`}>
                    <div className="text-xs text-slate-500 mb-0.5">{plan.name}</div>
                    <div className="font-display font-700 text-white text-sm">{plan.price}<span className="text-slate-500 text-xs font-normal">{plan.period}</span></div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">First Name *</label>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                            placeholder="First name"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Last Name *</label>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                            placeholder="Last name"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Work Email *</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Company / Fleet Name</label>
                        <input
                            type="text"
                            value={form.company}
                            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                            placeholder="Your company"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Phone</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                </div>

                {selectedPlan !== "broker" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">DOT Number</label>
                            <input
                                type="text"
                                value={form.dotNumber}
                                onChange={e => setForm(f => ({ ...f, dotNumber: e.target.value }))}
                                placeholder="US DOT #"
                                className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Number of Trucks</label>
                            <select
                                value={form.trucks}
                                onChange={e => setForm(f => ({ ...f, trucks: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 bg-[#061d2a] transition-colors"
                            >
                                <option value="" className="bg-[#061d2a]">Select…</option>
                                {["1", "2–5", "6–20", "21–50", "51–200", "200+"].map(o => (
                                    <option key={o} value={o} className="bg-[#061d2a]">{o}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => {
                        if (form.firstName && form.email) setSubmitted(true);
                    }}
                    className="w-full btn-glow py-3.5 rounded-xl bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    Start Free Trial
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <p className="text-xs text-slate-600 text-center">
                    By signing up you agree to our{" "}
                    <a href="/terms" className="text-slate-500 hover:text-cyan-300 transition-colors">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-slate-500 hover:text-cyan-300 transition-colors">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GetStartedPage() {
    const [selectedRole, setSelectedRole]   = useState<string>("pro-fleet");
    const [selectedPlan, setSelectedPlan]   = useState<string>("pro-fleet");
    const [billingAnnual, setBillingAnnual] = useState(false);

    const handleRoleSelect = (roleId: string) => {
        const role = ROLES.find(r => r.id === roleId);
        setSelectedRole(roleId);
        if (role) setSelectedPlan(role.bestPlan);
    };

    const annualDiscount = (price: string) => {
        const num = parseFloat(price.replace("$", ""));
        if (isNaN(num)) return price;
        return `$${Math.round(num * 0.8)}`;
    };

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

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 pt-14 pb-16 border-b border-slate-800/60">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            14-day free trial · No credit card required
                        </div>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none mb-5">
                            <span className="text-white">Get started</span>
                            <br />
                            <span className="shimmer-text">in 15 minutes.</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Choose your role, pick a plan, and start your free trial. Your ELD ships same day.
                        </p>

                        {/* Stats row */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                            {[
                                { icon: "✓", text: "FMCSA-certified ELD included" },
                                { icon: "✓", text: "Ships in 1 business day" },
                                { icon: "✓", text: "Cancel anytime" },
                                { icon: "✓", text: "24/7 support" },
                            ].map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5">
                                    <span className="text-cyan-400 font-bold">{item.icon}</span>
                                    {item.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Step 1: Who are you ──────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14">
                    <div className="max-w-7xl mx-auto">

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                STEP 1
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-2">
                                Who are you?
                            </h2>
                            <p className="text-slate-400 max-w-md mx-auto">
                                We'll recommend the best plan for your situation.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                            {ROLES.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role.id)}
                                    className={`glass rounded-2xl p-6 border text-left group transition-all duration-200 relative overflow-hidden ${
                                        selectedRole === role.id
                                            ? `${role.accent} ring-1 ring-cyan-500/40`
                                            : "border-slate-700/30 hover:border-slate-600/50"
                                    }`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-cyan-500/5 to-transparent rounded-2xl" />
                                    <div className="relative">
                                        <div className="p-2.5 glass rounded-xl inline-block mb-4">{role.icon}</div>
                                        <div className="font-display text-base font-700 text-white mb-1">{role.title}</div>
                                        <div className="text-xs text-slate-400 leading-relaxed">{role.desc}</div>
                                        {selectedRole === role.id && (
                                            <div className="mt-3 flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                Selected
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Step 2: Pick a plan ──────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-6 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                STEP 2
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-2">
                                Choose your plan
                            </h2>
                            <p className="text-slate-400 mb-6 max-w-md mx-auto">
                                All plans include a 14-day free trial. Switch anytime.
                            </p>

                            {/* Billing toggle */}
                            <div className="inline-flex items-center gap-3 glass rounded-full px-4 py-2 border border-slate-700/40">
                                <span className={`text-xs font-medium transition-colors ${!billingAnnual ? "text-white" : "text-slate-500"}`}>Monthly</span>
                                <button
                                    onClick={() => setBillingAnnual(p => !p)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${billingAnnual ? "bg-cyan-500/70" : "bg-slate-700/70"}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${billingAnnual ? "left-[22px]" : "left-0.5"}`} />
                                </button>
                                <span className={`text-xs font-medium transition-colors ${billingAnnual ? "text-cyan-300" : "text-slate-500"}`}>
                                    Annual <span className="text-emerald-400 font-bold">–20%</span>
                                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">
                            {PLANS.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`rounded-3xl overflow-hidden relative cursor-pointer transition-all duration-200 ${
                                        plan.highlight
                                            ? `border bg-gradient-to-b from-cyan-500/10 to-transparent ${plan.accentBorder}`
                                            : `glass border ${plan.accentBorder}`
                                    } ${selectedPlan === plan.id ? "ring-2 ring-cyan-500/50 scale-[1.02]" : "hover:scale-[1.01]"}`}
                                    style={plan.accentGlow ? { boxShadow: plan.accentGlow } : undefined}
                                >
                                    {plan.badge && (
                                        <div className="absolute top-0 left-0 right-0 flex justify-center">
                                            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] text-[10px] font-bold tracking-widest px-4 py-1 rounded-b-lg">
                                                {plan.badge}
                                            </div>
                                        </div>
                                    )}

                                    <div className={`px-6 ${plan.badge ? "pt-8" : "pt-6"} pb-6`}>
                                        {/* Selected indicator */}
                                        <div className={`flex items-center justify-between mb-3 ${!plan.badge ? "mt-0" : ""}`}>
                                            <span className="text-xs font-semibold text-slate-400">{plan.name}</span>
                                            {selectedPlan === plan.id && (
                                                <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/60 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="font-display font-800 text-4xl text-white">
                                                {billingAnnual ? annualDiscount(plan.price) : plan.price}
                                            </span>
                                            <span className="text-slate-500 text-xs">{plan.period}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-5 leading-relaxed">{plan.desc}</p>

                                        <ul className="space-y-2">
                                            {plan.features.map((feat, j) => (
                                                <li key={j} className="flex items-start gap-2.5 text-xs text-slate-400">
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
                    </div>
                </section>

                {/* ── Step 3: Sign-up form ─────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                STEP 3
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-2">
                                Create your account
                            </h2>
                            <p className="text-slate-400 max-w-md mx-auto">
                                Takes under 2 minutes. No credit card needed to start.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10 items-start">

                            {/* Left: form */}
                            <div className="lg:col-span-3">
                                <SignupForm selectedPlan={selectedPlan} />
                            </div>

                            {/* Right: trust signals */}
                            <div className="lg:col-span-2 space-y-5">

                                {/* What's included */}
                                <div className="glass rounded-2xl p-5 border border-slate-700/30">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        What's included in your trial
                                    </div>
                                    <ul className="space-y-3">
                                        {[
                                            { icon: "📦", text: "ELD device shipped free (fleets & owner-ops)" },
                                            { icon: "⚡", text: "Full platform access from day one" },
                                            { icon: "📞", text: "Onboarding call with a fleet specialist" },
                                            { icon: "📄", text: "FMCSA compliance setup assistance" },
                                            { icon: "🔄", text: "Cancel or switch plans anytime" },
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                                                <span className="text-base shrink-0">{item.icon}</span>
                                                {item.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Social proof */}
                                <div className="glass rounded-2xl p-5 border border-slate-700/30">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        Trusted by 14,800+ users
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                quote: "Setup took 11 minutes. ELD arrived next day. My last DOT inspection was 4 minutes flat.",
                                                name: "Devon K.", role: "Owner-Operator · Reefer",
                                                initials: "DK", accent: "from-cyan-500/30 to-teal-600/30 border-cyan-500/30 text-cyan-300",
                                            },
                                            {
                                                quote: "Cut our HOS violations by 91% in the first quarter. The compliance dashboard is a game-changer.",
                                                name: "James O.", role: "VP Ops · 48 trucks",
                                                initials: "JO", accent: "from-violet-500/30 to-purple-600/30 border-violet-500/30 text-violet-300",
                                            },
                                        ].map((t, i) => (
                                            <div key={i} className="glass rounded-xl p-4 border border-slate-700/25">
                                                <div className="flex gap-0.5 mb-2">
                                                    {Array.from({ length: 5 }).map((_, s) => (
                                                        <svg key={s} viewBox="0 0 12 12" className="w-3 h-3 text-amber-400" fill="currentColor">
                                                            <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-300 leading-relaxed mb-3">"{t.quote}"</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-full bg-linear-to-br ${t.accent} border flex items-center justify-center text-[10px] font-bold shrink-0`}>
                                                        {t.initials}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold text-white">{t.name}</div>
                                                        <div className="text-[10px] text-slate-500">{t.role}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Security badges */}
                                <div className="glass rounded-xl p-4 border border-slate-700/30">
                                    <div className="flex flex-wrap gap-3 justify-around">
                                        {[
                                            { label: "SOC 2 Type II", icon: "🔒" },
                                            { label: "FMCSA Registered", icon: "✅" },
                                            { label: "TLS 1.3 Encrypted", icon: "🛡️" },
                                        ].map((b, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <span className="text-xl">{b.icon}</span>
                                                <span className="text-[10px] text-slate-500 font-medium text-center">{b.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── How it works ─────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/6 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/6 rounded-full blur-[60px]" />
                            <div className="relative text-center mb-12">
                                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    HOW IT WORKS
                                </div>
                                <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
                                    From sign-up to road-ready<br />
                                    <span className="text-cyan-400">in under 24 hours</span>
                                </h2>
                                <p className="text-slate-400 max-w-lg mx-auto">
                                    No IT team, no long installation, no training days. Just plug in and drive.
                                </p>
                            </div>
                            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20" />
                                {STEPS.map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-5`}>
                                            <span className={`font-display text-xl font-700 ${step.color}`}>{step.num}</span>
                                        </div>
                                        <h3 className="font-display font-600 text-white text-base mb-2">{step.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FAQ ──────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14 border-t border-slate-800/60">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-blue-300 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                QUESTIONS
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-2">
                                Before you start
                            </h2>
                            <p className="text-slate-400">
                                Common questions about getting started with FleetPulse.
                            </p>
                        </div>
                        <FaqAccordion faqs={FAQS} />
                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-500">
                                More questions?{" "}
                                <a href="/support" className="text-cyan-400 hover:underline">Visit our support center</a>
                                {" "}or call{" "}
                                <a href="tel:18003533801" className="text-cyan-400 hover:underline">1-800-FLEET-01</a>
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── Final CTA ────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Your first mile starts</span>
                            <br />
                            <span className="shimmer-text">today.</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            14 days free. ELD ships same day. Compliance from minute one.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#"
                                onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                className="btn-glow font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-base"
                            >
                                Start Free Trial
                            </a>
                            <a
                                href="/contact"
                                className="glass rounded-xl px-10 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                            >
                                Talk to Sales
                            </a>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">
                            No credit card · No contract · Cancel anytime
                        </p>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}