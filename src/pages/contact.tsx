import { useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactReason {
    id: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
    badge?: string;
    badgeColor?: string;
    action: string;
    actionHref: string;
}

interface OfficeLocation {
    city: string;
    type: string;
    address: string[];
    phone: string;
    email: string;
    accent: string;
    dotColor: string;
}

interface SocialLink {
    name: string;
    abbr: string;
    href: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACT_REASONS: ContactReason[] = [
    {
        id: "sales",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <path d="M6 30 L13 18 L20 24 L27 12 L34 20" stroke="#00e5cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="27" cy="12" r="3" fill="#00e5cc" />
                <line x1="6" y1="34" x2="34" y2="34" stroke="#00e5cc" strokeWidth="1.5" opacity="0.4" />
            </svg>
        ),
        title: "Sales & Pricing",
        desc: "Talk to our team about plans, fleet pricing, custom enterprise contracts, or a live demo of the platform.",
        accent: "border-cyan-500/30 bg-cyan-500/6",
        badge: "FASTEST RESPONSE",
        badgeColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
        action: "Talk to Sales",
        actionHref: "#contact-form",
    },
    {
        id: "support",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <circle cx="20" cy="20" r="14" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4" />
                <path d="M15 17c0-2.761 2.239-5 5-5s5 2.239 5 5c0 2-1.5 3-3 4v2" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="29" r="1.5" fill="#a78bfa" />
            </svg>
        ),
        title: "Technical Support",
        desc: "ELD issues, app bugs, or integration questions? Our 24/7 support team is one click away.",
        accent: "border-violet-500/30 bg-violet-500/6",
        action: "Visit Support",
        actionHref: "/support",
    },
    {
        id: "press",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <rect x="6" y="8" width="28" height="24" rx="3" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4" />
                <path d="M12 18h16M12 23h10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="11" r="5" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M28 11h4M30 9v4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "Press & Media",
        desc: "Interview requests, company facts, executive quotes, or press kit downloads. We respond to media inquiries within 4 hours.",
        accent: "border-amber-500/30 bg-amber-500/6",
        action: "Press Inquiry",
        actionHref: "#contact-form",
    },
    {
        id: "partnerships",
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <circle cx="13" cy="13" r="6" stroke="#34d399" strokeWidth="1.5" opacity="0.5" />
                <circle cx="27" cy="27" r="6" stroke="#34d399" strokeWidth="1.5" opacity="0.5" />
                <path d="M17 13 Q27 13 27 21" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="13" cy="13" r="2.5" fill="#34d399" />
                <circle cx="27" cy="27" r="2.5" fill="#34d399" />
            </svg>
        ),
        title: "Partnerships & Integrations",
        desc: "Want to build on top of FleetPulse or integrate your product? Talk to our partnerships team about API access and co-marketing.",
        accent: "border-emerald-500/30 bg-emerald-500/6",
        action: "Partner With Us",
        actionHref: "#contact-form",
    },
];

const OFFICE_LOCATIONS: OfficeLocation[] = [
    {
        city: "Austin, TX",
        type: "Headquarters",
        address: ["1801 E 6th Street", "Suite 410", "Austin, TX 78702"],
        phone: "1-800-FLEET-01",
        email: "hello@fleetpulse.com",
        accent: "border-cyan-500/25 bg-cyan-500/4",
        dotColor: "bg-cyan-400",
    },
    {
        city: "Chicago, IL",
        type: "Midwest Hub",
        address: ["200 W Monroe Street", "Suite 1900", "Chicago, IL 60606"],
        phone: "1-800-FLEET-01",
        email: "chicago@fleetpulse.com",
        accent: "border-violet-500/25 bg-violet-500/4",
        dotColor: "bg-violet-400",
    },
];

const SOCIAL_LINKS: SocialLink[] = [
    {
        name: "LinkedIn",
        abbr: "in",
        href: "#",
        color: "text-blue-300",
        bg: "bg-blue-500/10 border-blue-500/25",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        name: "Twitter / X",
        abbr: "𝕏",
        href: "#",
        color: "text-slate-200",
        bg: "bg-slate-700/30 border-slate-600/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        name: "YouTube",
        abbr: "▶",
        href: "#",
        color: "text-rose-300",
        bg: "bg-rose-500/10 border-rose-500/25",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon fill="#040f16" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
            </svg>
        ),
    },
];

const FORM_SUBJECTS = [
    "Sales & Pricing Inquiry",
    "Enterprise / Fleet Demo Request",
    "Press & Media Inquiry",
    "Partnership & Integration",
    "General Question",
    "Other",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MapIllustration() {
    return (
        <div className="relative h-48 rounded-xl overflow-hidden bg-[#061824] border border-slate-700/30">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
                {/* Grid */}
                {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => (
                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" stroke="#00e5cc" strokeWidth="0.3" opacity="0.15" />
                ))}
                {[36, 72, 108, 144].map(y => (
                    <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#00e5cc" strokeWidth="0.3" opacity="0.15" />
                ))}
                {/* US outline simplified */}
                <path d="M60 50 Q120 30 200 45 Q280 60 340 50 L350 120 Q290 140 200 135 Q110 130 60 120 Z" stroke="#1e4a5a" strokeWidth="1.5" fill="#061d2a" opacity="0.8" />
                {/* Austin dot */}
                <circle cx="185" cy="108" r="5" fill="#00e5cc" opacity="0.9" />
                <circle cx="185" cy="108" r="10" fill="#00e5cc" opacity="0.15" />
                <circle cx="185" cy="108" r="16" fill="#00e5cc" opacity="0.06" />
                {/* Chicago dot */}
                <circle cx="215" cy="78" r="5" fill="#a78bfa" opacity="0.9" />
                <circle cx="215" cy="78" r="10" fill="#a78bfa" opacity="0.15" />
                {/* Labels */}
                <text x="172" y="125" fontSize="7" fill="#00e5cc" opacity="0.8" fontFamily="monospace">Austin</text>
                <text x="202" y="95" fontSize="7" fill="#a78bfa" opacity="0.8" fontFamily="monospace">Chicago</text>
                {/* Route line */}
                <path d="M185 108 Q195 92 215 78" stroke="#00e5cc" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" fill="none" />
            </svg>
        </div>
    );
}

function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: "", email: "", company: "", subject: "", message: "", phone: "",
    });

    const handleSubmit = () => {
        if (form.name && form.email && form.message) setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="glass rounded-2xl p-12 border border-emerald-500/25 bg-emerald-500/5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-400">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h3 className="font-display text-2xl font-700 text-white mb-2">Message sent!</h3>
                <p className="text-sm text-slate-400 mb-1">
                    Thanks for reaching out, <span className="text-white">{form.name}</span>.
                </p>
                <p className="text-sm text-slate-500 mb-6">
                    We'll reply to <span className="text-cyan-300">{form.email}</span> within one business day.
                </p>
                <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", subject: "", message: "", phone: "" }); }}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div id="contact-form" className="glass rounded-2xl p-7 sm:p-9 border border-slate-700/30">
            <h2 className="font-display text-2xl font-700 text-white mb-1">Send us a message</h2>
            <p className="text-sm text-slate-400 mb-7">We read every message and respond within one business day.</p>

            <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Your name"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Email *</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="you@company.com"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Company</label>
                        <input
                            type="text"
                            value={form.company}
                            onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                            placeholder="Your company name"
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

                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Subject</label>
                    <select
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 bg-[#061d2a] transition-colors"
                    >
                        <option value="" className="bg-[#061d2a]">Select a subject…</option>
                        {FORM_SUBJECTS.map(s => (
                            <option key={s} value={s} className="bg-[#061d2a]">{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Message *</label>
                    <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us how we can help. Include any relevant details — fleet size, use case, timeline, or questions."
                        className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors resize-none"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full btn-glow py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] text-sm font-bold transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                >
                    Send Message
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M2 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <p className="text-xs text-slate-600 text-center">
                    We respond within one business day · For urgent help, call 1-800-FLEET-01
                </p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
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
                <section className="px-4 sm:px-6 pt-16 pb-14 border-b border-slate-800/60">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            We're here to help
                        </div>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none mb-5">
                            <span className="text-white">Get in touch.</span>
                            <br />
                            <span className="shimmer-text">We respond fast.</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
                            Whether you're exploring FleetPulse for the first time or need help with an existing account — the right person is ready to talk.
                        </p>

                        {/* Contact reason cards */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {CONTACT_REASONS.map((reason, i) => (
                                <a
                                    key={i}
                                    href={reason.actionHref}
                                    className={`glass rounded-2xl p-6 border card-glow group hover:border-cyan-500/30 transition-all duration-200 text-left relative overflow-hidden ${reason.accent}`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />
                                    <div className="relative">
                                        {reason.badge ? (
                                            <div className="flex justify-end mb-3">
                                                <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${reason.badgeColor}`}>
                                                    {reason.badge}
                                                </span>
                                            </div>
                                        ) : <div className="mb-3 h-6" />}

                                        <div className="p-2.5 glass rounded-xl inline-block mb-4 text-cyan-300">
                                            {reason.icon}
                                        </div>
                                        <h3 className="font-display text-base font-600 text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                                            {reason.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4">{reason.desc}</p>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:gap-2 transition-all">
                                            {reason.action}
                                            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Main: Form + Sidebar ─────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

                        {/* ── Left: Contact Form ─────────────────────────── */}
                        <div className="flex-1 min-w-0">
                            <ContactForm />
                        </div>

                        {/* ── Right: Sidebar info ────────────────────────── */}
                        <aside className="lg:w-80 flex-shrink-0 space-y-5">

                            {/* Direct contact options */}
                            <div className="glass rounded-2xl p-6 border border-slate-700/30">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Direct Contact
                                </div>
                                <div className="space-y-4">
                                    {[
                                        {
                                            icon: (
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <path d="M18 13.92v2.5a1.67 1.67 0 01-1.82 1.67A16.5 16.5 0 012.56 9.57 16.5 16.5 0 013.9 3.85 1.67 1.67 0 015.56 2h2.5a1.67 1.67 0 011.67 1.43c.1.8.3 1.59.58 2.34a1.67 1.67 0 01-.38 1.76L8.75 8.24a13.33 13.33 0 005 5l1.24-1.24a1.67 1.67 0 011.76-.38c.75.28 1.54.48 2.34.58A1.67 1.67 0 0118 13.92z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ),
                                            label: "Phone",
                                            value: "1-800-FLEET-01",
                                            sub: "Available 24/7",
                                            color: "text-emerald-300",
                                            href: "tel:18003533801",
                                        },
                                        {
                                            icon: (
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <path d="M3 3h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
                                                    <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                </svg>
                                            ),
                                            label: "General",
                                            value: "hello@fleetpulse.com",
                                            sub: "Replies within 1 business day",
                                            color: "text-cyan-300",
                                            href: "mailto:hello@fleetpulse.com",
                                        },
                                        {
                                            icon: (
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <path d="M3 3h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
                                                    <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                </svg>
                                            ),
                                            label: "Press",
                                            value: "press@fleetpulse.com",
                                            sub: "Media inquiries only",
                                            color: "text-amber-300",
                                            href: "mailto:press@fleetpulse.com",
                                        },
                                        {
                                            icon: (
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <path d="M3 3h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
                                                    <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                </svg>
                                            ),
                                            label: "Careers",
                                            value: "careers@fleetpulse.com",
                                            sub: "Job applications & hiring",
                                            color: "text-violet-300",
                                            href: "mailto:careers@fleetpulse.com",
                                        },
                                    ].map((item, i) => (
                                        <a key={i} href={item.href} className="flex items-start gap-3 group">
                                            <div className="w-8 h-8 rounded-lg glass border border-slate-700/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-all">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                                                <div className={`text-sm font-medium group-hover:underline ${item.color}`}>{item.value}</div>
                                                <div className="text-xs text-slate-600">{item.sub}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Offices */}
                            <div className="glass rounded-2xl p-6 border border-slate-700/30">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Our Offices
                                </div>
                                <MapIllustration />
                                <div className="mt-4 space-y-4">
                                    {OFFICE_LOCATIONS.map((office, i) => (
                                        <div key={i} className={`rounded-xl p-4 border ${office.accent}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-2 h-2 rounded-full ${office.dotColor}`} />
                                                <span className="text-sm font-semibold text-white">{office.city}</span>
                                                <span className="text-xs text-slate-500 ml-auto">{office.type}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 space-y-0.5 pl-4">
                                                {office.address.map((line, j) => (
                                                    <div key={j}>{line}</div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Response times */}
                            <div className="glass rounded-2xl p-6 border border-slate-700/30">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Response Times
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { channel: "Sales inquiries",    time: "Same day",    pct: 95, color: "from-cyan-500 to-teal-400",    text: "text-cyan-300"    },
                                        { channel: "Technical support",  time: "< 2 min",     pct: 98, color: "from-emerald-500 to-teal-400", text: "text-emerald-300" },
                                        { channel: "Press & media",      time: "< 4 hrs",     pct: 85, color: "from-amber-500 to-orange-400", text: "text-amber-300"   },
                                        { channel: "General email",      time: "1 business day", pct: 70, color: "from-violet-500 to-purple-400", text: "text-violet-300" },
                                    ].map(r => (
                                        <div key={r.channel}>
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-slate-400">{r.channel}</span>
                                                <span className={`font-semibold ${r.text}`}>{r.time}</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                                                <div className={`h-full rounded-full bg-gradient-to-r ${r.color}`} style={{ width: `${r.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social links */}
                            <div className="glass rounded-2xl p-6 border border-slate-700/30">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Follow Us
                                </div>
                                <div className="flex gap-3">
                                    {SOCIAL_LINKS.map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl glass border flex-1 justify-center ${social.bg} ${social.color} hover:opacity-80 transition-opacity`}
                                        >
                                            {social.icon}
                                            <span className="text-xs font-medium">{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                        </aside>
                    </div>
                </section>

                {/* ── FAQ teaser ───────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/6 rounded-full blur-[70px]" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/6 rounded-full blur-[60px]" />
                            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                        QUICK ANSWERS
                                    </div>
                                    <h2 className="font-display text-3xl font-700 text-white mb-3 leading-tight">
                                        Before you reach out —<br />
                                        <span className="text-cyan-400">check our support docs</span>
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed mb-6">
                                        Most questions about ELD setup, HOS rules, billing, and integrations are answered in our documentation and support center — usually faster than waiting for a reply.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <a href="/docs" className="btn-glow text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-6 py-2.5 rounded-xl">
                                            Browse Docs
                                        </a>
                                        <a href="/support" className="glass text-sm text-slate-300 hover:text-cyan-300 border border-slate-600/50 hover:border-cyan-500/40 px-6 py-2.5 rounded-xl transition-all">
                                            Support Center
                                        </a>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { q: "How do I set up my ELD?",               href: "/docs#eld-setup"    },
                                        { q: "How does billing work?",                href: "/docs#billing"      },
                                        { q: "How do I connect to DAT?",              href: "/docs#dat"          },
                                        { q: "What are HOS drive limits?",            href: "/docs#hos-overview" },
                                        { q: "How do I add a driver?",                href: "/docs#admin-setup"  },
                                        { q: "How do I export IFTA reports?",         href: "/docs#ifta-export"  },
                                    ].map((item, i) => (
                                        <a
                                            key={i}
                                            href={item.href}
                                            className="glass rounded-xl px-4 py-3 border border-slate-700/30 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/25 transition-all group flex items-center justify-between gap-2"
                                        >
                                            <span className="leading-snug">{item.q}</span>
                                            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-slate-600 group-hover:text-cyan-500 flex-shrink-0 transition-colors">
                                                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Bottom CTA ───────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Still have questions?</span>
                            <br />
                            <span className="shimmer-text">We pick up the phone.</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Our team is available 24/7 for drivers and fleet managers. Sales and partnerships respond same day.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:18003533801"
                                className="btn-glow font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-base"
                            >
                                Call 1-800-FLEET-01
                            </a>
                            <a
                                href="#contact-form"
                                className="glass rounded-xl px-10 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                            >
                                Send a Message
                            </a>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">
                            Available 24/7 · Average wait under 2 min · Offices in Austin & Chicago
                        </p>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}