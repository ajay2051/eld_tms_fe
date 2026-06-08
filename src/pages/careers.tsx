import { useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobListing {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    level: string;
    desc: string;
    tags: string[];
    posted: string;
    accent: string;
    deptColor: string;
}

interface Perk {
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
}

interface TeamPhoto {
    label: string;
    sublabel: string;
    accent: string;
    icon: React.ReactNode;
}

interface Stat {
    value: string;
    label: string;
    sub: string;
}

interface Department {
    name: string;
    count: number;
    color: string;
    bg: string;
}

type DeptFilter = "All" | "Engineering" | "Product" | "Operations" | "Sales" | "Compliance" | "Design";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
    { value: "62",    label: "Team Members",    sub: "across 8 time zones"       },
    { value: "100%",  label: "Remote-friendly", sub: "hubs in Austin & Chicago"  },
    { value: "40%",   label: "YoY Growth",      sub: "headcount in 2025"         },
    { value: "4.8★",  label: "Glassdoor",        sub: "employer rating"           },
];

const DEPARTMENTS: Department[] = [
    { name: "Engineering", count: 8,  color: "text-cyan-300",    bg: "bg-cyan-500/10   border-cyan-500/30"   },
    { name: "Product",     count: 3,  color: "text-violet-300",  bg: "bg-violet-500/10 border-violet-500/30" },
    { name: "Operations",  count: 4,  color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/30"},
    { name: "Sales",       count: 5,  color: "text-amber-300",   bg: "bg-amber-500/10  border-amber-500/30"  },
    { name: "Compliance",  count: 2,  color: "text-rose-300",    bg: "bg-rose-500/10   border-rose-500/30"   },
    { name: "Design",      count: 2,  color: "text-blue-300",    bg: "bg-blue-500/10   border-blue-500/30"   },
];

const JOB_LISTINGS: JobListing[] = [
    {
        id: "sre-001",
        title: "Senior Software Engineer — Platform",
        department: "Engineering",
        location: "Remote (US)",
        type: "Full-time",
        level: "Senior",
        desc: "Own and scale the real-time GPS event pipeline that processes 40M+ location pings per day. You'll work on Kafka, Go microservices, and Postgres at meaningful scale alongside a lean, senior-heavy team.",
        tags: ["Go", "Kafka", "Postgres", "Real-time Systems"],
        posted: "3 days ago",
        accent: "border-cyan-500/25",
        deptColor: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",
    },
    {
        id: "fe-002",
        title: "Senior Frontend Engineer — Driver App",
        department: "Engineering",
        location: "Remote (US)",
        type: "Full-time",
        level: "Senior",
        desc: "Build the mobile experience used by 14,000+ drivers every day on the road. React Native, deep device integration (Bluetooth ELD pairing, offline-first sync), and relentless focus on reliability when cell signal is unreliable.",
        tags: ["React Native", "TypeScript", "Bluetooth", "Offline-first"],
        posted: "5 days ago",
        accent: "border-cyan-500/25",
        deptColor: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",
    },
    {
        id: "ml-003",
        title: "ML Engineer — Carrier Intelligence",
        department: "Engineering",
        location: "Remote (US)",
        type: "Full-time",
        level: "Senior",
        desc: "Improve the AI carrier matching models that score 4,100+ carriers across lane history, safety data, and live availability. Work with Python, PyTorch, and a proprietary freight dataset that doesn't exist anywhere else.",
        tags: ["Python", "PyTorch", "ML", "Freight Data"],
        posted: "1 week ago",
        accent: "border-cyan-500/25",
        deptColor: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",
    },
    {
        id: "pm-004",
        title: "Product Manager — Fleet Dashboard",
        department: "Product",
        location: "Austin, TX or Remote",
        type: "Full-time",
        level: "Mid / Senior",
        desc: "Own the fleet manager dashboard product — the command center that fleet ops teams use to track trucks, manage compliance, and dispatch loads. You'll do cab-side research, write detailed specs, and ship weekly.",
        tags: ["B2B SaaS", "Fleet Tech", "Logistics", "Roadmap"],
        posted: "1 week ago",
        accent: "border-violet-500/25",
        deptColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
    },
    {
        id: "ae-005",
        title: "Account Executive — Fleet Sales",
        department: "Sales",
        location: "Remote (US)",
        type: "Full-time",
        level: "Mid / Senior",
        desc: "Close mid-market fleet deals (10–200 trucks) through a consultative sales process. You'll work warm inbound plus your own outbound motion. Average deal size $18K ARR. Strong comp, strong pipeline.",
        tags: ["SaaS Sales", "Freight", "B2B", "Mid-market"],
        posted: "2 weeks ago",
        accent: "border-amber-500/25",
        deptColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
    },
    {
        id: "csm-006",
        title: "Customer Success Manager — Enterprise",
        department: "Operations",
        location: "Remote (US)",
        type: "Full-time",
        level: "Mid",
        desc: "Own relationships with FleetPulse's largest fleet and brokerage accounts. You'll run QBRs, drive expansion, and be the early warning system for churn. Deep knowledge of the trucking industry is a big plus.",
        tags: ["Customer Success", "Enterprise", "Logistics", "SaaS"],
        posted: "2 weeks ago",
        accent: "border-emerald-500/25",
        deptColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
    },
    {
        id: "comp-007",
        title: "Compliance Specialist — ELD & FMCSA",
        department: "Compliance",
        location: "Austin, TX or Remote",
        type: "Full-time",
        level: "Mid",
        desc: "Help carriers and fleet managers navigate FMCSA regulations, HOS rules, and DOT audit prep. You'll work directly with customers and inform the product roadmap with real regulatory expertise.",
        tags: ["FMCSA", "ELD", "HOS", "DOT"],
        posted: "3 weeks ago",
        accent: "border-rose-500/25",
        deptColor: "text-rose-300 border-rose-500/40 bg-rose-500/10",
    },
    {
        id: "ux-008",
        title: "Product Designer — Mobile & Web",
        department: "Design",
        location: "Remote (US)",
        type: "Full-time",
        level: "Mid / Senior",
        desc: "Design the interfaces that 14,000+ truckers, dispatchers, and brokers rely on daily. You'll own end-to-end design for new features across the driver app and fleet dashboard, with a strong emphasis on usability under pressure.",
        tags: ["Figma", "Mobile Design", "B2B UX", "Design Systems"],
        posted: "3 weeks ago",
        accent: "border-blue-500/25",
        deptColor: "text-blue-300 border-blue-500/40 bg-blue-500/10",
    },
    {
        id: "be-009",
        title: "Backend Engineer — Integrations",
        department: "Engineering",
        location: "Remote (US)",
        type: "Full-time",
        level: "Mid",
        desc: "Build and maintain the integrations layer connecting FleetPulse to DAT, Truckstop, McLeod, fuel cards, and 40+ external systems. You'll design resilient sync pipelines, own the webhooks platform, and work closely with enterprise customers.",
        tags: ["Node.js", "REST APIs", "Webhooks", "Integrations"],
        posted: "1 month ago",
        accent: "border-cyan-500/25",
        deptColor: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",
    },
    {
        id: "bdr-010",
        title: "Business Development Rep — Broker Channel",
        department: "Sales",
        location: "Remote (US)",
        type: "Full-time",
        level: "Entry / Mid",
        desc: "Source and qualify freight brokerages for the FleetPulse broker platform. You'll run high-volume outbound, handle inbound from the website and events, and hand off qualified opportunities to senior AEs.",
        tags: ["SDR", "Outbound", "Freight Brokers", "SaaS"],
        posted: "1 month ago",
        accent: "border-amber-500/25",
        deptColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
    },
];

const PERKS: Perk[] = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <rect x="6" y="8" width="28" height="24" rx="3" stroke="#00e5cc" strokeWidth="1.5" opacity="0.4" />
                <path d="M6 14h28" stroke="#00e5cc" strokeWidth="1.5" opacity="0.4" />
                <circle cx="12" cy="11" r="1.5" fill="#00e5cc" opacity="0.5" />
                <circle cx="17" cy="11" r="1.5" fill="#00e5cc" opacity="0.5" />
                <path d="M12 21h16M12 26h10" stroke="#00e5cc" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: "Remote-first culture",
        desc: "Work from anywhere in the US. We have hubs in Austin and Chicago for those who want in-person time, but we've been fully async-capable since day one.",
        accent: "border-cyan-500/20 bg-cyan-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <path d="M20 6 L32 12 V22 C32 29 26 35 20 37 C14 35 8 29 8 22 V12 Z" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4" fill="none" />
                <path d="M15 20l3 3 7-7" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Competitive salary + equity",
        desc: "Market-rate compensation with meaningful equity in a high-growth Series A company. We benchmark against top-quartile SaaS companies and revisit comp annually.",
        accent: "border-amber-500/20 bg-amber-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <circle cx="20" cy="16" r="8" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />
                <path d="M10 34c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <path d="M17 16l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Full health, dental & vision",
        desc: "100% premium coverage for you and 80% for dependents. Medical, dental, vision, and mental health benefits from day one — no waiting period.",
        accent: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <circle cx="20" cy="20" r="15" stroke="#a78bfa" strokeWidth="1.5" opacity="0.3" />
                <path d="M12 20 Q16 12 20 20 Q24 28 28 20" stroke="#a78bfa" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3" fill="#a78bfa" />
            </svg>
        ),
        title: "Unlimited PTO (real, not fake)",
        desc: "We track utilization and flag it if people aren't taking enough time off. Most team members take 20–25 days per year. We close the whole company for the last week of December.",
        accent: "border-violet-500/20 bg-violet-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <rect x="6" y="10" width="28" height="20" rx="3" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
                <path d="M13 20h14M13 25h9" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 6v5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
        ),
        title: "$2,000 home office budget",
        desc: "Every new hire gets a $2,000 stipend to set up their home office. Plus a $100/month internet and phone allowance, and a new MacBook or equivalent on your first day.",
        accent: "border-blue-500/20 bg-blue-500/5",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <path d="M8 32 L8 20 L20 10 L32 20 L32 32 Z" stroke="#f87171" strokeWidth="1.5" fill="none" opacity="0.4" />
                <path d="M15 32v-9h10v9" stroke="#f87171" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="32" cy="12" r="5" fill="#f87171" opacity="0.15" stroke="#f87171" strokeWidth="1.5" />
                <path d="M30 12h4M32 10v4" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: "$1,500 learning budget / year",
        desc: "Use it for conferences, courses, books, or certifications. We pay for relevant professional memberships and send the whole engineering team to one conference a year together.",
        accent: "border-rose-500/20 bg-rose-500/5",
    },
];

const TEAM_PHOTOS: TeamPhoto[] = [
    {
        label: "All-hands in Austin",
        sublabel: "Annual company retreat",
        accent: "from-cyan-500/15 to-teal-500/5 border-cyan-500/20",
        icon: (
            <svg viewBox="0 0 80 50" fill="none" className="w-full h-full opacity-30">
                {[10, 22, 34, 46, 58, 70].map((x, i) => (
                    <g key={i}>
                        <circle cx={x} cy="20" r="7" stroke="#00e5cc" strokeWidth="1" />
                        <path d={`M${x - 9} 40 Q${x} 28 ${x + 9} 40`} stroke="#00e5cc" strokeWidth="1" fill="none" />
                    </g>
                ))}
            </svg>
        ),
    },
    {
        label: "Engineering offsite",
        sublabel: "Chicago, Q1 2026",
        accent: "from-violet-500/15 to-purple-500/5 border-violet-500/20",
        icon: (
            <svg viewBox="0 0 80 50" fill="none" className="w-full h-full opacity-30">
                <rect x="10" y="10" width="20" height="30" rx="2" stroke="#a78bfa" strokeWidth="1" />
                <rect x="35" y="5" width="15" height="35" rx="2" stroke="#a78bfa" strokeWidth="1" />
                <rect x="55" y="15" width="18" height="25" rx="2" stroke="#a78bfa" strokeWidth="1" />
                <path d="M5 42h70" stroke="#a78bfa" strokeWidth="1" />
            </svg>
        ),
    },
    {
        label: "Driver research trips",
        sublabel: "In-cab sessions with real users",
        accent: "from-amber-500/15 to-orange-500/5 border-amber-500/20",
        icon: (
            <svg viewBox="0 0 80 50" fill="none" className="w-full h-full opacity-30">
                <path d="M5 35 L18 20 L35 28 L52 10 L68 22" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="52" cy="10" r="4" fill="#f59e0b" opacity="0.5" />
                <rect x="5" y="38" width="70" height="2" rx="1" fill="#f59e0b" opacity="0.3" />
            </svg>
        ),
    },
];

const PROCESS_STEPS = [
    {
        num: "01",
        title: "Apply online",
        desc: "Submit your application through this page. No cover letter required — we focus on your work and experience.",
        color: "text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/10",
    },
    {
        num: "02",
        title: "Recruiter screen",
        desc: "A 30-minute call with our recruiting team to learn about your background and give you a real picture of the role.",
        color: "text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/10",
    },
    {
        num: "03",
        title: "Technical / skills interview",
        desc: "One focused interview relevant to the role. We don't do multi-day take-homes or whiteboard marathons.",
        color: "text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
    },
    {
        num: "04",
        title: "Team interview & offer",
        desc: "A final conversation with the team you'd work with. Most candidates hear back within 5 business days.",
        color: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function JobCard({ job, onApply }: { job: JobListing; onApply: (job: JobListing) => void }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`glass rounded-2xl border transition-all duration-200 overflow-hidden ${expanded ? job.accent : "border-slate-700/30 hover:border-slate-600/40"} card-glow`}>
            <button
                className="w-full text-left px-6 py-5"
                onClick={() => setExpanded(p => !p)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${job.deptColor}`}>
                                {job.department.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-500">{job.posted}</span>
                        </div>
                        <h3 className={`font-display text-base font-600 leading-snug transition-colors ${expanded ? "text-cyan-300" : "text-white"}`}>
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1" />
                                    <path d="M1 11c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                                {job.location}
                            </span>
                            <span className="text-xs text-slate-600">·</span>
                            <span className="text-xs text-slate-500">{job.type}</span>
                            <span className="text-xs text-slate-600">·</span>
                            <span className="text-xs text-slate-500">{job.level}</span>
                        </div>
                    </div>
                    <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 mt-1 ${expanded ? "rotate-180 text-cyan-400" : ""}`}
                    >
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </button>

            {expanded && (
                <div className="px-6 pb-6 border-t border-slate-700/30">
                    <p className="text-sm text-slate-400 leading-relaxed mt-4 mb-4">{job.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {job.tags.map(tag => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-lg glass border border-slate-700/40 text-slate-400">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onApply(job); }}
                        className="btn-glow text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-6 py-2.5 rounded-xl"
                    >
                        Apply for this role
                    </button>
                </div>
            )}
        </div>
    );
}

function ApplyModal({ job, onClose }: { job: JobListing; onClose: () => void }) {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", linkedin: "", why: "" });

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative glass-strong rounded-3xl p-10 border border-emerald-500/30 bg-emerald-500/5 max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-400">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3 className="font-display text-2xl font-700 text-white mb-2">Application sent!</h3>
                    <p className="text-sm text-slate-400 mb-2">
                        Thanks for applying for <span className="text-cyan-300">{job.title}</span>.
                    </p>
                    <p className="text-sm text-slate-500 mb-6">
                        We'll be in touch at <span className="text-slate-300">{form.email}</span> within 5 business days.
                    </p>
                    <button onClick={onClose} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass-strong rounded-3xl p-7 border border-slate-700/50 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${job.deptColor}`}>
                                {job.department.toUpperCase()}
                            </span>
                        </div>
                        <h3 className="font-display text-xl font-700 text-white leading-snug">{job.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{job.location} · {job.type}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                        <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                                placeholder="you@email.com"
                                className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">LinkedIn or Portfolio URL</label>
                        <input
                            type="url"
                            value={form.linkedin}
                            onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                            placeholder="https://linkedin.com/in/yourname"
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Why this role? (optional)</label>
                        <textarea
                            rows={4}
                            value={form.why}
                            onChange={e => setForm(f => ({ ...f, why: e.target.value }))}
                            placeholder="What excites you about this role and FleetPulse? No cover letter needed — just a few sentences."
                            className="w-full px-4 py-2.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors resize-none"
                        />
                    </div>

                    <button
                        onClick={() => { if (form.name && form.email) setSubmitted(true); }}
                        className="w-full btn-glow py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] text-sm font-bold"
                    >
                        Submit Application
                    </button>
                    <p className="text-xs text-slate-600 text-center">No cover letter required · We respond within 5 business days</p>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CareersPage() {
    const [deptFilter, setDeptFilter]   = useState<DeptFilter>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [applyJob, setApplyJob]       = useState<JobListing | null>(null);

    const allDepts: DeptFilter[] = ["All", "Engineering", "Product", "Operations", "Sales", "Compliance", "Design"];

    const filtered = JOB_LISTINGS.filter(j => {
        const matchDept   = deptFilter === "All" || j.department === deptFilter;
        const matchSearch = !searchQuery.trim() ||
            j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchDept && matchSearch;
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

            {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

            <main className="relative pt-24">

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 pt-16 pb-20 border-b border-slate-800/60">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {JOB_LISTINGS.length} open roles · Remote-first
                        </div>
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-none mb-6">
                            <span className="text-white">Build the future</span>
                            <br />
                            <span className="shimmer-text">of freight.</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                            FleetPulse is a 62-person team on a mission to make compliance invisible and freight smarter. We're remote-first, move fast, and care deeply about the drivers and operators who rely on our product every day.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {STATS.map((s, i) => (
                                <div key={i} className="glass rounded-xl px-5 py-4 text-center card-glow">
                                    <div className="font-display text-2xl font-700 text-cyan-300">{s.value}</div>
                                    <div className="text-sm text-white font-medium mt-0.5">{s.label}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Culture photos ───────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-teal-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                LIFE AT FLEETPULSE
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
                                A team that ships together
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Remote-first doesn't mean isolated. We invest in real connection — offsites, driver research trips, and a culture that rewards craftsmanship.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-5">
                            {TEAM_PHOTOS.map((photo, i) => (
                                <div key={i} className={`glass rounded-2xl overflow-hidden border bg-gradient-to-br ${photo.accent} card-glow`}>
                                    <div className="h-36 flex items-center justify-center px-6 py-4">
                                        {photo.icon}
                                    </div>
                                    <div className="px-5 pb-5">
                                        <div className="text-sm font-semibold text-white">{photo.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{photo.sublabel}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Perks ────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-violet-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                BENEFITS & PERKS
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
                                We take care of our team
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                Competitive pay, great benefits, and a culture where doing your best work is genuinely possible.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {PERKS.map((perk, i) => (
                                <div key={i} className={`glass rounded-2xl p-6 border card-glow group relative overflow-hidden ${perk.accent}`}>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />
                                    <div className="p-2.5 glass rounded-xl inline-block mb-4">{perk.icon}</div>
                                    <h3 className="font-display text-base font-600 text-white mb-2">{perk.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{perk.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Open Roles ───────────────────────────────────────────── */}
                <section id="open-roles" className="px-4 sm:px-6 py-14 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-amber-300 mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                OPEN ROLES
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
                                {JOB_LISTINGS.length} positions open now
                            </h2>
                            <p className="text-slate-400 max-w-lg mx-auto">
                                We hire for craft, curiosity, and care. No résumé fluff required.
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Sidebar — dept filters */}
                            <aside className="lg:w-56 flex-shrink-0">
                                <div className="glass rounded-xl p-4 border border-slate-700/30 sticky top-24">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
                                        Department
                                    </div>
                                    <div className="space-y-1">
                                        {allDepts.map(dept => {
                                            const count = dept === "All"
                                                ? JOB_LISTINGS.length
                                                : JOB_LISTINGS.filter(j => j.department === dept).length;
                                            return (
                                                <button
                                                    key={dept}
                                                    onClick={() => setDeptFilter(dept)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                                        deptFilter === dept
                                                            ? "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
                                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                                                    }`}
                                                >
                                                    <span>{dept}</span>
                                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                                        deptFilter === dept ? "bg-cyan-500/15 text-cyan-400" : "text-slate-600"
                                                    }`}>
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Dept highlight chips */}
                                    <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-2">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Most hiring</div>
                                        {DEPARTMENTS.sort((a, b) => b.count - a.count).slice(0, 3).map(d => (
                                            <div key={d.name} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border ${d.bg}`}>
                                                <span className={d.color}>{d.name}</span>
                                                <span className={`font-bold ${d.color}`}>{d.count} roles</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            {/* Job listings */}
                            <div className="flex-1 min-w-0">
                                {/* Search */}
                                <div className="relative mb-6">
                                    <svg viewBox="0 0 20 20" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none">
                                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M15 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search roles, skills, or keywords…"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Result count */}
                                <div className="text-xs text-slate-500 mb-4">
                                    Showing {filtered.length} of {JOB_LISTINGS.length} roles
                                    {deptFilter !== "All" && <> in <span className="text-cyan-400">{deptFilter}</span></>}
                                </div>

                                {filtered.length > 0 ? (
                                    <div className="space-y-3">
                                        {filtered.map(job => (
                                            <JobCard key={job.id} job={job} onApply={setApplyJob} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass rounded-2xl p-12 text-center border border-slate-700/30">
                                        <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mx-auto mb-4 text-slate-600">
                                            <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M32 32l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M22 16v6M22 26v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <div className="text-slate-400 font-medium mb-1">No roles match your search</div>
                                        <div className="text-xs text-slate-600 mb-4">Try a different keyword or clear the department filter.</div>
                                        <button
                                            onClick={() => { setSearchQuery(""); setDeptFilter("All"); }}
                                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                )}

                                {/* General application */}
                                <div className="mt-6 glass rounded-xl p-5 border border-slate-700/30 flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-white mb-0.5">Don't see the right role?</div>
                                        <div className="text-xs text-slate-400">Send us a general application — we keep them on file when new roles open.</div>
                                    </div>
                                    <a
                                        href="mailto:careers@fleetpulse.com"
                                        className="glass text-sm text-slate-300 hover:text-cyan-300 border border-slate-600/50 hover:border-cyan-500/40 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap flex-shrink-0"
                                    >
                                        Send Resume
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Hiring Process ───────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-14 border-t border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/6 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/6 rounded-full blur-[60px]" />

                            <div className="relative text-center mb-12">
                                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300 mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    OUR PROCESS
                                </div>
                                <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-3">
                                    Straightforward hiring.<br />
                                    <span className="text-cyan-400">Respectful of your time.</span>
                                </h2>
                                <p className="text-slate-400 max-w-lg mx-auto">
                                    No 8-round gauntlets. No trick questions. We want to understand how you work — and show you how we work.
                                </p>
                            </div>

                            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20" />
                                {PROCESS_STEPS.map((step, i) => (
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

                {/* ── CTA ──────────────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-24 border-t border-slate-800/60">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-4xl sm:text-5xl font-700 mb-5">
                            <span className="text-white">Ready to do the best</span>
                            <br />
                            <span className="shimmer-text">work of your career?</span>
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg">
                            Join a team that ships real software for real truckers, brokers, and fleet managers who depend on it every day.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#open-roles"
                                className="btn-glow font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-10 py-4 rounded-xl text-base"
                            >
                                See Open Roles
                            </a>
                            <a
                                href="/about"
                                className="glass rounded-xl px-10 py-4 text-base text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                            >
                                Learn About Us
                            </a>
                        </div>
                        <p className="mt-5 text-xs text-slate-500">
                            Remote-first · Austin & Chicago · Responding within 5 business days
                        </p>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}