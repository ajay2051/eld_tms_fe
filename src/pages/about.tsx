import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
    year: string;
    title: string;
    desc: string;
    accent: string;
    dotColor: string;
}

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    initials: string;
    accent: string;
    linkedin?: string;
}

interface Value {
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
}

interface Stat {
    value: string;
    label: string;
    sub: string;
}

interface Investor {
    name: string;
    abbr: string;
    color: string;
    bg: string;
}

interface PressItem {
    outlet: string;
    abbr: string;
    headline: string;
    date: string;
    color: string;
    bg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
    { value: "2019",    label: "Founded",             sub: "Austin, Texas"               },
    { value: "14,800+", label: "Active Users",         sub: "carriers, brokers & managers" },
    { value: "3.2M+",   label: "Miles Logged / Month", sub: "across the FleetPulse network" },
    { value: "62",      label: "Team Members",         sub: "across 8 time zones"          },
];

const MILESTONES: Milestone[] = [
    {
        year: "2019",
        title: "FleetPulse founded in Austin",
        desc: "Co-founders Jake Mercer and Anita Rao built the first ELD prototype after Jake spent a year driving OTR and couldn't find a compliance tool that didn't feel like it was designed by someone who'd never been in a cab.",
        accent: "border-cyan-500/30",
        dotColor: "bg-cyan-400",
    },
    {
        year: "2020",
        title: "First 100 carriers onboarded",
        desc: "Launched the v1.0 driver app and fleet dashboard. Reached 100 paying carriers within 4 months of launch, entirely through word-of-mouth in trucking Facebook groups.",
        accent: "border-violet-500/30",
        dotColor: "bg-violet-400",
    },
    {
        year: "2021",
        title: "$4.2M seed round closed",
        desc: "Raised a seed round led by Ridgeline Ventures to expand the engineering team and build out the broker-facing load board integrations and AI dispatch features.",
        accent: "border-amber-500/30",
        dotColor: "bg-amber-400",
    },
    {
        year: "2022",
        title: "Broker platform launched",
        desc: "Launched AI carrier matching and the shipper visibility portal. Onboarded 400 brokerages in the first quarter, making FleetPulse the fastest-growing broker tool in the space.",
        accent: "border-emerald-500/30",
        dotColor: "bg-emerald-400",
    },
    {
        year: "2023",
        title: "$18M Series A",
        desc: "Closed a Series A led by Apex Road Capital with participation from existing investors. Expanded to a 40-person team and launched the predictive maintenance and driver scorecard features.",
        accent: "border-rose-500/30",
        dotColor: "bg-rose-400",
    },
    {
        year: "2024",
        title: "10,000 active trucks milestone",
        desc: "Crossed 10,000 active ELD-connected trucks on the platform. Named to FreightTech 25 by FreightWaves for the second consecutive year.",
        accent: "border-blue-500/30",
        dotColor: "bg-blue-400",
    },
    {
        year: "2025",
        title: "IFTA automation & enterprise tier",
        desc: "Launched one-click IFTA quarterly reporting and the Enterprise plan for large fleets. Partnered with McLeod Software and Mercury Gate for bidirectional TMS integration.",
        accent: "border-teal-500/30",
        dotColor: "bg-teal-400",
    },
    {
        year: "2026",
        title: "14,800+ users and growing",
        desc: "Serving owner-operators, mid-size fleets, and high-volume brokerages across all 48 contiguous states. Building toward real-time freight intelligence and autonomous dispatch.",
        accent: "border-cyan-500/30",
        dotColor: "bg-cyan-400",
    },
];

const TEAM_MEMBERS: TeamMember[] = [
    {
        name: "Jake Mercer",
        role: "Co-Founder & CEO",
        bio: "Former OTR driver turned software founder. Spent 14 months behind the wheel before building the compliance tool he always wished existed. Led FleetPulse from prototype to Series A.",
        initials: "JM",
        accent: "from-cyan-500/30 to-teal-600/30 border-cyan-500/30 text-cyan-300",
    },
    {
        name: "Anita Rao",
        role: "Co-Founder & CTO",
        bio: "Previously an engineering lead at Uber Freight. Built FleetPulse's core ELD firmware and real-time data pipeline. Holds two patents in vehicle telematics and HOS automation.",
        initials: "AR",
        accent: "from-violet-500/30 to-purple-600/30 border-violet-500/30 text-violet-300",
    },
    {
        name: "Derek Osei",
        role: "VP of Engineering",
        bio: "10 years building real-time data systems at scale. Led the architecture of FleetPulse's GPS event pipeline, which processes over 40 million location pings per day with sub-second latency.",
        initials: "DO",
        accent: "from-emerald-500/30 to-teal-600/30 border-emerald-500/30 text-emerald-300",
    },
    {
        name: "Sarah Calloway",
        role: "VP of Compliance",
        bio: "Former FMCSA policy analyst with 12 years in federal trucking regulation. Guides FleetPulse's ELD certification, DataQ dispute tooling, and relationships with DOT enforcement offices.",
        initials: "SC",
        accent: "from-amber-500/30 to-orange-600/30 border-amber-500/30 text-amber-300",
    },
    {
        name: "Marcus Webb",
        role: "VP of Product",
        bio: "Led product at two freight-tech startups before joining FleetPulse. Obsessed with driver experience — every major app release goes through a week of in-cab testing with real drivers.",
        initials: "MW",
        accent: "from-blue-500/30 to-cyan-600/30 border-blue-500/30 text-blue-300",
    },
    {
        name: "Priya Nair",
        role: "VP of Growth",
        bio: "Former management consultant turned freight-tech operator. Scaled FleetPulse's broker channel from 0 to 2,200+ brokerages in 18 months through partnerships and product-led growth.",
        initials: "PN",
        accent: "from-rose-500/30 to-pink-600/30 border-rose-500/30 text-rose-300",
    },
];

const VALUES: Value[] = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="20" r="17" stroke="#00e5cc" strokeWidth="1.5" opacity="0.3" />
                <path d="M12 20 Q16 12 20 20 Q24 28 28 20" stroke="#00e5cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3" fill="#00e5cc" />
            </svg>
        ),
        title: "Built by people who've driven the route",
        desc: "Our founders and compliance team have spent real time in cabs, at weigh stations, and in front of DOT officers. We build tools for the realities of the road, not hypothetical user flows.",
        accent: "border-cyan-500/20 bg-cyan-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="6" y="10" width="28" height="22" rx="3" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" />
                <path d="M12 20h16M12 25h10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="12" r="5" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M28 12l1.5 1.5L32 10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Compliance without complexity",
        desc: "Federal regulations are complicated enough. Our job is to make them invisible. If a driver has to read a manual to stay compliant, we've failed. Every feature ships only when it's genuinely simple.",
        accent: "border-amber-500/20 bg-amber-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <path d="M6 30 L13 18 L20 24 L27 12 L34 20" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="27" cy="12" r="3" fill="#a78bfa" />
                <line x1="6" y1="34" x2="34" y2="34" stroke="#a78bfa" strokeWidth="1.5" opacity="0.35" />
            </svg>
        ),
        title: "Data that works for you, not against you",
        desc: "FleetPulse collects vehicle data to make your operation better — not to sell to insurers or third parties without your consent. You own your data. We're just the platform that helps you use it.",
        accent: "border-violet-500/20 bg-violet-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="14" cy="14" r="6" stroke="#34d399" strokeWidth="1.5" opacity="0.5" />
                <circle cx="26" cy="26" r="6" stroke="#34d399" strokeWidth="1.5" opacity="0.5" />
                <path d="M18 14 Q26 14 26 20" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="14" cy="14" r="2.5" fill="#34d399" />
                <circle cx="26" cy="26" r="2.5" fill="#34d399" />
            </svg>
        ),
        title: "The whole freight ecosystem wins together",
        desc: "Carriers, brokers, and shippers all move the same freight. We build tools that create value across the chain — not zero-sum features that benefit one side at another's expense.",
        accent: "border-emerald-500/20 bg-emerald-500/5",
    },
];

const INVESTORS: Investor[] = [
    { name: "Ridgeline Ventures", abbr: "RV",  color: "text-cyan-300",   bg: "bg-cyan-500/10   border-cyan-500/20"   },
    { name: "Apex Road Capital",  abbr: "ARC", color: "text-violet-300", bg: "bg-violet-500/10 border-violet-500/20" },
    { name: "Frontier Fund",      abbr: "FF",  color: "text-amber-300",  bg: "bg-amber-500/10  border-amber-500/20"  },
    { name: "Logistics VC",       abbr: "LVC", color: "text-emerald-300",bg: "bg-emerald-500/10 border-emerald-500/20"},
];

const PRESS_ITEMS: PressItem[] = [
    {
        outlet: "FreightWaves",
        abbr: "FW",
        headline: "FleetPulse named to FreightTech 25 for second consecutive year",
        date: "March 2026",
        color: "text-orange-300",
        bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
        outlet: "TechCrunch",
        abbr: "TC",
        headline: "How a former trucker built a $40M freight compliance startup",
        date: "November 2025",
        color: "text-green-300",
        bg: "bg-green-500/10 border-green-500/20",
    },
    {
        outlet: "Transport Topics",
        abbr: "TT",
        headline: "AI carrier matching cuts broker coverage time by 68%, study finds",
        date: "August 2025",
        color: "text-blue-300",
        bg: "bg-blue-500/10 border-blue-500/20",
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MissionWidget() {
    return (
        <div
            className="glass rounded-2xl p-6 w-full border border-cyan-500/20 animate-float"
            style={{ boxShadow: "0 0 50px rgba(0,229,204,0.07), 0 24px 60px rgba(0,0,0,0.5)" }}
        >
            <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">By the numbers</span>
            </div>
            {[
                { label: "Active ELD Devices",  value: "14,800+", bar: 82,  color: "from-cyan-500 to-teal-400",    text: "text-cyan-300"    },
                { label: "Monthly Miles Logged", value: "3.2M",   bar: 68,  color: "from-violet-500 to-purple-400",text: "text-violet-300"  },
                { label: "HOS Compliance Rate",  value: "98.2%",  bar: 98,  color: "from-emerald-500 to-teal-400", text: "text-emerald-300" },
                { label: "Carrier Network",      value: "4,100+", bar: 55,  color: "from-amber-500 to-orange-400", text: "text-amber-300"   },
            ].map(row => (
                <div key={row.label} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">{row.label}</span>
                        <span className={`font-semibold font-display ${row.text}`}>{row.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${row.color}`} style={{ width: `${row.bar}%` }} />
                    </div>
                </div>
            ))}
            <div className="mt-5 p-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">Growing 40% year-over-year</span>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
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
                <section className="px-4 sm:px-6 pt-16 pb-20">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                Our Story
                            </div>
                            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none mb-6">
                                <span className="text-white">Built from</span>
                                <br />
                                <span className="shimmer-text">the cab up.</span>
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-lg">
                                FleetPulse was founded in 2019 by a trucker who spent 14 months behind the wheel and couldn't find a compliance tool that didn't feel like punishment. So he built one.
                            </p>
                            <p className="text-slate-500 text-base leading-relaxed max-w-lg mb-10">
                                Today we serve 14,800+ carriers, owner-operators, brokers, and fleet managers across the United States — helping them stay compliant, move smarter, and make more money on every mile.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="/careers"
                                    className="btn-glow font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-7 py-3.5 rounded-xl text-sm"
                                >
                                    We're Hiring
                                </a>
                                <a
                                    href="/contact"
                                    className="glass rounded-xl px-7 py-3.5 text-sm text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                                >
                                    Get in Touch
                                </a>
                            </div>
                        </div>

                        <div>
                            <MissionWidget />
                        </div>
                    </div>
                </section>

                {/* ── Stats strip ──────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-4 border-y border-slate-800/60">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {STATS.map((s, i) => (
                            <div key={i} className="glass rounded-xl px-6 py-5 text-center card-glow">
                                <div className="font-display text-2xl sm:text-3xl font-700 text-cyan-300">{s.value}</div>
                                <div className="text-sm text-white font-medium mt-1">{s.label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Mission ──────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/6 rounded-full blur-[90px]" />
                            <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-500/6 rounded-full blur-[70px]" />
                            <div className="relative max-w-3xl">
                                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                    OUR MISSION
                                </div>
                                <blockquote className="font-display text-3xl sm:text-4xl font-700 text-white leading-snug mb-6">
                                    "Make compliance invisible so drivers can focus on driving — and everyone in freight can make more money on every load."
                                </blockquote>
                                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                    The trucking industry moves 70% of all freight in America. The people who do that work deserve tools as capable as they are — not legacy software held together with faxes and paper logs.
                                </p>
                                <p className="text-slate-500 leading-relaxed">
                                    Every feature we build starts with one question: does this make the road easier or harder for the driver? If a driver has to think about it, we haven't finished building it yet.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Values ───────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                HOW WE WORK
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                What we believe
                            </h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Four principles that shape every product decision, partnership, and hire at FleetPulse.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                            {VALUES.map((v, i) => (
                                <div key={i} className={`glass rounded-2xl p-7 border card-glow group relative overflow-hidden ${v.accent}`}>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />
                                    <div className="p-2.5 glass rounded-xl inline-block mb-4">{v.icon}</div>
                                    <h3 className="font-display text-lg font-700 text-white mb-3">{v.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Timeline ─────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                COMPANY HISTORY
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                From prototype to platform
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Seven years of building, shipping, and learning from the drivers and fleets who rely on FleetPulse every day.
                            </p>
                        </div>

                        <div className="relative max-w-3xl mx-auto">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-violet-500/20 to-transparent" />

                            <div className="space-y-8">
                                {MILESTONES.map((m, i) => (
                                    <div key={i} className="relative flex gap-8">
                                        {/* Dot */}
                                        <div className="flex-shrink-0 w-12 flex justify-center">
                                            <div className={`w-3 h-3 rounded-full ${m.dotColor} mt-1.5 z-10 ring-4 ring-[#040f16]`} />
                                        </div>
                                        {/* Content */}
                                        <div className={`glass rounded-xl p-5 border flex-1 card-glow ${m.accent}`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-display text-2xl font-800 text-slate-600">{m.year}</span>
                                                <div className="flex-1 h-px bg-slate-800/60" />
                                            </div>
                                            <h3 className="font-display text-base font-600 text-white mb-2">{m.title}</h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Team ─────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                LEADERSHIP
                            </div>
                            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">
                                The team behind the platform
                            </h2>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Truckers, engineers, compliance experts, and operators — building the freight tools they always wished they had.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {TEAM_MEMBERS.map((member, i) => (
                                <div key={i} className="glass rounded-2xl p-6 border border-slate-700/30 card-glow group hover:border-cyan-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.accent} border flex items-center justify-center font-display text-lg font-700 flex-shrink-0`}>
                                            {member.initials}
                                        </div>
                                        <div>
                                            <div className="font-display text-base font-700 text-white">{member.name}</div>
                                            <div className="text-xs text-slate-400">{member.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">{member.bio}</p>
                                </div>
                            ))}
                        </div>

                        {/* Hiring CTA */}
                        <div className="mt-8 glass rounded-2xl p-7 border border-cyan-500/15 relative overflow-hidden text-center">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px]" />
                            <div className="relative">
                                <h3 className="font-display text-xl font-700 text-white mb-2">We're a team of 62 — and growing</h3>
                                <p className="text-sm text-slate-400 mb-5 max-w-lg mx-auto">
                                    We're hiring engineers, compliance specialists, account managers, and more. Remote-first, with hubs in Austin and Chicago.
                                </p>
                                <a
                                    href="/careers"
                                    className="btn-glow inline-block font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-8 py-3 rounded-xl text-sm"
                                >
                                    View Open Roles
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Investors & Press ────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">

                        {/* Investors */}
                        <div>
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-blue-300 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                BACKED BY
                            </div>
                            <h2 className="font-display text-3xl font-700 text-white mb-3">
                                Investors who understand freight
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                We've raised $22.2M from investors who've spent careers in logistics, trucking, and freight technology — not just capital markets.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {INVESTORS.map((inv, i) => (
                                    <div key={i} className={`glass rounded-xl px-5 py-4 border flex items-center gap-3 card-glow ${inv.bg}`}>
                                        <div className={`w-10 h-10 rounded-xl ${inv.bg} border flex items-center justify-center font-display text-sm font-700 ${inv.color} flex-shrink-0`}>
                                            {inv.abbr}
                                        </div>
                                        <span className="text-sm font-medium text-slate-200">{inv.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="glass rounded-xl p-5 border border-slate-700/30">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="text-2xl font-display font-700 text-white">$22.2M</div>
                                        <div className="text-xs text-slate-400">Total raised (Seed + Series A)</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-700/60" />
                                    <div>
                                        <div className="text-2xl font-display font-700 text-cyan-300">2019</div>
                                        <div className="text-xs text-slate-400">Founded in Austin, TX</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-700/60" />
                                    <div>
                                        <div className="text-2xl font-display font-700 text-violet-300">62</div>
                                        <div className="text-xs text-slate-400">Team members</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Press */}
                        <div>
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-rose-300 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                IN THE NEWS
                            </div>
                            <h2 className="font-display text-3xl font-700 text-white mb-3">
                                What people are saying
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                Coverage from freight industry publications and mainstream tech press.
                            </p>
                            <div className="space-y-4">
                                {PRESS_ITEMS.map((item, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="glass rounded-xl p-5 border border-slate-700/30 card-glow group hover:border-cyan-500/25 transition-all duration-200 flex items-start gap-4 block"
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${item.bg} border flex items-center justify-center font-display text-xs font-700 ${item.color} flex-shrink-0`}>
                                            {item.abbr}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-slate-500 mb-1">{item.outlet} · {item.date}</div>
                                            <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors leading-snug">
                                                {item.headline}
                                            </div>
                                        </div>
                                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1">
                                            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA ──────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-24 border-t border-slate-800/60">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Come build with us.</span>
                            <br />
                            <span className="shimmer-text">The road needs better tools.</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Whether you're a carrier, broker, fleet manager, or engineer — there's a place for you in the FleetPulse story.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/start-trial"
                                className="btn-glow font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-base"
                            >
                                Start Free Trial
                            </a>
                            <a
                                href="/careers"
                                className="glass rounded-xl px-10 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                            >
                                View Open Roles
                            </a>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">
                            Austin & Chicago · Remote-first · 62 people and growing
                        </p>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}