import { useState, useEffect, useRef } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CookiePolicySection {
    id: string;
    title: string;
    icon: React.ReactNode;
    accent: string;
    dotColor: string;
    content: React.ReactNode;
}

interface CookieCategory {
    name: string;
    badge: "REQUIRED" | "OPTIONAL";
    badgeColor: string;
    desc: string;
    examples: string[];
    accent: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LAST_UPDATED   = "June 1, 2026";
const EFFECTIVE_DATE = "June 1, 2026";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CalloutBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-xl p-4 border border-cyan-500/20 bg-cyan-500/5 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-cyan-500/10 border border-cyan-500/30">
                <svg viewBox="0 0 12 12" className="w-3 h-3 text-cyan-400" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
        </div>
    );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COOKIE_CATEGORIES: CookieCategory[] = [
    {
        name: "Essential Cookies",
        badge: "REQUIRED",
        badgeColor: "bg-slate-700/60 text-slate-300 border-slate-600/50",
        desc: "Necessary for the Platform to function. These cannot be switched off — without them, login, security, and core features won't work.",
        examples: ["Authentication session tokens", "CSRF protection tokens", "Load balancing cookies", "Account security flags"],
        accent: "border-cyan-500/20 bg-cyan-500/5",
    },
    {
        name: "Preference Cookies",
        badge: "OPTIONAL",
        badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/30",
        desc: "Remember choices you've made so you don't have to set them again on every visit.",
        examples: ["Language & timezone settings", "Dashboard layout preferences", "Dark mode / display settings", "Dismissed banner state"],
        accent: "border-violet-500/20 bg-violet-500/5",
    },
    {
        name: "Analytics Cookies",
        badge: "OPTIONAL",
        badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        desc: "Help us understand how people use FleetPulse so we can improve it. We use a self-hosted analytics tool — no data is sent to Google or Meta.",
        examples: ["Page view counts", "Feature adoption events", "Session duration", "Aggregated click paths"],
        accent: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
        name: "Support Chat Cookies",
        badge: "OPTIONAL",
        badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        desc: "Used by our live chat widget to keep your conversation active as you move between pages.",
        examples: ["Chat session ID", "Conversation continuity token"],
        accent: "border-amber-500/20 bg-amber-500/5",
    },
];

const COOKIE_TOGGLES: { name: string; locked: boolean }[] = [
    { name: "Essential",    locked: true  },
    { name: "Preferences",  locked: false },
    { name: "Analytics",    locked: false },
    { name: "Support Chat", locked: false },
];

const COOKIE_SECTIONS: CookiePolicySection[] = [
    {
        id: "what-are-cookies",
        title: "What Are Cookies?",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="7"  cy="8"  r="1" fill="currentColor" />
                <circle cx="13" cy="8"  r="1" fill="currentColor" />
                <path d="M7 13s1.5 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-cyan-300",
        dotColor: "bg-cyan-400",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>
                    Cookies are small text files placed on your device when you visit a website. They let the site remember information about your visit — like your login state or display preferences — so your next visit can be faster and more useful.
                </p>
                <p>
                    This policy explains how FleetPulse uses cookies and similar technologies (like local storage and pixels) across our web application at app.fleetpulse.com and our marketing site.
                </p>
                <CalloutBox>
                    <span className="text-cyan-300 font-medium">We don't use advertising cookies.</span> FleetPulse doesn't run display ads or sell data to ad networks, so you won't see third-party ad-tracking cookies anywhere on our Platform.
                </CalloutBox>
            </div>
        ),
    },
    {
        id: "categories",
        title: "Cookie Categories We Use",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10h6M7 13h4M7 7h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-violet-300",
        dotColor: "bg-violet-400",
        content: (
            <div className="space-y-3">
                {COOKIE_CATEGORIES.map((cat, i) => (
                    <div key={i} className={`rounded-xl p-4 border ${cat.accent}`}>
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="text-sm font-semibold text-slate-200">{cat.name}</span>
                            <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                                {cat.badge}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">{cat.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {cat.examples.map((ex, j) => (
                                <span key={j} className="text-[10px] px-2 py-1 rounded-md glass border border-slate-700/40 text-slate-500">
                                    {ex}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "third-party",
        title: "Third-Party Cookies",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="5"  cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-amber-300",
        dotColor: "bg-amber-400",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>A small number of service providers set their own cookies when you use FleetPulse, strictly to deliver the feature they support:</p>
                <div className="space-y-2">
                    {[
                        { name: "Stripe",     purpose: "Fraud prevention during checkout and payment processing." },
                        { name: "Intercom",   purpose: "Powers our live chat widget and support conversation history." },
                        { name: "Cloudflare", purpose: "Bot detection and DDoS protection at the network edge." },
                    ].map((p, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 glass rounded-lg border border-slate-700/25">
                            <div className="text-slate-200 font-medium text-xs w-20 flex-shrink-0">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.purpose}</div>
                        </div>
                    ))}
                </div>
                <p>These providers' use of cookies is governed by their own privacy and cookie policies, not this one.</p>
            </div>
        ),
    },
    {
        id: "managing",
        title: "Managing Your Cookie Preferences",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-emerald-300",
        dotColor: "bg-emerald-400",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>You can manage optional cookies at any time:</p>
                <ul className="space-y-2">
                    {[
                        "Use the Cookie Preferences link in the site footer to toggle Preference, Analytics, and Support Chat cookies on or off.",
                        "Adjust your browser settings to block or delete cookies — instructions vary by browser (Chrome, Safari, Firefox, Edge all support this in their privacy settings).",
                        "Use private/incognito browsing to prevent cookies from persisting after your session ends.",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 mt-1.5 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
                <CalloutBox>
                    Blocking essential cookies will prevent core parts of FleetPulse — like staying logged in — from working correctly.
                </CalloutBox>
            </div>
        ),
    },
    {
        id: "contact-cookies",
        title: "Questions",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M3 3h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-cyan-300",
        dotColor: "bg-cyan-400",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>
                    Questions about this Cookie Policy can be directed to <span className="text-cyan-300">privacy@fleetpulse.com</span>. For more on how we handle personal data more broadly, see our <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        ),
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CookiePolicyPage() {
    const [activeSection, setActiveSection] = useState<string>("what-are-cookies");
    const [prefs, setPrefs] = useState<Record<string, boolean>>({
        Essential: true,
        Preferences: true,
        Analytics: true,
        "Support Chat": false,
    });
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const toggleCookie = (name: string) => {
        if (name === "Essential") return;
        setPrefs(p => ({ ...p, [name]: !p[name] }));
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );
        COOKIE_SECTIONS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-screen bg-[#040f16] text-white overflow-x-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-cyan-500/5  blur-[120px]" />
                <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-violet-500/4 blur-[100px]" />
                <div className="grid-bg absolute inset-0" />
            </div>

            <Navbar />

            <main className="relative pt-24">

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 pt-14 pb-10 border-b border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                Legal
                            </div>
                            <h1 className="font-display text-4xl sm:text-5xl font-800 text-white mb-4 leading-tight">
                                Cookie Policy
                            </h1>
                            <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-2xl">
                                A short explanation of the cookies FleetPulse uses and how you can control them.
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                                        <path d="M6 4v2l1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    </svg>
                                    Last updated: {LAST_UPDATED}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                        <path d="M6 1L2 3v4c0 2.5 1.9 4.6 4 5 2.1-.4 4-2.5 4-5V3L6 1z" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                    Effective: {EFFECTIVE_DATE}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                        <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1" />
                                        <path d="M3 6h6M3 4h4M3 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    </svg>
                                    {COOKIE_SECTIONS.length} sections · ~3 min read
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Main Layout ──────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-10">
                    <div className="max-w-7xl mx-auto flex gap-10">

                        {/* ── Sidebar TOC ────────────────────────────────── */}
                        <aside className="hidden lg:block w-56 flex-shrink-0">
                            <div className="sticky top-24 space-y-0.5">
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">
                                    Contents
                                </div>
                                {COOKIE_SECTIONS.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollTo(section.id)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-all duration-150 ${
                                            activeSection === section.id
                                                ? `${section.accent} bg-slate-800/40`
                                                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                                            activeSection === section.id ? section.dotColor : "bg-slate-700"
                                        }`} />
                                        {section.title}
                                    </button>
                                ))}
                                <div className="pt-4 border-t border-slate-800/60 mt-2 space-y-1">
                                    <a href="/privacy" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-cyan-300 transition-colors">
                                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0">
                                            <path d="M6 1L2 3v3c0 2.5 1.9 4.2 4 4.8 2.1-.6 4-2.3 4-4.8V3L6 1z" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                        Privacy Policy
                                    </a>
                                    <a href="/terms" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-cyan-300 transition-colors">
                                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0">
                                            <path d="M3 2h6l2 2v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                        Terms of Service
                                    </a>
                                </div>
                            </div>
                        </aside>

                        {/* ── Cookie Policy Content ──────────────────────── */}
                        <div className="flex-1 min-w-0 max-w-3xl">

                            {/* Quick preference toggles */}
                            <div className="glass-strong rounded-2xl p-6 border border-cyan-500/15 mb-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px]" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Manage Your Preferences</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-4">Toggle optional cookie categories below. Essential cookies can't be disabled.</p>
                                    <div className="space-y-2">
                                        {COOKIE_TOGGLES.map((toggle) => (
                                            <button
                                                key={toggle.name}
                                                disabled={toggle.locked}
                                                onClick={() => toggleCookie(toggle.name)}
                                                className="w-full flex items-center justify-between p-3 glass rounded-lg border border-slate-700/25 text-left"
                                            >
                                                <span className="text-xs text-slate-300">
                                                    {toggle.name}
                                                    {toggle.locked && <span className="text-slate-600 ml-1.5">(always on)</span>}
                                                </span>
                                                <div
                                                    className={`w-9 h-5 rounded-full relative transition-colors ${
                                                        toggle.locked ? "bg-slate-600/60 opacity-60 cursor-not-allowed" : prefs[toggle.name] ? "bg-cyan-500/60 cursor-pointer" : "bg-slate-700/60 cursor-pointer"
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                                            (toggle.locked || prefs[toggle.name]) ? "left-[18px]" : "left-0.5"
                                                        }`}
                                                    />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sections */}
                            <div className="space-y-10">
                                {COOKIE_SECTIONS.map((section) => (
                                    <div
                                        key={section.id}
                                        id={section.id}
                                        className="scroll-mt-28"
                                        ref={el => { sectionRefs.current[section.id] = el; }}
                                    >
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className={`p-2 glass rounded-lg ${section.accent}`}>
                                                {section.icon}
                                            </div>
                                            <h2 className={`font-display text-xl font-700 ${section.accent}`}>
                                                {section.title}
                                            </h2>
                                            <div className="flex-1 h-px bg-slate-800/60" />
                                        </div>
                                        {section.content}
                                    </div>
                                ))}
                            </div>

                            {/* Footer CTA */}
                            <div className="mt-12 pt-8 border-t border-slate-800/60">
                                <div className="glass rounded-xl p-5 border border-slate-700/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-white mb-0.5">Want more detail?</div>
                                        <div className="text-xs text-slate-400">Read our full Privacy Policy for how we handle data more broadly.</div>
                                    </div>
                                    <div className="flex gap-3 flex-shrink-0">
                                        <a
                                            href="/privacy"
                                            className="btn-glow text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-5 py-2.5 rounded-lg whitespace-nowrap"
                                        >
                                            View Privacy Policy
                                        </a>
                                        <a
                                            href="mailto:privacy@fleetpulse.com"
                                            className="glass text-sm text-slate-300 hover:text-cyan-300 border border-slate-600/50 hover:border-cyan-500/40 px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
                                        >
                                            Email Us
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}