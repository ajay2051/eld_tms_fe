import { useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SupportChannel {
    icon: React.ReactNode;
    title: string;
    desc: string;
    action: string;
    actionHref: string;
    availability: string;
    availabilityColor: string;
    accent: string;
    badge?: string;
    badgeColor?: string;
}

interface FaqItem {
    question: string;
    answer: string;
    category: string;
}

interface StatusService {
    name: string;
    status: "operational" | "degraded" | "outage";
    uptime: string;
}

interface SupportCategory {
    icon: React.ReactNode;
    label: string;
    count: string;
    accent: string;
    href: string;
}

type FaqCategory = "All" | "ELD & HOS" | "Account" | "Billing" | "Integrations" | "Mobile App";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUPPORT_CHANNELS: SupportChannel[] = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Phone Support",
        desc: "Talk directly with a fleet specialist. Best for urgent issues, DOT inspection help, or ELD setup questions.",
        action: "1-800-FLEET-01",
        actionHref: "tel:18003533801",
        availability: "Available 24/7",
        availabilityColor: "text-emerald-300",
        accent: "border-cyan-500/30 bg-cyan-500/5",
        badge: "FASTEST",
        badgeColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Live Chat",
        desc: "Instant help from our support team right in your browser. Average first response under 90 seconds.",
        action: "Start Chat",
        actionHref: "#chat",
        availability: "Available 24/7",
        availabilityColor: "text-emerald-300",
        accent: "border-violet-500/30 bg-violet-500/5",
        badge: "RECOMMENDED",
        badgeColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Email Support",
        desc: "Send us your issue with screenshots or log files attached. We respond within 2 business hours.",
        action: "support@fleetpulse.com",
        actionHref: "mailto:support@fleetpulse.com",
        availability: "Response within 2 hrs",
        availabilityColor: "text-amber-300",
        accent: "border-amber-500/30 bg-amber-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Schedule a Call",
        desc: "Book a 30-minute screen-share session with a specialist for onboarding, training, or complex setup help.",
        action: "Book Time",
        actionHref: "#schedule",
        availability: "Mon – Fri, 8am – 8pm ET",
        availabilityColor: "text-blue-300",
        accent: "border-blue-500/30 bg-blue-500/5",
    },
];

const SUPPORT_CATEGORIES: SupportCategory[] = [
    {
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        label: "ELD & HOS",
        count: "42 articles",
        accent: "text-amber-300 border-amber-500/30 bg-amber-500/8",
        href: "/docs#eld-compliance",
    },
    {
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M2 10h12l3 4v2H2V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="5" cy="16" r="1.5" fill="currentColor" />
                <circle cx="14" cy="16" r="1.5" fill="currentColor" />
            </svg>
        ),
        label: "Fleet Tracking",
        count: "31 articles",
        accent: "text-cyan-300 border-cyan-500/30 bg-cyan-500/8",
        href: "/docs#fleet-management",
    },
    {
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M7 8l-4 4 4 4M13 8l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        label: "API & Integrations",
        count: "28 articles",
        accent: "text-violet-300 border-violet-500/30 bg-violet-500/8",
        href: "/docs#api-reference",
    },
    {
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        label: "Billing & Plans",
        count: "18 articles",
        accent: "text-emerald-300 border-emerald-500/30 bg-emerald-500/8",
        href: "/docs#billing",
    },
    {
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <rect x="5" y="2" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="15" r="1" fill="currentColor" />
            </svg>
        ),
        label: "Mobile App",
        count: "24 articles",
        accent: "text-rose-300 border-rose-500/30 bg-rose-500/8",
        href: "/docs#app-install",
    },
    {
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        label: "IFTA & Reports",
        count: "15 articles",
        accent: "text-blue-300 border-blue-500/30 bg-blue-500/8",
        href: "/docs#ifta-reporting",
    },
];

const STATUS_SERVICES: StatusService[] = [
    { name: "REST API",           status: "operational", uptime: "99.98%" },
    { name: "GPS Tracking",       status: "operational", uptime: "99.97%" },
    { name: "ELD Sync",           status: "operational", uptime: "99.99%" },
    { name: "Driver Mobile App",  status: "operational", uptime: "99.95%" },
    { name: "Shipper Portal",     status: "operational", uptime: "99.96%" },
    { name: "Webhooks",           status: "operational", uptime: "99.93%" },
];

const FAQ_ITEMS: FaqItem[] = [
    {
        category: "ELD & HOS",
        question: "My ELD device isn't connecting to the app. What should I do?",
        answer: "First, make sure Bluetooth is enabled on your phone and you're within 10 feet of the ELD device. Open the FleetPulse app, go to Settings → Device, and tap 'Scan for Devices'. If the device still doesn't appear, unplug it from the OBD-II port, wait 30 seconds, and plug it back in. If the issue persists, contact our 24/7 phone support line.",
    },
    {
        category: "ELD & HOS",
        question: "How do I transfer my ELD data to a DOT officer during a roadside inspection?",
        answer: "In the FleetPulse driver app, tap the menu icon, then 'DOT Inspection'. You can transfer your logs via Bluetooth or email directly to the officer's tablet. The transfer takes under 2 minutes. Make sure your app is updated to v3.7 or later for the fastest transfer method.",
    },
    {
        category: "ELD & HOS",
        question: "What happens if I lose cell signal while driving?",
        answer: "FleetPulse records all driving data locally on the ELD device and syncs it automatically when connectivity is restored. Your HOS logs, GPS track, and engine data are never lost. The driver app also works in offline mode for logging duty status changes.",
    },
    {
        category: "Account",
        question: "How do I add a new driver or truck to my fleet account?",
        answer: "Log in to your fleet dashboard and go to Fleet → Drivers (or Vehicles). Click 'Add Driver' or 'Add Vehicle' and fill in the required details. For drivers, an invite email is sent automatically. For vehicles, you'll be prompted to pair a new ELD device during setup.",
    },
    {
        category: "Account",
        question: "Can I set different permission levels for dispatchers and drivers?",
        answer: "Yes. Go to Settings → Team & Permissions. FleetPulse has four built-in roles: Owner, Admin, Dispatcher, and Driver. Each role has a preset permission set that you can further customize — for example, allowing dispatchers to assign loads but not view billing.",
    },
    {
        category: "Billing",
        question: "How does per-truck billing work? What counts as an active truck?",
        answer: "You're billed for each truck that has a paired ELD device and has logged at least one activity in the billing month. Trucks with unpaired devices or no activity are not counted. You can deactivate a truck at any time from the Vehicles page, and it will be removed from your next bill.",
    },
    {
        category: "Billing",
        question: "Can I change my plan mid-month?",
        answer: "Yes. Upgrades take effect immediately and are prorated for the remainder of the billing cycle. Downgrades take effect at the start of your next billing period. Go to Settings → Billing → Change Plan to make adjustments.",
    },
    {
        category: "Integrations",
        question: "How do I connect FleetPulse to DAT or Truckstop?",
        answer: "Go to Settings → Integrations and click on DAT or Truckstop. You'll be prompted to enter your credentials for the respective platform. Once connected, loads you post in FleetPulse sync automatically, and carrier searches from DAT/Truckstop results appear in your FleetPulse carrier list.",
    },
    {
        category: "Mobile App",
        question: "The driver app is showing a 'Device Not Paired' error. How do I fix it?",
        answer: "This usually means the ELD device was unpaired — either manually or after a firmware update. From the driver app, go to Settings → ELD Device → Pair New Device and follow the on-screen steps. Make sure your phone's Bluetooth is on. If you see the device in the scan list but it won't pair, try uninstalling and reinstalling the app.",
    },
    {
        category: "Mobile App",
        question: "Can drivers use the app on multiple phones?",
        answer: "Each driver account can be active on one phone at a time for ELD logging purposes (FMCSA requirement). Drivers can log in on a new phone, but this will sign them out of the previous device. We recommend drivers contact their fleet admin before switching devices mid-trip.",
    },
];

const FAQ_CATEGORIES: FaqCategory[] = ["All", "ELD & HOS", "Account", "Billing", "Integrations", "Mobile App"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: StatusService["status"] }) {
    const map = {
        operational: "bg-emerald-400",
        degraded:    "bg-amber-400",
        outage:      "bg-rose-500",
    };
    return <div className={`w-2 h-2 rounded-full ${map[status]} ${status === "operational" ? "" : "animate-pulse"}`} />;
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <div className="space-y-3">
            {items.map((item, i) => (
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
                            {item.question}
                        </span>
                        <svg
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`w-3.5 h-3.5 flex-shrink-0 text-slate-500 transition-transform duration-200 ${open === i ? "rotate-180 text-cyan-400" : ""}`}
                        >
                            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    {open === i && (
                        <div className="px-5 pb-5">
                            <div className="h-px bg-slate-800/60 mb-4" />
                            <p className="text-sm text-slate-400 leading-relaxed">{item.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function TicketForm() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", category: "", subject: "", message: "" });

    if (submitted) {
        return (
            <div className="glass rounded-2xl p-10 border border-emerald-500/20 bg-emerald-500/5 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-emerald-400">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="font-display text-xl font-700 text-white mb-2">Ticket submitted!</h3>
                <p className="text-sm text-slate-400 mb-4">
                    We've received your request and will respond to <span className="text-cyan-300">{form.email}</span> within 2 business hours.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "", subject: "", message: "" }); }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                    Submit another ticket
                </button>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-6 sm:p-8 border border-slate-700/30">
            <h3 className="font-display text-xl font-700 text-white mb-1">Submit a Support Ticket</h3>
            <p className="text-sm text-slate-400 mb-6">We respond within 2 business hours.</p>

            <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Your name"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="you@company.com"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Category</label>
                    <select
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 bg-[#061d2a] transition-colors"
                    >
                        <option value="" className="bg-[#061d2a]">Select a category…</option>
                        {["ELD & HOS", "Fleet Tracking", "Billing & Plans", "API & Integrations", "Mobile App", "IFTA & Reports", "Other"].map(c => (
                            <option key={c} value={c} className="bg-[#061d2a]">{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Subject</label>
                    <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        placeholder="Brief description of the issue"
                        className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Describe your issue in detail. Include any error messages, device info, or steps to reproduce…"
                        className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors resize-none"
                    />
                </div>

                <button
                    onClick={() => {
                        if (form.name && form.email && form.message) setSubmitted(true);
                    }}
                    className="w-full btn-glow py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] text-sm font-bold transition-opacity hover:opacity-90"
                >
                    Submit Ticket
                </button>
                <p className="text-xs text-slate-600 text-center">
                    For urgent issues, call us 24/7 at 1-800-FLEET-01
                </p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportPage() {
    const [faqCategory, setFaqCategory] = useState<FaqCategory>("All");
    const [faqSearch, setFaqSearch]     = useState("");

    const filteredFaqs = FAQ_ITEMS.filter(item => {
        const matchCat    = faqCategory === "All" || item.category === faqCategory;
        const matchSearch = !faqSearch.trim() ||
            item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
            item.answer.toLowerCase().includes(faqSearch.toLowerCase());
        return matchCat && matchSearch;
    });

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
                <section className="px-4 sm:px-6 py-16 border-b border-slate-800/60">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            All systems operational
                        </div>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 text-white mb-4 leading-tight">
                            How can we help you?
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
                            24/7 support for drivers, fleet managers, and brokers. We're here whenever you need us — on the road or in the office.
                        </p>

                        {/* Channel cards */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {SUPPORT_CHANNELS.map((ch, i) => (
                                <div
                                    key={i}
                                    className={`glass rounded-2xl p-6 border card-glow text-left relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-200 ${ch.accent}`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />
                                    <div className="relative">
                                        {ch.badge && (
                                            <div className="flex justify-end mb-3">
                                                <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${ch.badgeColor}`}>
                                                    {ch.badge}
                                                </span>
                                            </div>
                                        )}
                                        {!ch.badge && <div className="mb-3 h-6" />}
                                        <div className="p-2.5 glass rounded-xl inline-block mb-4 text-cyan-300">
                                            {ch.icon}
                                        </div>
                                        <h3 className="font-display text-base font-600 text-white mb-1">{ch.title}</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4">{ch.desc}</p>
                                        <div className="border-t border-slate-700/40 pt-3">
                                            <div className={`text-xs font-medium mb-2 ${ch.availabilityColor}`}>
                                                {ch.availability}
                                            </div>
                                            <a
                                                href={ch.actionHref}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors group-hover:gap-2"
                                            >
                                                {ch.action}
                                                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Browse by Topic & System Status ──────────────────────── */}
                <section className="px-4 sm:px-6 py-12">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

                        {/* Browse by topic */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="font-display text-2xl font-700 text-white">Browse by Topic</h2>
                                <div className="flex-1 h-px bg-slate-800/80" />
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {SUPPORT_CATEGORIES.map((cat, i) => (
                                    <a
                                        key={i}
                                        href={cat.href}
                                        className={`glass rounded-xl p-4 border card-glow group hover:border-cyan-500/25 transition-all duration-200 ${cat.accent}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-2 glass rounded-lg ${cat.accent}`}>
                                                {cat.icon}
                                            </div>
                                            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-slate-600 group-hover:text-cyan-500 transition-colors mt-1">
                                                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors mb-0.5">
                                            {cat.label}
                                        </div>
                                        <div className="text-xs text-slate-500">{cat.count}</div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* System status */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="font-display text-2xl font-700 text-white">System Status</h2>
                            </div>
                            <div className="glass rounded-2xl overflow-hidden border border-emerald-500/20 bg-emerald-500/4">
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/30">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-semibold text-emerald-300">All systems operational</span>
                                </div>
                                <div className="divide-y divide-slate-800/50">
                                    {STATUS_SERVICES.map((svc, i) => (
                                        <div key={i} className="flex items-center justify-between px-5 py-3">
                                            <span className="text-sm text-slate-300">{svc.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-slate-500">{svc.uptime}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <StatusDot status={svc.status} />
                                                    <span className="text-xs font-medium text-emerald-300 capitalize">{svc.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-5 py-3 border-t border-slate-700/30 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Last checked 2 min ago</span>
                                    <a href="#status" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                        Full status page →
                                    </a>
                                </div>
                            </div>

                            {/* Response times */}
                            <div className="glass rounded-2xl p-5 border border-slate-700/30 mt-4">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Response Times</div>
                                {[
                                    { channel: "Phone",    time: "< 2 min",   color: "text-emerald-300", bar: "from-emerald-500 to-teal-400",  pct: 95 },
                                    { channel: "Live Chat",time: "< 90 sec",  color: "text-cyan-300",    bar: "from-cyan-500 to-blue-400",      pct: 98 },
                                    { channel: "Email",    time: "< 2 hrs",   color: "text-amber-300",   bar: "from-amber-500 to-orange-400",   pct: 70 },
                                ].map(r => (
                                    <div key={r.channel} className="mb-3 last:mb-0">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-slate-400">{r.channel}</span>
                                            <span className={`font-semibold ${r.color}`}>{r.time}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                                            <div className={`h-full rounded-full bg-gradient-to-r ${r.bar}`} style={{ width: `${r.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FAQ ──────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-12 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                FREQUENTLY ASKED
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
                                Common questions, quick answers
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto mb-7">
                                Can't find what you need? Our support team is one click away.
                            </p>

                            {/* FAQ search */}
                            <div className="relative max-w-md mx-auto mb-6">
                                <svg viewBox="0 0 20 20" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none">
                                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M15 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    value={faqSearch}
                                    onChange={e => setFaqSearch(e.target.value)}
                                    placeholder="Search FAQs…"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                                />
                            </div>

                            {/* FAQ category pills */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {FAQ_CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFaqCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                                            faqCategory === cat
                                                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                                                : "glass border-slate-700/40 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            {filteredFaqs.length > 0 ? (
                                <FaqAccordion items={filteredFaqs} />
                            ) : (
                                <div className="glass rounded-2xl p-12 text-center border border-slate-700/30">
                                    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mx-auto mb-4 text-slate-600">
                                        <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M32 32l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M22 16v6M22 26v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <div className="text-slate-400 font-medium mb-1">No FAQs match your search</div>
                                    <div className="text-xs text-slate-600 mb-4">Try different keywords or clear the filter.</div>
                                    <button
                                        onClick={() => { setFaqSearch(""); setFaqCategory("All"); }}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Submit a Ticket ───────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-12 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">

                        {/* Left: copy */}
                        <div className="lg:sticky lg:top-28">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                SUBMIT A TICKET
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-4 leading-tight">
                                Can't find what<br />
                                <span className="text-cyan-400">you're looking for?</span>
                            </h2>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                Submit a support ticket and a specialist will get back to you within 2 business hours.
                                For urgent issues, use our 24/7 phone or live chat.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Dedicated ticket tracking number",
                                    "Response within 2 business hours",
                                    "Attach screenshots or log files",
                                    "Follow up anytime via email",
                                ].map(item => (
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

                            {/* Community link */}
                            <div className="mt-8 glass rounded-xl p-5 border border-slate-700/30">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 glass rounded-lg text-violet-300">
                                        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                                            <circle cx="7"  cy="8"  r="3" stroke="currentColor" strokeWidth="1.5" />
                                            <circle cx="13" cy="8"  r="3" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M1 17c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">Join our community</div>
                                        <div className="text-xs text-slate-500">8,400+ carriers, brokers & fleet managers</div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mb-3">Ask questions, share tips, and get answers from experienced FleetPulse users.</p>
                                <a href="#community" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium flex items-center gap-1">
                                    Visit Community Forum
                                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Right: form */}
                        <TicketForm />
                    </div>
                </section>

                {/* ── Bottom CTA ───────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-3xl sm:text-4xl font-700 mb-4">
                            <span className="text-white">A real person, ready to help.</span>
                            <br />
                            <span className="shimmer-text">Right now.</span>
                        </h2>
                        <p className="text-slate-400 mb-8">
                            No bots, no hold music, no ticket queues. Our fleet specialists pick up the phone and answer chat 24 hours a day, 7 days a week.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:18003533801"
                                className="btn-glow font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-base"
                            >
                                Call 1-800-FLEET-01
                            </a>
                            <a
                                href="#chat"
                                className="glass rounded-xl px-10 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                            >
                                Start Live Chat
                            </a>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">
                            Available 24/7 · Average wait time under 2 minutes · No hold music
                        </p>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}