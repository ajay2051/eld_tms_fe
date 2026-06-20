import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavSubItem {
    label: string;
    href: string;
}

interface NavLink {
    label: string;
    sub: NavSubItem[];
}

interface NavDropdownProps {
    label: string;
    sub: NavSubItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
    {
        label: "Products",
        sub: [
            { label: "Fleet Tracking",  href: "/fleet-tracking"  },
            { label: "ELD Compliance",  href: "/eld-compliance"  },
            { label: "Load Management", href: "/load-management" },
        ],
    },
    {
        label: "Solutions",
        sub: [
            { label: "Owner Operators", href: "/owner-operators" },
            { label: "Fleets",          href: "/fleets"          },
            { label: "Brokers",         href: "/brokers"         },
        ],
    },
    {
        label: "Resources",
        sub: [
            { label: "Documentation",   href: "/docs"    },
            { label: "Blog",            href: "/blog"    },
            { label: "Support",         href: "/support" },
        ],
    },
    {
        label: "Company",
        sub: [
            { label: "About",           href: "/about"    },
            { label: "Careers",         href: "/careers"  },
            { label: "Contact",         href: "/contact"  },
        ],
    },
];

// ─── NavDropdown ──────────────────────────────────────────────────────────────

function NavDropdown({ label, sub }: NavDropdownProps) {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div
            ref={ref}
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 text-sm font-medium transition-colors duration-200 py-2 px-1"
                onClick={() => setOpen((prev) => !prev)}
            >
                {label}
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-cyan-500/20 bg-[#061d2a]/95 backdrop-blur-xl shadow-2xl shadow-black/50 py-1.5 z-50">
                    {sub.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors duration-150"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
    return (
        <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="6.5"  cy="16" r="2" fill="white" />
                        <circle cx="17.5" cy="16" r="2" fill="white" />
                        <path d="M2 11h11" stroke="white" strokeWidth="1" opacity="0.5" />
                    </svg>
                </div>
                <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-sm group-hover:bg-cyan-400/40 transition-colors" />
            </div>
            <span className="font-display font-700 text-lg tracking-tight">
                <span className="text-white">fleet</span>
                <span className="text-cyan-400">pulse</span>
            </span>
        </a>
    );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [scrolled,   setScrolled]   = useState<boolean>(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "glass-strong shadow-2xl shadow-black/40" : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Logo />

                {/* Desktop nav links */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <NavDropdown key={link.label} label={link.label} sub={link.sub} />
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="/login"
                        className="text-sm text-slate-300 hover:text-cyan-300 transition-colors px-3 py-2 font-medium"
                    >
                        Log In
                    </a>
                    <a
                        href="/get-started"
                        className="btn-glow text-sm font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-5 py-2.5 rounded-lg"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 text-slate-300 hover:text-cyan-300 transition-colors"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                        {mobileOpen ? (
                            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="md:hidden glass-strong border-t border-cyan-500/10 px-4 py-4 space-y-2">
                    {NAV_LINKS.map((link) => (
                        <div key={link.label}>
                            <div className="text-sm font-semibold text-slate-200 py-2">{link.label}</div>
                            {link.sub.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="block pl-4 py-1.5 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    ))}
                    <div className="pt-4 flex flex-col gap-2">
                        <a
                            href="/login"
                            className="text-center text-sm text-slate-300 border border-slate-600 rounded-lg py-2.5 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
                        >
                            Log In
                        </a>
                        <a
                            href="/get-started"
                            className="text-center text-sm font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] rounded-lg py-2.5"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}