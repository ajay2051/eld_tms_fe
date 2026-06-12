// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
    label: string;
    href: string;
}

interface FooterColumn {
    heading: string;
    links: FooterLink[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOOTER_COLUMNS: FooterColumn[] = [
    {
        heading: "Products",
        links: [
            { label: "Fleet Tracking",    href: "#" },
            { label: "ELD Compliance",    href: "#" },
            { label: "Load Management",   href: "#" },
            { label: "Driver App",        href: "#" },
        ],
    },
    {
        heading: "Solutions",
        links: [
            { label: "Owner Operators",   href: "#" },
            { label: "Small Fleets",      href: "#" },
            { label: "Enterprise",        href: "#" },
            { label: "Brokers",           href: "#" },
        ],
    },
    {
        heading: "Resources",
        links: [
            { label: "Documentation",     href: "#" },
            { label: "API Reference",     href: "#" },
            { label: "Blog",              href: "/blog" },
            { label: "Support Center",    href: "#" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About Us",          href: "/about" },
            { label: "Careers",           href: "/careers" },
            { label: "Press",             href: "#" },
            { label: "Contact",           href: "/contact" },
        ],
    },
];

const SOCIAL_LINKS: FooterLink[] = [
    { label: "Twitter",  href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "GitHub",   href: "#" },
];

const LEGAL_LINKS: FooterLink[] = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "#" },
];

// ─── Logo (local copy to keep Footer self-contained) ─────────────────────────

function FooterLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-md shadow-cyan-500/25">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                    <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="6.5"  cy="16" r="2" fill="white" />
                    <circle cx="17.5" cy="16" r="2" fill="white" />
                    <path d="M2 11h11" stroke="white" strokeWidth="1" opacity="0.5" />
                </svg>
            </div>
            <span className="font-display text-base font-600">
        <span className="text-white">fleet</span>
        <span className="text-cyan-400">pulse</span>
      </span>
        </div>
    );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-slate-800/60">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10">

                    {/* Brand column */}
                    <div className="col-span-2">
                        <FooterLogo />
                        <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
                            Real-time fleet tracking and FMCSA-certified ELD compliance for carriers of every size.
                        </p>

                        {/* FMCSA badge */}
                        <div className="mt-5 inline-flex items-center gap-2 glass rounded-lg px-3 py-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs text-slate-300 font-medium">FMCSA Registered ELD</span>
                        </div>

                        {/* Social links */}
                        <div className="mt-6 flex items-center gap-3">
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all duration-200"
                                >
                                    {/* Generic icon placeholder — swap for real icons (e.g. lucide-react) */}
                                    <span className="text-[10px] font-bold uppercase">{s.label[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.heading} className="col-span-1">
                            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
                                {col.heading}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-slate-500 hover:text-cyan-300 transition-colors duration-150"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-800/60 py-6 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        © {currentYear} FleetPulse Inc. · ELD Registration #FP-12345
                    </p>
                    <div className="flex items-center gap-5">
                        {LEGAL_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}