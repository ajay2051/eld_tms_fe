import { useState, useEffect, useRef } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PolicySection {
    id: string;
    title: string;
    icon: React.ReactNode;
    accent: string;
    dotColor: string;
    content: React.ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const LAST_UPDATED = "June 1, 2026";
const EFFECTIVE_DATE = "June 1, 2026";

const POLICY_SECTIONS: PolicySection[] = [
    {
        id: "overview",
        title: "Overview",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-cyan-300",
        dotColor: "bg-cyan-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>
                    FleetPulse, Inc. ("FleetPulse", "we", "us", or "our") operates the FleetPulse platform — including our web application, mobile driver app, ELD firmware, and API — to help carriers, owner-operators, fleet managers, and freight brokers manage compliance, track vehicles, and operate more efficiently.
                </p>
                <p>
                    This Privacy Policy explains what information we collect, how we use it, who we share it with, and what choices you have. It applies to everyone who uses our services: drivers, fleet admins, dispatchers, brokers, and shippers.
                </p>
                <p>
                    <span className="text-slate-200 font-medium">The short version:</span> We collect data to make FleetPulse work. We don't sell your personal data or vehicle data to insurers, data brokers, or advertisers. You own your data, and you can request a copy or deletion at any time.
                </p>
                <div className="glass rounded-xl p-4 border border-cyan-500/20 bg-cyan-500/5">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg viewBox="0 0 12 12" className="w-3 h-3">
                                <path d="M2 6l3 3 5-5" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                            <span className="text-cyan-300 font-medium">Your vehicle data is yours.</span> We use GPS, engine, and HOS data to power your FleetPulse dashboard and comply with FMCSA requirements. We do not share this data with insurance companies, data brokers, or any third party without your explicit written consent.
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "data-collected",
        title: "Information We Collect",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M7 7h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-violet-300",
        dotColor: "bg-violet-400",
        content: (
            <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
                <p>We collect information in three ways: information you give us directly, information generated automatically by our ELD devices and apps, and information from third-party integrations you connect.</p>

                {[
                    {
                        heading: "Account & profile information",
                        color: "text-cyan-300",
                        bg: "bg-cyan-500/8 border-cyan-500/20",
                        items: [
                            "Name, email address, and password",
                            "Company name, DOT number, and MC number",
                            "Billing address and payment method (processed by Stripe — we never store raw card numbers)",
                            "Driver's license number and CDL class (for driver accounts)",
                            "Profile photo (optional)",
                        ],
                    },
                    {
                        heading: "Vehicle & telematics data",
                        color: "text-amber-300",
                        bg: "bg-amber-500/8 border-amber-500/20",
                        items: [
                            "GPS location (latitude, longitude, heading, speed) — updated every 30 seconds while the ELD is active",
                            "Engine on/off events, engine hours, and odometer readings",
                            "OBD-II diagnostic trouble codes (DTCs) and vehicle health data",
                            "Fuel level (where supported by vehicle)",
                            "Idle time and harsh-event data (braking, acceleration, cornering) for driver scorecard features",
                        ],
                    },
                    {
                        heading: "Hours of service (HOS) records",
                        color: "text-emerald-300",
                        bg: "bg-emerald-500/8 border-emerald-500/20",
                        items: [
                            "Duty status logs (Off Duty, Sleeper Berth, Driving, On Duty Not Driving)",
                            "Driver Vehicle Inspection Reports (DVIRs)",
                            "Co-driver assignments and team driving records",
                            "Violation history and annotation notes",
                        ],
                    },
                    {
                        heading: "Usage & device data",
                        color: "text-blue-300",
                        bg: "bg-blue-500/8 border-blue-500/20",
                        items: [
                            "App version, operating system, and device identifiers",
                            "Feature usage events and session duration (to improve the product)",
                            "IP address and approximate location at login",
                            "Browser type and referring URL (web app only)",
                        ],
                    },
                ].map((group, i) => (
                    <div key={i} className={`rounded-xl p-4 border ${group.bg}`}>
                        <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${group.color}`}>{group.heading}</div>
                        <ul className="space-y-1.5">
                            {group.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "how-we-use",
        title: "How We Use Your Information",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 15l-4.9 2.2.9-5.5L2 7.8l5.5-.8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-amber-300",
        dotColor: "bg-amber-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>We use the information we collect to operate and improve FleetPulse. Specifically:</p>
                <div className="space-y-3">
                    {[
                        { title: "Deliver the platform",        desc: "Process and display your GPS data, HOS logs, dispatch assignments, and load tracking in real time across the dashboard and driver app." },
                        { title: "Ensure FMCSA compliance",     desc: "Generate ELD records that meet FMCSA Part 395 requirements. Store logs for the federally mandated 6-month minimum. Enable DOT roadside inspection data transfer." },
                        { title: "Provide IFTA reporting",      desc: "Calculate per-state mileage from GPS data to generate your quarterly IFTA fuel tax return." },
                        { title: "Power AI features",           desc: "Use historical load and carrier data to rank carrier matches. Use driving behavior data to calculate driver safety scores. Your data is used only to improve your own results — we don't train shared models on individual fleet data without explicit opt-in." },
                        { title: "Operate billing",             desc: "Count active ELD devices for monthly invoicing. Process payments through Stripe. Send receipts and billing alerts." },
                        { title: "Send service communications", desc: "Deliver HOS violation alerts, maintenance reminders, and account security notifications. These are operational messages — we don't send marketing email without your consent." },
                        { title: "Improve the product",         desc: "Analyze aggregated, de-identified usage patterns to decide where to focus engineering effort. Individual user sessions are never shared externally for this purpose." },
                        { title: "Prevent fraud and abuse",     desc: "Detect and investigate unusual account activity, unauthorized API access, and potential violations of our Terms of Service." },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-3 p-3 glass rounded-lg border border-slate-700/25">
                            <div className="w-1 rounded-full bg-gradient-to-b from-cyan-500/60 to-teal-500/20 flex-shrink-0" />
                            <div>
                                <div className="text-slate-200 font-medium mb-0.5">{item.title}</div>
                                <div>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: "sharing",
        title: "How We Share Your Information",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="5"  cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="15" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-emerald-300",
        dotColor: "bg-emerald-400",
        content: (
            <div className="space-y-5 text-sm text-slate-400 leading-relaxed">
                <p>We do not sell your personal data or vehicle data. Here are the limited circumstances under which we share information:</p>

                <div className="glass rounded-xl p-4 border border-rose-500/20 bg-rose-500/5">
                    <div className="flex items-start gap-3">
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5">
                            <path d="M8 2L2 14h12L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                            <path d="M8 6v4M8 11v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        <p className="text-slate-300 text-xs leading-relaxed">
                            <span className="text-rose-300 font-medium">We never share vehicle telematics or ELD data with insurance companies, data brokers, or advertising networks</span> — even in aggregate — without your explicit written consent.
                        </p>
                    </div>
                </div>

                {[
                    {
                        title: "Within your organization",
                        desc: "Fleet admins, dispatchers, and authorized team members can see driver locations, HOS status, and vehicle data for the trucks assigned to their account. Drivers can see their own data only.",
                    },
                    {
                        title: "Service providers (sub-processors)",
                        desc: "We use third-party vendors to operate FleetPulse: Stripe for payment processing, AWS for cloud infrastructure, Twilio for SMS alerts, and Datadog for performance monitoring. Each sub-processor is contractually bound to handle your data only as directed by FleetPulse and to maintain appropriate security standards. A full list of our sub-processors is available upon request.",
                    },
                    {
                        title: "Load board & TMS integrations",
                        desc: "When you connect FleetPulse to DAT, Truckstop, McLeod, or another integration, we share only the data required for that integration to function — typically load details, truck location, and driver availability. You control which integrations are active and can disconnect them at any time.",
                    },
                    {
                        title: "Shippers (via tracking links)",
                        desc: "When a broker or fleet uses our shipper visibility portal, the shipper receives a link that shows real-time truck location and load status. This data is limited to the specific load and expires when the delivery is complete.",
                    },
                    {
                        title: "Legal and regulatory requirements",
                        desc: "We may disclose information if required by law, court order, or regulatory authority — including FMCSA data requests related to DOT investigations. We will notify you of any such disclosure to the extent permitted by law.",
                    },
                    {
                        title: "Business transfers",
                        desc: "If FleetPulse is acquired, merged with, or transfers assets to another company, your data may be transferred as part of that transaction. We will notify you in advance and your rights under this policy will continue to apply.",
                    },
                ].map((item, i) => (
                    <div key={i}>
                        <div className="text-slate-200 font-medium mb-1">{item.title}</div>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        id: "retention",
        title: "Data Retention",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-blue-300",
        dotColor: "bg-blue-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>Different types of data are subject to different retention obligations — some driven by FMCSA regulations, some by our own operational needs.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="text-left text-slate-400 font-semibold pb-3 pr-6">Data Type</th>
                            <th className="text-left text-slate-400 font-semibold pb-3 pr-6">Retention Period</th>
                            <th className="text-left text-slate-400 font-semibold pb-3">Reason</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                        {[
                            ["ELD / HOS records",           "6 months minimum",    "FMCSA Part 395 requirement"],
                            ["DVIR inspection records",     "3 months minimum",    "FMCSA Part 396 requirement"],
                            ["GPS location history",        "13 months",           "IFTA audit window"],
                            ["Account & billing records",   "7 years",             "Tax and accounting requirements"],
                            ["Driver safety event data",    "24 months",           "Scorecard and coaching history"],
                            ["Support ticket records",      "3 years",             "Dispute resolution"],
                            ["Deleted account data",        "90 days",             "Accidental deletion recovery"],
                            ["Anonymized usage analytics",  "Indefinite",          "Product improvement (no PII)"],
                        ].map(([type, period, reason], i) => (
                            <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                                <td className="py-3 pr-6 text-slate-300">{type}</td>
                                <td className="py-3 pr-6 text-cyan-300 font-medium">{period}</td>
                                <td className="py-3 text-slate-500">{reason}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <p>After the applicable retention period, we either delete your data or anonymize it so it can no longer be linked to you or your organization.</p>
            </div>
        ),
    },
    {
        id: "security",
        title: "Security",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L3 5v6c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-rose-300",
        dotColor: "bg-rose-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>Protecting your data is a core part of our infrastructure, not an afterthought. Here's what we do:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        { title: "Encryption in transit",      desc: "All data between your devices and FleetPulse is encrypted using TLS 1.3. ELD-to-cloud communication uses certificate-pinned HTTPS.", icon: "🔒" },
                        { title: "Encryption at rest",         desc: "Database contents and file storage are encrypted at rest using AES-256. Encryption keys are managed via AWS KMS with hardware security modules.", icon: "💾" },
                        { title: "Access controls",            desc: "Employees access customer data on a strict need-to-know basis. All internal access is logged and reviewed quarterly. Production database access requires multi-factor authentication.", icon: "🔑" },
                        { title: "SOC 2 Type II",              desc: "FleetPulse maintains SOC 2 Type II certification, audited annually by an independent third party. Reports available to enterprise customers under NDA.", icon: "✅" },
                        { title: "Penetration testing",        desc: "We conduct annual third-party penetration tests and run a responsible disclosure program for external security researchers.", icon: "🛡️" },
                        { title: "Incident response",          desc: "In the event of a breach affecting your data, we will notify you within 72 hours of discovery, consistent with applicable law.", icon: "⚡" },
                    ].map((item, i) => (
                        <div key={i} className="glass rounded-xl p-4 border border-slate-700/25">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-base">{item.icon}</span>
                                <span className="text-slate-200 font-medium text-xs">{item.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <p>No system is perfectly secure. If you discover a vulnerability in FleetPulse, please report it to <span className="text-cyan-300">security@fleetpulse.com</span>. We take all reports seriously and aim to respond within 24 hours.</p>
            </div>
        ),
    },
    {
        id: "your-rights",
        title: "Your Rights & Choices",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 18c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-teal-300",
        dotColor: "bg-teal-400",
        content: (
            <div className="space-y-5 text-sm text-slate-400 leading-relaxed">
                <p>You have meaningful control over your data. The following rights apply to all users, regardless of where you're located:</p>
                <div className="space-y-3">
                    {[
                        { right: "Access",      desc: "Request a copy of all personal data we hold about you, in a portable, machine-readable format. We fulfill access requests within 30 days.",              color: "text-cyan-300",    border: "border-cyan-500/20",    bg: "bg-cyan-500/5"    },
                        { right: "Correction",  desc: "Request correction of inaccurate personal data. For account details, you can update most information directly from Settings.",                           color: "text-violet-300",  border: "border-violet-500/20",  bg: "bg-violet-500/5"  },
                        { right: "Deletion",    desc: "Request deletion of your personal data. Note: ELD and HOS records may need to be retained for up to 6 months to comply with FMCSA regulations even after account closure.", color: "text-rose-300",    border: "border-rose-500/20",    bg: "bg-rose-500/5"    },
                        { right: "Portability", desc: "Export your ELD logs, GPS history, and driver records in industry-standard formats (CSV, JSON) at any time from your account dashboard.",                 color: "text-emerald-300", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
                        { right: "Opt-out",     desc: "Opt out of non-essential communications (marketing emails, product newsletters) at any time via the unsubscribe link in any email or from Account Settings.", color: "text-amber-300",   border: "border-amber-500/20",   bg: "bg-amber-500/5"   },
                        { right: "Restrict processing", desc: "Request that we restrict certain processing of your data while a dispute is under review — for example, while you contest the accuracy of a record.", color: "text-blue-300", border: "border-blue-500/20", bg: "bg-blue-500/5" },
                    ].map((item, i) => (
                        <div key={i} className={`flex gap-3 rounded-xl p-4 border ${item.border} ${item.bg}`}>
                            <div className={`text-xs font-bold uppercase tracking-widest w-20 flex-shrink-0 pt-0.5 ${item.color}`}>{item.right}</div>
                            <p className="text-xs leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <p>To exercise any of these rights, email <span className="text-cyan-300">privacy@fleetpulse.com</span> or use the data request form in your Account Settings. We may need to verify your identity before processing the request.</p>
                <p>If you are located in California, you have additional rights under CCPA/CPRA. If you're in the EU or UK, you have rights under GDPR/UK GDPR, including the right to lodge a complaint with your local supervisory authority.</p>
            </div>
        ),
    },
    {
        id: "cookies",
        title: "Cookies & Tracking",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="7"  cy="8"  r="1" fill="currentColor" />
                <circle cx="13" cy="8"  r="1" fill="currentColor" />
                <path d="M7 13s1.5 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-violet-300",
        dotColor: "bg-violet-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>We use cookies and similar technologies in the FleetPulse web application. We don't use advertising cookies or behavioral tracking for ad targeting.</p>
                <div className="space-y-2">
                    {[
                        { type: "Essential cookies",     purpose: "Authentication sessions, CSRF protection, and core app functionality. These cannot be disabled.",               required: true  },
                        { type: "Preference cookies",    purpose: "Remember your language, timezone, dashboard layout, and display settings across sessions.",                     required: false },
                        { type: "Analytics cookies",     purpose: "Aggregate usage metrics (page views, feature adoption) using a self-hosted Plausible instance — no data sent to Google or Meta.", required: false },
                        { type: "Support chat cookies",  purpose: "Used by our live chat tool to maintain your support conversation across page navigation.",                       required: false },
                    ].map((cookie, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 glass rounded-lg border border-slate-700/25">
                            <div className={`flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest ${cookie.required ? "bg-slate-700/60 text-slate-400" : "bg-violet-500/10 border border-violet-500/25 text-violet-300"}`}>
                                {cookie.required ? "REQUIRED" : "OPTIONAL"}
                            </div>
                            <div>
                                <div className="text-slate-200 font-medium mb-0.5">{cookie.type}</div>
                                <div className="text-xs text-slate-500">{cookie.purpose}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <p>You can manage optional cookies from your browser settings or from the Cookie Preferences link in the site footer.</p>
            </div>
        ),
    },
    {
        id: "third-parties",
        title: "Third-Party Links",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M15 3h2v2M17 3l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-slate-300",
        dotColor: "bg-slate-400",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>FleetPulse may contain links to external websites — load boards, FMCSA resources, integration partner sites, and press coverage. These sites are not operated by FleetPulse and are governed by their own privacy policies.</p>
                <p>We are not responsible for the content or privacy practices of any third-party site. We encourage you to review the privacy policy of any external site you visit through a link in FleetPulse.</p>
            </div>
        ),
    },
    {
        id: "children",
        title: "Children's Privacy",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-slate-300",
        dotColor: "bg-slate-500",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>FleetPulse is a commercial platform designed for use by adults in a professional capacity. We do not knowingly collect personal information from anyone under the age of 18.</p>
                <p>If you believe we have inadvertently collected information from a minor, please contact us immediately at <span className="text-cyan-300">privacy@fleetpulse.com</span> and we will delete it promptly.</p>
            </div>
        ),
    },
    {
        id: "changes",
        title: "Changes to This Policy",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M4 10h12M4 6h8M4 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-slate-300",
        dotColor: "bg-slate-400",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>We may update this Privacy Policy periodically to reflect changes in our practices, the law, or our product. When we make material changes, we will:</p>
                <ul className="space-y-2">
                    {[
                        "Email all account holders at the address on file at least 14 days before the change takes effect",
                        "Display a prominent notice in the FleetPulse dashboard",
                        "Update the 'Last Updated' date at the top of this page",
                        "Maintain a version history so you can see exactly what changed",
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 mt-1.5 flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
                <p>Your continued use of FleetPulse after a policy change takes effect constitutes your acceptance of the revised policy.</p>
            </div>
        ),
    },
    {
        id: "contact",
        title: "Contact & DPO",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M3 3h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 4l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-cyan-300",
        dotColor: "bg-cyan-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>Questions, concerns, or requests regarding this Privacy Policy can be directed to:</p>
                <div className="glass rounded-xl p-5 border border-cyan-500/20 bg-cyan-500/4">
                    <div className="space-y-2 text-sm">
                        {[
                            ["Privacy team",      "privacy@fleetpulse.com"],
                            ["Data requests",     "privacy@fleetpulse.com (subject: 'Data Request')"],
                            ["Security issues",   "security@fleetpulse.com"],
                            ["Mailing address",   "FleetPulse, Inc.\n1801 E 6th Street, Suite 410\nAustin, TX 78702"],
                        ].map(([label, value], i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-slate-500 w-32 shrink-0">{label}</span>
                                <span className="text-slate-300 whitespace-pre-line">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <p>For EU/UK users: FleetPulse's Data Protection Officer can be reached at <span className="text-cyan-300">dpo@fleetpulse.com</span>. You also have the right to lodge a complaint with your local data protection authority.</p>
            </div>
        ),
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState<string>("overview");
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Scrollspy: update active section on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );
        POLICY_SECTIONS.forEach(s => {
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
                <section className="px-4 sm:px-6 pt-14 pb-12 border-b border-slate-800/60">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                Legal
                            </div>
                            <h1 className="font-display text-4xl sm:text-5xl font-800 text-white mb-4 leading-tight">
                                Privacy Policy
                            </h1>
                            <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-2xl">
                                We wrote this policy to be readable, not just legally defensible. If something is unclear, email us at <a href="mailto:privacy@fleetpulse.com" className="text-cyan-300 hover:underline">privacy@fleetpulse.com</a>.
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
                                    {POLICY_SECTIONS.length} sections · ~12 min read
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Main Layout ──────────────────────────────────────────── */}
                <section className="px-4 sm:px-6 py-10">
                    <div className="max-w-7xl mx-auto flex gap-10">

                        {/* ── Sidebar TOC ────────────────────────────────── */}
                        <aside className="hidden lg:block w-56 shrink-0">
                            <div className="sticky top-24 space-y-1">
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">
                                    Contents
                                </div>
                                {POLICY_SECTIONS.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollTo(section.id)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-all duration-150 ${
                                            activeSection === section.id
                                                ? `${section.accent} bg-slate-800/40`
                                                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                            activeSection === section.id ? section.dotColor : "bg-slate-700"
                                        }`} />
                                        {section.title}
                                    </button>
                                ))}

                                {/* Jump to contact */}
                                <div className="pt-4 border-t border-slate-800/60 mt-2">
                                    <a
                                        href="mailto:privacy@fleetpulse.com"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-cyan-300 transition-colors"
                                    >
                                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                                            <rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1" />
                                            <path d="M1 3l5 4 5-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                        </svg>
                                        privacy@fleetpulse.com
                                    </a>
                                </div>
                            </div>
                        </aside>

                        {/* ── Policy Content ─────────────────────────────── */}
                        <div className="flex-1 min-w-0 max-w-3xl">

                            {/* Key commitments card */}
                            <div className="glass-strong rounded-2xl p-6 border border-cyan-500/15 mb-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-[60px]" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Our Core Commitments</span>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {[
                                            { icon: "🚫", text: "We never sell your data or vehicle telemetry to third parties" },
                                            { icon: "🔒", text: "Your data is encrypted in transit and at rest — always" },
                                            { icon: "📤", text: "You can export or delete your data at any time" },
                                        ].map((c, i) => (
                                            <div key={i} className="flex items-start gap-2.5 glass rounded-lg p-3 border border-slate-700/25">
                                                <span className="text-base flex-shrink-0">{c.icon}</span>
                                                <span className="text-xs text-slate-300 leading-snug">{c.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sections */}
                            <div className="space-y-12">
                                {POLICY_SECTIONS.map((section) => (
                                    <div
                                        key={section.id}
                                        id={section.id}
                                        className="scroll-mt-28"
                                        ref={el => { sectionRefs.current[section.id] = el; }}
                                    >
                                        {/* Section header */}
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className={`p-2 glass rounded-lg ${section.accent}`}>
                                                {section.icon}
                                            </div>
                                            <h2 className={`font-display text-xl font-700 ${section.accent}`}>
                                                {section.title}
                                            </h2>
                                            <div className="flex-1 h-px bg-slate-800/60" />
                                        </div>

                                        {/* Section content */}
                                        <div className="ml-0">
                                            {section.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer note */}
                            <div className="mt-12 pt-8 border-t border-slate-800/60">
                                <div className="glass rounded-xl p-5 border border-slate-700/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-white mb-0.5">Questions about this policy?</div>
                                        <div className="text-xs text-slate-400">We're happy to explain anything in plain language.</div>
                                    </div>
                                    <div className="flex gap-3 flex-shrink-0">
                                        <a
                                            href="mailto:privacy@fleetpulse.com"
                                            className="btn-glow text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-5 py-2.5 rounded-lg whitespace-nowrap"
                                        >
                                            Email Privacy Team
                                        </a>
                                        <a
                                            href="/contact"
                                            className="glass text-sm text-slate-300 hover:text-cyan-300 border border-slate-600/50 hover:border-cyan-500/40 px-5 py-2.5 rounded-lg transition-all whitespace-nowrap"
                                        >
                                            Contact Us
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