import { useState } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
    id: string;
    slug: string;
    category: string;
    categoryColor: string;
    title: string;
    excerpt: string;
    author: Author;
    date: string;
    readTime: string;
    featured?: boolean;
    tags: string[];
}

interface Author {
    name: string;
    role: string;
    initials: string;
    accent: string;
}

type CategoryFilter = "All" | "Compliance" | "Technology" | "Industry" | "Product" | "Operations";

// ─── Data ─────────────────────────────────────────────────────────────────────

const AUTHORS: Record<string, Author> = {
    sarah: {
        name: "Sarah Calloway",
        role: "Compliance Editor",
        initials: "SC",
        accent: "from-amber-500/30 to-orange-600/30 border-amber-500/30 text-amber-300",
    },
    marcus: {
        name: "Marcus Webb",
        role: "Product Lead",
        initials: "MW",
        accent: "from-cyan-500/30 to-teal-600/30 border-cyan-500/30 text-cyan-300",
    },
    priya: {
        name: "Priya Nair",
        role: "Industry Analyst",
        initials: "PN",
        accent: "from-violet-500/30 to-purple-600/30 border-violet-500/30 text-violet-300",
    },
    derek: {
        name: "Derek Osei",
        role: "Engineering",
        initials: "DO",
        accent: "from-emerald-500/30 to-teal-600/30 border-emerald-500/30 text-emerald-300",
    },
    lisa: {
        name: "Lisa Huang",
        role: "Operations Writer",
        initials: "LH",
        accent: "from-rose-500/30 to-pink-600/30 border-rose-500/30 text-rose-300",
    },
};

const BLOG_POSTS: BlogPost[] = [
    {
        id: "1",
        slug: "eld-mandate-2026-what-carriers-need-to-know",
        category: "Compliance",
        categoryColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
        title: "ELD Mandate 2026: What Every Carrier Needs to Know Before July",
        excerpt: "FMCSA's updated ELD mandate takes effect this July with new data transfer requirements and expanded device certification standards. Here's what changes, what doesn't, and how to make sure your fleet stays compliant before the deadline.",
        author: AUTHORS.sarah,
        date: "June 3, 2026",
        readTime: "8 min read",
        featured: true,
        tags: ["ELD", "FMCSA", "Compliance", "HOS"],
    },
    {
        id: "2",
        slug: "ai-carrier-matching-how-it-works",
        category: "Technology",
        categoryColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
        title: "How AI Carrier Matching Actually Works — And Why It Covers Loads 68% Faster",
        excerpt: "Most \"AI matching\" in freight is just keyword search dressed up in a press release. FleetPulse's matching engine is different — it scores carriers on lane history, real-time location, safety rating, and capacity signals simultaneously. We pulled back the curtain on how it works.",
        author: AUTHORS.marcus,
        date: "May 28, 2026",
        readTime: "6 min read",
        featured: true,
        tags: ["AI", "Freight Brokerage", "Technology", "Carrier Matching"],
    },
    {
        id: "3",
        slug: "owner-operator-ifta-guide-2026",
        category: "Operations",
        categoryColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
        title: "The Owner-Operator's Complete IFTA Filing Guide for 2026",
        excerpt: "IFTA filing trips up more independent truckers than any other regulatory requirement. We break down exactly what miles count, how to handle fuel purchases in non-IFTA states, and how FleetPulse generates your quarterly return in under 10 minutes.",
        author: AUTHORS.lisa,
        date: "May 21, 2026",
        readTime: "10 min read",
        tags: ["IFTA", "Owner Operators", "Tax", "Reporting"],
    },
    {
        id: "4",
        slug: "fleet-safety-score-guide",
        category: "Operations",
        categoryColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
        title: "What Goes Into a Fleet Safety Score — And How to Improve Yours in 30 Days",
        excerpt: "Your FMCSA safety rating directly affects which shippers will work with you and what insurance premiums you pay. We break down the five CSA categories, show you which ones move the needle fastest, and walk through the driver coaching workflows that top fleets use.",
        author: AUTHORS.sarah,
        date: "May 14, 2026",
        readTime: "7 min read",
        tags: ["Safety", "CSA", "Driver Coaching", "Fleet Management"],
    },
    {
        id: "5",
        slug: "freight-market-q2-2026",
        category: "Industry",
        categoryColor: "text-blue-300 border-blue-500/40 bg-blue-500/10",
        title: "Q2 2026 Freight Market Outlook: Spot Rates, Capacity, and What Brokers Should Expect",
        excerpt: "Spot rates softened in April before recovering through May on the back of tighter reefer capacity in the Southeast corridor. We analyzed 2.4 million loads across our network to give brokers a lane-by-lane picture of where the market is heading into summer.",
        author: AUTHORS.priya,
        date: "May 7, 2026",
        readTime: "9 min read",
        tags: ["Market", "Spot Rates", "Freight Brokers", "Industry"],
    },
    {
        id: "6",
        slug: "fleetpulse-v38-release",
        category: "Product",
        categoryColor: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10",
        title: "FleetPulse v3.8: Custom Shipper Subdomains, Improved Carrier Scoring, and New Webhook Events",
        excerpt: "Our biggest release of the year is live. Brokers can now give shippers a fully branded tracking experience at their own subdomain. Carrier match scores now factor in 24-month lane history. And three new webhook events make it easier than ever to build on top of FleetPulse.",
        author: AUTHORS.marcus,
        date: "April 30, 2026",
        readTime: "4 min read",
        tags: ["Product Update", "Features", "API", "Brokers"],
    },
    {
        id: "7",
        slug: "predictive-maintenance-roi",
        category: "Operations",
        categoryColor: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
        title: "Predictive Maintenance vs. Reactive Repairs: The Real Cost Difference for Fleets",
        excerpt: "The average unplanned breakdown costs a fleet $1,400 in repairs plus $1,100 in lost revenue per day off the road. We ran the numbers across 800 FleetPulse fleets to show exactly what predictive maintenance is worth — and when it pays back.",
        author: AUTHORS.lisa,
        date: "April 22, 2026",
        readTime: "8 min read",
        tags: ["Maintenance", "Fleet Operations", "Cost Analysis"],
    },
    {
        id: "8",
        slug: "hos-violations-most-common-2026",
        category: "Compliance",
        categoryColor: "text-amber-300 border-amber-500/40 bg-amber-500/10",
        title: "The 7 Most Common HOS Violations in 2026 — And How to Avoid Every One",
        excerpt: "Form and manner violations are down since ELD adoption, but 11-hour driving rule violations are up 12% year-over-year. We looked at 180,000 DOT inspections to find exactly where drivers are slipping up and what fleet managers can do to stop it.",
        author: AUTHORS.sarah,
        date: "April 15, 2026",
        readTime: "7 min read",
        tags: ["HOS", "Violations", "Compliance", "ELD"],
    },
    {
        id: "9",
        slug: "webhook-integration-guide",
        category: "Technology",
        categoryColor: "text-violet-300 border-violet-500/40 bg-violet-500/10",
        title: "Building on FleetPulse Webhooks: A Developer's Guide to Real-Time Event Streaming",
        excerpt: "FleetPulse fires over 50 million webhook events per month. This guide walks through subscribing to events, handling retries, verifying signatures, and building a robust integration that won't drop data when your endpoint goes down.",
        author: AUTHORS.derek,
        date: "April 8, 2026",
        readTime: "12 min read",
        tags: ["API", "Webhooks", "Developers", "Integration"],
    },
    {
        id: "10",
        slug: "owner-operator-load-board-strategy",
        category: "Industry",
        categoryColor: "text-blue-300 border-blue-500/40 bg-blue-500/10",
        title: "How Owner-Operators Can Stop Running Cheap Freight — A Lane Strategy Guide",
        excerpt: "Most independent truckers are leaving $300–$600 per week on the table by accepting the first load that fits their schedule. We talked to 40 top-earning owner-operators about how they evaluate lanes, build broker relationships, and know when to deadhead for a better rate.",
        author: AUTHORS.priya,
        date: "April 1, 2026",
        readTime: "11 min read",
        tags: ["Owner Operators", "Load Boards", "Strategy", "Revenue"],
    },
];

const CATEGORIES: CategoryFilter[] = ["All", "Compliance", "Technology", "Industry", "Product", "Operations"];

const POPULAR_TAGS = ["ELD", "HOS", "FMCSA", "AI", "IFTA", "Owner Operators", "Freight Brokers", "Fleet Management", "API", "Safety"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AuthorAvatar({ author, size = "sm" }: { author: Author; size?: "sm" | "md" }) {
    const dim = size === "md" ? "w-10 h-10 text-sm" : "w-7 h-7 text-xs";
    return (
        <div className={`${dim} rounded-full bg-linear-to-br ${author.accent} border flex items-center justify-center font-bold flex-shrink-0`}>
            {author.initials}
        </div>
    );
}

function CategoryBadge({ label, color }: { label: string; color: string }) {
    return (
        <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${color}`}>
            {label.toUpperCase()}
        </span>
    );
}

function FeaturedCard({ post }: { post: BlogPost }) {
    return (
        <a
            href={`/blog/${post.slug}`}
            className="glass rounded-2xl overflow-hidden border border-slate-700/40 card-glow group hover:border-cyan-500/30 transition-all duration-200 flex flex-col"
        >
            {/* Decorative header band */}
            <div className="relative h-40 bg-gradient-to-br from-[#061d2a] to-[#040f16] overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-cyan-500/8 blur-[60px]" />
                <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full bg-violet-500/8 blur-[50px]" />
                {/* Decorative SVG illustration per category */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <svg viewBox="0 0 120 80" fill="none" className="w-48 h-32">
                        <path d="M10 60 Q30 20 60 40 Q90 60 110 20" stroke="#00e5cc" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <circle cx="60" cy="40" r="6" fill="#00e5cc" />
                        <path d="M0 70h120" stroke="#00e5cc" strokeWidth="1" opacity="0.4" />
                        {[10, 30, 50, 70, 90, 110].map(x => (
                            <rect key={x} x={x} y="55" width="8" height={15 + (x % 20)} rx="1" fill="#00e5cc" opacity="0.3" />
                        ))}
                    </svg>
                </div>
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <CategoryBadge label={post.category} color={post.categoryColor} />
                    <span className="text-[10px] text-slate-500 font-medium">{post.readTime}</span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h2 className="font-display text-lg font-700 text-white leading-snug mb-3 group-hover:text-cyan-300 transition-colors">
                    {post.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 flex-1 line-clamp-3">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/30">
                    <AuthorAvatar author={post.author} size="sm" />
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-300 truncate">{post.author.name}</div>
                        <div className="text-[10px] text-slate-500">{post.date}</div>
                    </div>
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </a>
    );
}

function PostRow({ post }: { post: BlogPost }) {
    return (
        <a
            href={`/blog/${post.slug}`}
            className="glass rounded-xl p-5 border border-slate-700/30 card-glow group hover:border-cyan-500/25 transition-all duration-200 flex gap-5 items-start"
        >
            {/* Left accent bar */}
            <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-cyan-500/60 to-teal-500/20 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <CategoryBadge label={post.category} color={post.categoryColor} />
                    <span className="text-[10px] text-slate-500">{post.readTime}</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{post.date}</span>
                </div>
                <h3 className="font-display text-base font-600 text-slate-200 leading-snug mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                </p>
                <div className="flex items-center gap-2">
                    <AuthorAvatar author={post.author} size="sm" />
                    <span className="text-xs text-slate-400">{post.author.name}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-500">{post.author.role}</span>
                </div>
            </div>
        </a>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
    const [searchQuery, setSearchQuery]       = useState("");

    const featuredPosts = BLOG_POSTS.filter(p => p.featured);
    const filteredPosts = BLOG_POSTS.filter(p => {
        const matchCat    = activeCategory === "All" || p.category === activeCategory;
        const matchSearch = !searchQuery.trim() ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    const nonFeatured = filteredPosts.filter(p => !p.featured || activeCategory !== "All" || searchQuery.trim());
    const showFeatured = activeCategory === "All" && !searchQuery.trim();

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
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-2xl mx-auto text-center mb-10">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                FleetPulse Blog
                            </div>
                            <h1 className="font-display text-4xl sm:text-5xl font-800 text-white mb-4 leading-tight">
                                Insights for the road ahead
                            </h1>
                            <p className="text-slate-400 text-lg mb-8">
                                Compliance updates, freight market analysis, product news, and
                                operational guides for carriers, brokers, and fleet managers.
                            </p>

                            {/* Search */}
                            <div className="relative">
                                <svg viewBox="0 0 20 20" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none">
                                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M15 15l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search articles…"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors bg-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                                        activeCategory === cat
                                            ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                                            : "glass border-slate-700/40 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Main Content ─────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-12">
                    <div className="max-w-7xl mx-auto flex gap-10">

                        {/* ── Posts ──────────────────────────────────────── */}
                        <div className="flex-1 min-w-0">

                            {/* Search result header */}
                            {searchQuery.trim() && (
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-sm text-slate-400">
                                        {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} for
                                    </span>
                                    <span className="glass rounded-full px-3 py-1 text-xs text-cyan-300 border border-cyan-500/30">
                                        "{searchQuery}"
                                    </span>
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors ml-1"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}

                            {/* Featured posts grid */}
                            {showFeatured && (
                                <>
                                    <div className="flex items-center gap-3 mb-5">
                                        <h2 className="font-display text-lg font-700 text-white">Featured</h2>
                                        <div className="flex-1 h-px bg-slate-800/80" />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-5 mb-10">
                                        {featuredPosts.map(p => (
                                            <FeaturedCard key={p.id} post={p} />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* All / filtered posts */}
                            {(showFeatured ? nonFeatured.filter(p => !p.featured) : filteredPosts).length > 0 && (
                                <>
                                    {showFeatured && (
                                        <div className="flex items-center gap-3 mb-5">
                                            <h2 className="font-display text-lg font-700 text-white">Latest</h2>
                                            <div className="flex-1 h-px bg-slate-800/80" />
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        {(showFeatured
                                                ? BLOG_POSTS.filter(p => !p.featured)
                                                : filteredPosts
                                        ).map(p => (
                                            <PostRow key={p.id} post={p} />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Empty state */}
                            {filteredPosts.length === 0 && (
                                <div className="glass rounded-2xl p-14 text-center border border-slate-700/30">
                                    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 mx-auto mb-4 text-slate-600">
                                        <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M32 32l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M16 22h12M22 16v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <div className="text-slate-400 font-medium mb-1">No articles found</div>
                                    <div className="text-xs text-slate-600 mb-4">Try a different search term or category.</div>
                                    <button
                                        onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── Sidebar ────────────────────────────────────── */}
                        <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0">

                            {/* Popular tags */}
                            <div className="glass rounded-xl p-5 border border-slate-700/30">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Popular Topics
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchQuery(tag)}
                                            className="text-xs px-3 py-1.5 rounded-lg glass border border-slate-700/40 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Browse by category */}
                            <div className="glass rounded-xl p-5 border border-slate-700/30">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Browse by Category
                                </div>
                                <div className="space-y-1">
                                    {CATEGORIES.filter(c => c !== "All").map(cat => {
                                        const count = BLOG_POSTS.filter(p => p.category === cat).length;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                                    activeCategory === cat
                                                        ? "text-cyan-300 bg-cyan-500/10"
                                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                                                }`}
                                            >
                                                <span>{cat}</span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                    activeCategory === cat ? "bg-cyan-500/15 text-cyan-400" : "bg-slate-800/60 text-slate-500"
                                                }`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Newsletter CTA */}
                            <div className="glass-strong rounded-xl p-5 border border-cyan-500/15 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/8 rounded-full blur-[40px]" />
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-600/20 border border-cyan-500/30 flex items-center justify-center mb-3">
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-cyan-400">
                                            <path d="M2 4h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.2" />
                                            <path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="text-sm font-semibold text-white mb-1">Stay in the loop</div>
                                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                                        Weekly compliance updates, freight market insights, and product news — straight to your inbox.
                                    </p>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-3 py-2 rounded-lg glass border border-slate-700/50 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 bg-transparent mb-2 transition-colors"
                                    />
                                    <button className="w-full py-2 rounded-lg bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] text-xs font-bold btn-glow">
                                        Subscribe
                                    </button>
                                    <p className="text-[10px] text-slate-600 mt-2 text-center">No spam. Unsubscribe anytime.</p>
                                </div>
                            </div>

                            {/* Featured authors */}
                            <div className="glass rounded-xl p-5 border border-slate-700/30">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Our Writers
                                </div>
                                <div className="space-y-3">
                                    {Object.values(AUTHORS).map(author => (
                                        <div key={author.name} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full bg-linear-to-br ${author.accent} border flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                                                {author.initials}
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-300">{author.name}</div>
                                                <div className="text-[10px] text-slate-500">{author.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </aside>
                    </div>
                </section>

                {/* ── Newsletter Band ──────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-16 border-t border-slate-800/60">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-3xl sm:text-4xl font-700 mb-4">
                            <span className="text-white">Never miss a compliance update</span>
                            <br />
                            <span className="shimmer-text">or market shift.</span>
                        </h2>
                        <p className="text-slate-400 mb-8">
                            Join 14,000+ carriers, brokers, and fleet managers who get the FleetPulse
                            weekly brief every Tuesday.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl glass border border-slate-700/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 bg-transparent transition-colors"
                            />
                            <button className="btn-glow font-semibold bg-linear-to-r from-cyan-500 to-teal-500 text-[#040f16] px-6 py-3 rounded-xl text-sm whitespace-nowrap">
                                Subscribe Free
                            </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-3">No spam · Unsubscribe anytime · 14,000+ subscribers</p>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}