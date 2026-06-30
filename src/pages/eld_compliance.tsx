import {useState, useEffect, useRef, type JSX} from "react";

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

interface Stat {
    value: string;
    label: string;
}

interface Feature {
    color: string;
    title: string;
    desc: string;
    items: string[];
}

interface DutySegment {
    status: string;
    hours: number;
    color: string;
}

interface FaqItem {
    q: string;
    a: string;
}

interface DashboardStatCard {
    icon: string;
    label: string;
    value: string;
    sub: string;
}

interface MockLogRow {
    id: string;
    date: string;
    driver: string;
    vehicle: string;
    trailer: string;
    load: string;
    drive: string;
    onDuty: string;
    miles: string;
    shipper: string;
    route: string;
}

interface HOSBar {
    label: string;
    used: number;
    max: number;
    color: string;
}

interface LegendItem {
    label: string;
    color: string;
}

interface InspectionStep {
    step: string;
    title: string;
    desc: string;
    color: string;
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
            { label: "Owner Operators", href: "/solutions/owner-operators" },
            { label: "Fleets",          href: "/solutions/fleets"          },
            { label: "Brokers",         href: "/solutions/brokers"         },
        ],
    },
    {
        label: "Resources",
        sub: [
            { label: "Documentation", href: "/docs"    },
            { label: "Blog",          href: "/blog"    },
            { label: "Support",       href: "/support" },
        ],
    },
    {
        label: "Company",
        sub: [
            { label: "About",   href: "/about"   },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
    },
];

const STATS: Stat[] = [
    { value: "FMCSA",    label: "Registered ELD"    },
    { value: "99.97%",   label: "Log Accuracy"      },
    { value: "< 30 sec", label: "DOT Transfer Time" },
    { value: "50-State", label: "DOT Compliant"     },
];

const FEATURES: Feature[] = [
    {
        color: "#00e5cc",
        title: "Automatic HOS Recording",
        desc: "Engine-sync records drive time, on-duty, sleeper berth, and off-duty status automatically — no manual entry required.",
        items: ["11-hr driving / 14-hr on-duty rule", "70-hr / 8-day cycle tracking", "Split sleeper berth support"],
    },
    {
        color: "#f59e0b",
        title: "Instant DOT Inspection Transfer",
        desc: "Transfer logs to an officer wirelessly or display them on screen in seconds. Fully formatted for roadside inspection.",
        items: ["Web services transfer (FMCSA portal)", "Email transfer option", "On-screen display mode"],
    },
    {
        color: "#a78bfa",
        title: "Driver Violation Alerts",
        desc: "Proactive push alerts warn drivers before they approach HOS limits, preventing costly violations and out-of-service orders.",
        items: ["30-min pre-violation warning", "Recap hours visibility", "Team driver support"],
    },
    {
        color: "#34d399",
        title: "DVIR Inspections",
        desc: "Digital pre/post-trip vehicle inspection reports with photo capture, defect tracking, and mechanic sign-off workflow.",
        items: ["Photo defect documentation", "Mechanic acknowledgment workflow", "Cloud-archived for 90 days"],
    },
    {
        color: "#f87171",
        title: "Unidentified Driving Detection",
        desc: "Automatically flags unassigned driving segments and prompts drivers to accept or reject them for a complete audit trail.",
        items: ["Carrier assignment tools", "Driver rejection logging", "FMCSA audit-ready reports"],
    },
    {
        color: "#60a5fa",
        title: "ELD Malfunction Handling",
        desc: "Guided malfunction workflow keeps drivers compliant even when a device issue occurs, with paper log fallback instructions.",
        items: ["On-device malfunction alerts", "8-day paper log fallback", "Auto-notify carrier"],
    },
];

const DUTY_TIMELINE: DutySegment[] = [
    { status: "Off Duty",      hours: 8,   color: "#334155" },
    { status: "On Duty",       hours: 1,   color: "#f59e0b" },
    { status: "Driving",       hours: 4.5, color: "#00e5cc" },
    { status: "On Duty",       hours: 0.5, color: "#f59e0b" },
    { status: "Driving",       hours: 3,   color: "#00e5cc" },
    { status: "Sleeper Berth", hours: 7,   color: "#6366f1" },
];

const FAQS: FaqItem[] = [
    {
        q: "Which carriers are required to use an ELD?",
        a: "All commercial motor vehicle (CMV) drivers subject to the HOS regulations must use an ELD — including property-carrying drivers required to keep records of duty status (RODS). Short-haul and driveaway-towaway exceptions apply.",
    },
    {
        q: "Is FleetPulse ELD registered with FMCSA?",
        a: "Yes. FleetPulse ELD is listed on the FMCSA's registered ELD list and meets all technical specifications in 49 CFR Part 395, Subpart B, Appendix A.",
    },
    {
        q: "What happens if my ELD malfunctions during a trip?",
        a: "The device will alert the driver and carrier. The driver may continue using paper logs for up to 8 days while the malfunction is being resolved. The carrier must correct or replace the device within 8 days.",
    },
    {
        q: "Can drivers edit their logs?",
        a: "Yes. Drivers can annotate and propose edits to their logs. All edits are tracked with timestamps, original values, and a required reason — maintaining a full audit trail for DOT inspections.",
    },
    {
        q: "How does the DOT roadside inspection transfer work?",
        a: "Logs can be transferred to an FMCSA-authorized safety official via Bluetooth, USB, or web services. The entire transfer takes under 30 seconds and requires no cellular connectivity.",
    },
];

const INSPECTION_STEPS: InspectionStep[] = [
    { step: "01", title: "Officer Requests Logs",   desc: "Officer asks for ELD data during a roadside inspection or at a weigh station.",                           color: "#00e5cc" },
    { step: "02", title: "Select Transfer Method",  desc: "Driver taps to transfer via web services, Bluetooth, or on-screen display — no WiFi required.",           color: "#f59e0b" },
    { step: "03", title: "Transfer Complete",        desc: "Logs transmitted to FMCSA portal or officer's device in under 30 seconds. Fully formatted.",               color: "#a78bfa" },
];

const HOS_LEGEND: LegendItem[] = [
    { label: "Driving",       color: "#00e5cc" },
    { label: "On Duty",       color: "#f59e0b" },
    { label: "Off Duty",      color: "#334155" },
    { label: "Sleeper Berth", color: "#6366f1" },
];

const HOS_BARS: HOSBar[] = [
    { label: "Drive Time", used: 9.2,  max: 11, color: "#00e5cc" },
    { label: "On Duty",    used: 11.5, max: 14, color: "#f59e0b" },
    { label: "Cycle 70/8", used: 52,   max: 70, color: "#a78bfa" },
];

const DASHBOARD_STAT_CARDS: DashboardStatCard[] = [
    { icon: "📈", label: "TOTAL ROUTES", value: "24",  sub: "All registered routes" },
    { icon: "📋", label: "DRIVER LOGS",  value: "3",   sub: "ELD log entries"       },
    { icon: "⏱",  label: "HOS LIMIT",    value: "11h", sub: "Drive / 14h on-duty"  },
    { icon: "🗂",  label: "ACTIVE PAGE",  value: "P1",  sub: "of 1 pages"            },
];

const MOCK_LOGS: MockLogRow[] = [
    { id: "ELD-0041", date: "05/27/26", driver: "J. Martinez", vehicle: "TRK-112", trailer: "TRL-44", load: "LD-9912", drive: "9.2h",  onDuty: "11.5h", miles: "524", shipper: "AmeriFreight", route: "CHI→DEN" },
    { id: "ELD-0040", date: "05/26/26", driver: "S. Patel",    vehicle: "TRK-087", trailer: "TRL-21", load: "LD-9901", drive: "7.8h",  onDuty: "10.2h", miles: "412", shipper: "LoadLink",    route: "DEN→PHX" },
    { id: "ELD-0039", date: "05/26/26", driver: "R. Torres",   vehicle: "TRK-055", trailer: "TRL-09", load: "LD-9889", drive: "10.9h", onDuty: "13.1h", miles: "601", shipper: "CargoPath",   route: "LAX→SFO" },
];

const TABLE_HEADERS: string[] = ["LOG ID", "DATE", "DRIVER", "VEHICLE", "DRIVE HRS", "ON DUTY", "MILES", "ROUTE"];
const HOUR_AXIS: number[]     = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const TRUST_TAGS: string[]    = ["FMCSA Registered ELD", "DOT Transfer < 30s", "Paper Log Fallback", "50-State Compliant"];
const HOS_CHECKLIST: string[] = [
    "11-hr drive / 14-hr on-duty / 70-hr cycle",
    "30-min pre-violation push alerts",
    "Split sleeper berth & team driver support",
    "Instant DOT inspection data transfer",
];
const FOOTER_CATS: string[]   = ["Products", "Company", "Legal"];
const FOOTER_LINKS: string[]  = ["Fleet Tracking", "ELD Compliance", "Pricing"];
const NAV_TABS: string[]      = ["Routes", "Driver Logs"];

// ─── NavDropdown ──────────────────────────────────────────────────────────────

function NavDropdown({ label, sub }: NavDropdownProps): JSX.Element {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent): void => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
                onClick={() => setOpen((prev: boolean) => !prev)}
                className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 text-sm font-medium transition-colors py-2 px-1"
            >
                {label}
                <svg
                    className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-cyan-500/20 bg-[#061d2a]/95 backdrop-blur-xl shadow-2xl py-1.5 z-50">
                    {sub.map((item: NavSubItem) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`block px-4 py-2 text-sm transition-colors duration-150 ${
                                item.href === "/eld-compliance"
                                    ? "text-cyan-300 bg-cyan-500/10"
                                    : "text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                            }`}
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

function Logo(): JSX.Element {
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
            <span className="font-semibold text-lg tracking-tight">
        <span className="text-white">fleet</span>
        <span className="text-cyan-400">pulse</span>
      </span>
        </a>
    );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar(): JSX.Element {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [scrolled,   setScrolled]   = useState<boolean>(false);

    useEffect(() => {
        const onScroll = (): void => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#040f16]/90 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-cyan-500/10"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Logo />

                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((link: NavLink) => (
                        <NavDropdown key={link.label} label={link.label} sub={link.sub} />
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="/login"
                        className="text-sm text-slate-300 hover:text-cyan-300 transition-colors px-3 py-2 font-medium"
                    >
                        Log In
                    </a>
                    <a
                        href="/get-started"
                        className="text-sm font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-5 py-2.5 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
                    >
                        Get Started
                    </a>
                </div>

                <button
                    className="md:hidden p-2 text-slate-300 hover:text-cyan-300 transition-colors"
                    onClick={() => setMobileOpen((prev: boolean) => !prev)}
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

            {mobileOpen && (
                <div className="md:hidden bg-[#061d2a]/95 backdrop-blur-xl border-t border-cyan-500/10 px-4 py-4 space-y-2">
                    {NAV_LINKS.map((link: NavLink) => (
                        <div key={link.label}>
                            <div className="text-sm font-semibold text-slate-200 py-2">{link.label}</div>
                            {link.sub.map((item: NavSubItem) => (
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

// ─── DashboardPreview ─────────────────────────────────────────────────────────

function DashboardPreview(): JSX.Element {
    const [activeTab, setActiveTab] = useState<string>("Driver Logs");

    return (
        <div
            className="w-full rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-black/60"
            style={{ background: "#061520" }}
        >
            {/* Top bar */}
            <div
                className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/10"
                style={{ background: "#040f16" }}
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                            <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                            <circle cx="6.5"  cy="16" r="2" fill="white" />
                            <circle cx="17.5" cy="16" r="2" fill="white" />
                        </svg>
                    </div>
                    <span className="text-xs font-semibold text-white">fleetpulse</span>
                    <span className="text-xs text-slate-500 mx-1">·</span>
                    <span className="flex items-center gap-1 text-xs text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Command Center
          </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-cyan-300">AM</span>
                    </div>
                    <span className="text-xs text-slate-300">Andrew Martin</span>
                    <span className="text-xs text-slate-500">Admin</span>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-5 pt-4 pb-1">
                <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 text-xs text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                    FleetPulse ELD Dashboard
                </div>
            </div>

            {/* Heading */}
            <div className="px-5 pt-2 pb-4">
                <h3 className="text-xl font-bold text-white">Operations Overview</h3>
                <p className="text-xs text-slate-400 mt-0.5">Monitor routes, driver logs, and fleet performance in real time.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3 px-5 pb-4">
                {DASHBOARD_STAT_CARDS.map((s: DashboardStatCard, i: number) => (
                    <div key={i} className="rounded-xl border border-cyan-500/15 p-3" style={{ background: "#071c28" }}>
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
                                style={{ background: "rgba(0,229,204,0.1)", border: "1px solid rgba(0,229,204,0.2)" }}
                            >
                                {s.icon}
                            </div>
                            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">{s.label}</span>
                        </div>
                        <div className="text-xl font-bold text-white">{s.value}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="px-5 flex gap-2 pb-3">
                {NAV_TABS.map((t: string) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === t
                                ? "bg-cyan-500 text-[#040f16]"
                                : "border border-slate-600 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div
                className="mx-5 mb-5 rounded-xl border border-cyan-500/15 overflow-hidden"
                style={{ background: "#071c28" }}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10">
                    <div>
                        <div className="text-sm font-semibold text-white">Driver Logs</div>
                        <div className="text-xs text-slate-400">{MOCK_LOGS.length} total log entries</div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            {MOCK_LOGS.length} entries
          </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-[10px]">
                        <thead>
                        <tr className="border-b border-cyan-500/10">
                            {TABLE_HEADERS.map((h: string) => (
                                <th
                                    key={h}
                                    className="text-left px-3 py-2 text-slate-500 font-semibold tracking-wider uppercase whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {MOCK_LOGS.map((row: MockLogRow, i: number) => (
                            <tr key={i} className="border-b border-slate-800/50 hover:bg-cyan-500/5 transition-colors">
                                <td className="px-3 py-2.5 text-cyan-400 font-mono font-semibold whitespace-nowrap">{row.id}</td>
                                <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">{row.date}</td>
                                <td className="px-3 py-2.5 text-slate-200 font-medium whitespace-nowrap">{row.driver}</td>
                                <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">{row.vehicle}</td>
                                <td className="px-3 py-2.5 text-emerald-400 font-semibold whitespace-nowrap">{row.drive}</td>
                                <td className="px-3 py-2.5 text-amber-400 font-semibold whitespace-nowrap">{row.onDuty}</td>
                                <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{row.miles}</td>
                                <td className="px-3 py-2.5 text-slate-300 font-mono whitespace-nowrap">{row.route}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-2 text-[10px] text-slate-500">Page 1 of 1</div>
            </div>
        </div>
    );
}

// ─── HOSTimeline ──────────────────────────────────────────────────────────────

function HOSTimeline(): JSX.Element {
    const total: number = DUTY_TIMELINE.reduce((sum: number, seg: DutySegment) => sum + seg.hours, 0);

    return (
        <div className="rounded-2xl border border-cyan-500/20 p-6" style={{ background: "#061520" }}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">24-hr HOS Log Grid</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> No Violations
        </span>
            </div>

            {/* Hour axis */}
            <div className="flex justify-between mb-1">
                {HOUR_AXIS.map((h: number) => (
                    <span key={h} className="text-[9px] text-slate-600">{h}</span>
                ))}
            </div>

            {/* Timeline bar */}
            <div className="flex h-8 rounded-lg overflow-hidden border border-slate-700/50 mb-3">
                {DUTY_TIMELINE.map((seg: DutySegment, i: number) => (
                    <div
                        key={i}
                        title={`${seg.status}: ${seg.hours}h`}
                        style={{ width: `${(seg.hours / total) * 100}%`, background: seg.color }}
                        className="transition-all hover:brightness-125 cursor-pointer"
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3">
                {HOS_LEGEND.map((l: LegendItem) => (
                    <span key={l.label} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                        {l.label}
          </span>
                ))}
            </div>

            {/* HOS progress bars */}
            <div className="mt-5 space-y-3">
                {HOS_BARS.map((bar: HOSBar) => (
                    <div key={bar.label}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{bar.label}</span>
                            <span className="font-semibold" style={{ color: bar.color }}>
                {bar.used}h / {bar.max}h
              </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${(bar.used / bar.max) * 100}%`, background: bar.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ(): JSX.Element {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {FAQS.map((faq: FaqItem, i: number) => (
                <div
                    key={i}
                    className="rounded-xl border border-cyan-500/15 overflow-hidden transition-all"
                    style={{ background: "#061520" }}
                >
                    <button
                        className="w-full flex items-center justify-between px-6 py-4 text-left"
                        onClick={() => setOpen(open === i ? null : i)}
                    >
                        <span className="text-sm font-medium text-slate-200">{faq.q}</span>
                        <svg
                            className={`w-4 h-4 text-cyan-400 flex-shrink-0 ml-4 transition-transform ${open === i ? "rotate-180" : ""}`}
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    {open === i && (
                        <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-cyan-500/10 pt-3">
                            {faq.a}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer(): JSX.Element {
    return (
        <footer
            className="border-t border-cyan-500/10 py-12 px-4 sm:px-6"
            style={{ background: "#040f16" }}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                <div>
                    <Logo />
                    <p className="text-xs text-slate-500 mt-3 max-w-xs leading-relaxed">
                        FMCSA-registered ELD and fleet management platform trusted by thousands of carriers nationwide.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-12 text-sm">
                    {FOOTER_CATS.map((cat: string) => (
                        <div key={cat}>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{cat}</div>
                            {FOOTER_LINKS.map((item: string) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="block text-slate-400 hover:text-cyan-300 transition-colors mb-1.5 text-xs"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-xs text-slate-600">© 2026 FleetPulse Inc. All rights reserved.</span>
                <span className="text-xs text-slate-600">FMCSA Registered ELD · DOT Compliant · 50-State</span>
            </div>
        </footer>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ELDCompliancePage(): JSX.Element {
    return (
        <div
            className="min-h-screen text-white overflow-x-hidden"
            style={{ background: "#040f16", fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

        .glass        { background: rgba(6,29,42,0.6);  backdrop-filter: blur(12px); border: 1px solid rgba(0,229,204,0.12); }
        .glass-strong { background: rgba(6,29,42,0.85); backdrop-filter: blur(20px); border: 1px solid rgba(0,229,204,0.15); }
        .shimmer-text {
          background: linear-gradient(90deg, #00e5cc 0%, #67e8f9 40%, #00e5cc 60%, #5eead4 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        .card-glow:hover { box-shadow: 0 0 0 1px rgba(0,229,204,0.2), 0 8px 40px rgba(0,229,204,0.08); }
        .btn-glow        { box-shadow: 0 0 20px rgba(0,229,204,0.3); transition: box-shadow 0.2s, transform 0.15s; }
        .btn-glow:hover  { box-shadow: 0 0 35px rgba(0,229,204,0.5); transform: translateY(-1px); }
        .grid-bg {
          background-image: linear-gradient(rgba(0,229,204,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,229,204,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .animate-float    { animation: float    4s ease-in-out infinite; }
        .animate-fade-in  { animation: fade-in  0.8s ease forwards; }
        .animate-slide-up { animation: slide-up 0.7s ease forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

            {/* Ambient BG */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div style={{ position: "absolute", top: "-200px", left: "-200px", width: "700px", height: "700px", borderRadius: "50%", background: "rgba(0,229,204,0.04)", filter: "blur(120px)" }} />
                <div style={{ position: "absolute", bottom: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "rgba(20,184,166,0.04)", filter: "blur(100px)" }} />
                <div className="grid-bg absolute inset-0" />
            </div>

            <Navbar />

            <main>
                {/* ── Hero ── */}
                <section className="relative pt-32 pb-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="animate-fade-in inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-amber-300 mb-6">
                                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                        <path d="M8 2l1.8 3.6L14 6.5l-3 2.9.7 4.1L8 11.5l-3.7 1.9L5 9.4 2 6.5l4.2-.9L8 2z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.3" />
                                    </svg>
                                    FMCSA Registered · 49 CFR Part 395 Compliant
                                </div>

                                <h1
                                    className="animate-slide-up font-extrabold leading-none mb-6"
                                    style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}
                                >
                                    <span className="text-white">ELD Compliance</span>
                                    <br />
                                    <span className="shimmer-text">Built for the Road</span>
                                </h1>

                                <p className="animate-slide-up delay-100 text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                                    Stop worrying about HOS violations. FleetPulse ELD automatically records every minute of drive
                                    time, syncs to our cloud, and transfers logs to DOT officers in under 30 seconds.
                                </p>

                                <div className="animate-slide-up delay-200 flex flex-col sm:flex-row gap-3 mb-10">
                                    <a
                                        href="/start-trial"
                                        className="btn-glow inline-flex items-center justify-center gap-2 font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-7 py-3.5 rounded-xl text-sm"
                                    >
                                        Start Free Trial
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                            <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#demo"
                                        className="inline-flex items-center justify-center gap-2 glass rounded-xl px-7 py-3.5 text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                                    >
                                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M8 7l5 3-5 3V7z" fill="currentColor" />
                                        </svg>
                                        Watch Demo
                                    </a>
                                </div>

                                <div className="animate-slide-up delay-300 flex flex-wrap gap-3">
                                    {TRUST_TAGS.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700/60 rounded-full px-3 py-1"
                                        >
                      <svg viewBox="0 0 12 12" className="w-3 h-3 text-cyan-400">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                                            {tag}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="animate-fade-in delay-300">
                                <DashboardPreview />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section className="px-4 sm:px-6 pb-16">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {STATS.map((s: Stat, i: number) => (
                            <div key={i} className="glass rounded-xl px-6 py-5 text-center card-glow">
                                <div
                                    className="text-2xl sm:text-3xl font-extrabold text-cyan-300"
                                    style={{ fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
                                >
                                    {s.value}
                                </div>
                                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── HOS Timeline ── */}
                <section className="py-16 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                            <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: "rgba(0,229,204,0.06)", borderRadius: "50%", filter: "blur(80px)" }} />
                            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-cyan-300 mb-5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" /> REAL-TIME HOS MONITORING
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                                        Never miss a<br />
                                        <span className="text-cyan-400">HOS deadline</span> again
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed mb-6">
                                        The FleetPulse dashboard shows every driver's real-time HOS status, color-coded by urgency.
                                        Dispatchers see the full picture; drivers get proactive alerts before limits hit.
                                    </p>
                                    <ul className="space-y-2.5">
                                        {HOS_CHECKLIST.map((item: string) => (
                                            <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                                <div
                                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{ background: "rgba(0,229,204,0.15)", border: "1px solid rgba(0,229,204,0.35)" }}
                                                >
                                                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                                                        <path d="M2 6l3 3 5-5" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="animate-float">
                                    <HOSTimeline />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features Grid ── */}
                <section className="py-20 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-teal-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" /> ELD CAPABILITIES
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
                                <span className="text-white">Complete compliance,</span>
                                <br />
                                <span className="text-slate-400">zero paperwork</span>
                            </h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Every feature designed to keep drivers on the road and carriers out of trouble.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {FEATURES.map((f: Feature, i: number) => (
                                <div
                                    key={i}
                                    className="glass rounded-2xl p-6 card-glow group relative overflow-hidden transition-all duration-300"
                                >
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                                        style={{ background: `radial-gradient(circle at top left, ${f.color}08, transparent 60%)` }}
                                    />
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                        style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                                    >
                                        <div className="w-4 h-4 rounded-full" style={{ background: f.color, opacity: 0.8 }} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{f.desc}</p>
                                    <ul className="space-y-1.5">
                                        {f.items.map((item: string) => (
                                            <li key={item} className="flex items-center gap-2 text-xs text-slate-400">
                                                <svg
                                                    viewBox="0 0 12 12"
                                                    className="w-3 h-3 flex-shrink-0"
                                                    style={{ color: f.color }}
                                                >
                                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Inspection Steps ── */}
                <section className="py-16 px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">DOT Inspection in 3 Steps</h2>
                            <p className="text-slate-400">From roadside stop to data transfer — under 30 seconds.</p>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-6 relative">
                            <div
                                className="hidden sm:block absolute h-px"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(0,229,204,0.3), transparent)",
                                    top: "2.5rem",
                                    left: "16.67%",
                                    right: "16.67%",
                                }}
                            />
                            {INSPECTION_STEPS.map((s: InspectionStep, i: number) => (
                                <div key={i} className="glass rounded-2xl p-6 text-center card-glow">
                                    <div
                                        className="text-3xl font-extrabold mb-3"
                                        style={{ color: s.color, fontVariantNumeric: "tabular-nums" } as React.CSSProperties}
                                    >
                                        {s.step}
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-16 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-white mb-3">Compliance Questions, Answered</h2>
                            <p className="text-slate-400 text-sm">Everything you need to know about ELD regulations.</p>
                        </div>
                        <FAQ />
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="py-24 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="glass-strong rounded-3xl p-10 sm:p-16 relative overflow-hidden">
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "radial-gradient(circle at center, rgba(0,229,204,0.06) 0%, transparent 70%)",
                                }}
                            />
                            <div className="relative">
                                <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
                                    <span className="text-white">Stay compliant.</span>
                                    <br />
                                    <span className="shimmer-text">Stay rolling.</span>
                                </h2>
                                <p className="text-slate-400 mb-8 text-lg">
                                    Join carriers who trust FleetPulse ELD to keep drivers safe, logs clean, and inspections stress-free.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="#"
                                        className="btn-glow font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-sm"
                                    >
                                        Start 14-Day Free Trial
                                    </a>
                                    <a
                                        href="#"
                                        className="glass rounded-xl px-10 py-4 text-sm text-slate-300 hover:text-cyan-300 transition-all"
                                    >
                                        Schedule a Demo
                                    </a>
                                </div>
                                <p className="mt-5 text-xs text-slate-500">
                                    No credit card required · FMCSA registered ELD · Cancel anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}