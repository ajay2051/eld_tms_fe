import { useState, useEffect, useRef } from "react";
import Footer from "../components/footer.tsx";
import Navbar from "../components/navbar.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TosSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    accent: string;
    dotColor: string;
    content: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LAST_UPDATED   = "June 1, 2026";
const EFFECTIVE_DATE = "June 1, 2026";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Bullet({ items }: { items: string[] }) {
    return (
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 mt-1.5 flex-shrink-0" />
                    {item}
                </li>
            ))}
        </ul>
    );
}

function CalloutBox({
                        variant = "info",
                        children,
                    }: {
    variant?: "info" | "warning" | "danger";
    children: React.ReactNode;
}) {
    const styles = {
        info:    { border: "border-cyan-500/20",  bg: "bg-cyan-500/5",  icon: "text-cyan-400",  iconPath: "M2 6l3 3 5-5" },
        warning: { border: "border-amber-500/20", bg: "bg-amber-500/5", icon: "text-amber-400", iconPath: "M8 4v4M8 10v1" },
        danger:  { border: "border-rose-500/20",  bg: "bg-rose-500/5",  icon: "text-rose-400",  iconPath: "M8 4v4M8 10v1" },
    }[variant];

    return (
        <div className={`rounded-xl p-4 border ${styles.border} ${styles.bg} flex items-start gap-3`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${styles.bg} border ${styles.border}`}>
                <svg viewBox="0 0 12 12" className={`w-3 h-3 ${styles.icon}`} fill="none">
                    <path d={styles.iconPath} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
        </div>
    );
}

function ItemRow({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="flex gap-3 p-3 glass rounded-lg border border-slate-700/25">
            <div className="w-1 rounded-full bg-gradient-to-b from-cyan-500/60 to-teal-500/10 flex-shrink-0" />
            <div>
                <div className="text-slate-200 font-medium text-sm mb-0.5">{title}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
            </div>
        </div>
    );
}

// ─── Section content ──────────────────────────────────────────────────────────

const TOS_SECTIONS: TosSection[] = [
    {
        id: "acceptance",
        title: "Acceptance of Terms",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L3 5v6c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-cyan-300",
        dotColor: "bg-cyan-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>
                    These Terms of Service ("Terms") form a binding legal agreement between you and FleetPulse, Inc. ("FleetPulse", "we", "us", or "our"). By creating an account, accessing our platform, or using any FleetPulse product — including our web application, driver mobile app, ELD device firmware, or REST API — you agree to these Terms in full.
                </p>
                <p>
                    If you are accepting these Terms on behalf of a company, fleet, or other legal entity, you represent that you have the authority to bind that entity. References to "you" throughout these Terms include both individual users and the organizations they represent.
                </p>
                <CalloutBox variant="warning">
                    <span className="text-amber-300 font-medium">If you do not agree to these Terms, do not use FleetPulse.</span> You must be at least 18 years old and legally capable of entering a binding contract to create an account. Use of FleetPulse in violation of applicable law is not permitted.
                </CalloutBox>
                <p>
                    These Terms incorporate our <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a> and any order forms, statements of work, or enterprise agreements you've signed with FleetPulse. In the event of a conflict, a signed enterprise agreement takes precedence over these Terms.
                </p>
            </div>
        ),
    },
    {
        id: "definitions",
        title: "Definitions",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 7h6M7 10h4M7 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-violet-300",
        dotColor: "bg-violet-400",
        content: (
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                <p>The following terms have specific meanings throughout this agreement:</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="text-left text-slate-400 font-semibold pb-3 pr-6 w-32">Term</th>
                            <th className="text-left text-slate-400 font-semibold pb-3">Meaning</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                        {[
                            ["Platform",         "The FleetPulse web application, driver mobile app, ELD device firmware, and REST API, collectively."],
                            ["Account",          "A registered user profile granting access to the Platform."],
                            ["Fleet Admin",      "An account holder with authority to manage vehicles, drivers, and billing for an organization."],
                            ["Driver",           "An account holder who uses the Platform primarily to log hours of service and interact with ELD devices."],
                            ["ELD Device",       "A FleetPulse-supplied electronic logging device that connects to a vehicle's OBD-II port."],
                            ["Subscription",     "A recurring billing arrangement granting access to the Platform for a defined term."],
                            ["Customer Data",    "All data you upload to, generate through, or transmit via the Platform — including HOS logs, GPS records, and vehicle telematics."],
                            ["FleetPulse Content","Intellectual property owned or licensed by FleetPulse, including software, documentation, and training materials."],
                            ["FMCSA",            "The Federal Motor Carrier Safety Administration, the US agency responsible for regulating commercial motor vehicle safety."],
                        ].map(([term, meaning], i) => (
                            <tr key={i} className="hover:bg-slate-800/15 transition-colors">
                                <td className="py-3 pr-6 text-violet-300 font-medium align-top">{term}</td>
                                <td className="py-3 text-slate-400">{meaning}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ),
    },
    {
        id: "account",
        title: "Account Registration & Responsibilities",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-amber-300",
        dotColor: "bg-amber-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>To use FleetPulse you must create an account. When you do, you agree to:</p>
                <Bullet items={[
                    "Provide accurate, current, and complete registration information and keep it updated.",
                    "Maintain the confidentiality of your password. You are responsible for all activity that occurs under your account.",
                    "Notify us immediately at security@fleetpulse.com if you suspect unauthorized access to your account.",
                    "Not share login credentials between multiple people. Each driver and team member must have their own account.",
                    "Not create more than one account per individual without our written permission.",
                ]} />
                <p>Fleet Admins are additionally responsible for:</p>
                <Bullet items={[
                    "Ensuring that all drivers and dispatchers added to their account comply with these Terms.",
                    "Maintaining accurate DOT numbers, MC authority, and vehicle information in their account.",
                    "Configuring appropriate permission levels for team members to limit data access to what's necessary.",
                    "Promptly deactivating accounts for employees who leave their organization.",
                ]} />
                <CalloutBox variant="info">
                    FleetPulse reserves the right to terminate or suspend any account that provides false registration information, impersonates another person or entity, or is used in a manner inconsistent with applicable law.
                </CalloutBox>
            </div>
        ),
    },
    {
        id: "subscription",
        title: "Subscriptions, Billing & Payment",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-emerald-300",
        dotColor: "bg-emerald-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>FleetPulse is a subscription service billed monthly or annually depending on the plan you select. All prices are in US dollars unless otherwise stated.</p>
                <div className="space-y-3">
                    <ItemRow title="Active device billing" desc="You are billed for each ELD device that is paired to a vehicle and generates at least one activity event during a billing period. Devices that are unpaired or inactive are not counted." />
                    <ItemRow title="Free trial" desc="New accounts may be eligible for a 14-day free trial. No credit card is required to start. At the end of the trial, you must enter payment details to continue using the Platform." />
                    <ItemRow title="Payment processing" desc="Payments are processed by Stripe. By providing payment information, you authorize FleetPulse to charge your payment method on the applicable billing cycle until you cancel." />
                    <ItemRow title="Failed payments" desc="If a payment fails, we will retry up to three times over 7 days and notify you by email. If payment is not received after retries, we may suspend access to the Platform until the balance is cleared." />
                    <ItemRow title="Plan changes" desc="Upgrades take effect immediately and are prorated for the current billing period. Downgrades take effect at the start of the next billing period." />
                    <ItemRow title="Price changes" desc="We may change subscription pricing with 30 days' written notice. Your continued use of the Platform after a price change takes effect constitutes acceptance of the new price." />
                </div>
                <CalloutBox variant="info">
                    <span className="text-cyan-300 font-medium">All fees are non-refundable</span> except as required by applicable law or as expressly stated in our refund policy. If you believe a charge was made in error, contact us at billing@fleetpulse.com within 30 days of the charge.
                </CalloutBox>
            </div>
        ),
    },
    {
        id: "eld-compliance",
        title: "ELD Use & FMCSA Compliance",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-rose-300",
        dotColor: "bg-rose-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>FleetPulse provides FMCSA-registered ELD devices and software designed to help you comply with the ELD mandate (49 CFR Part 395). However, <span className="text-rose-300 font-medium">compliance with federal, state, and local regulations remains your sole responsibility.</span></p>
                <p>By using FleetPulse ELD devices, you agree to:</p>
                <Bullet items={[
                    "Use the ELD device only in commercial motor vehicles for which it is registered.",
                    "Ensure drivers are trained on proper ELD use before operating under ELD mandate requirements.",
                    "Review and certify HOS logs accurately and promptly — you must not certify false, inaccurate, or incomplete records.",
                    "Maintain backup paper logs as required by FMCSA regulations when the ELD malfunctions.",
                    "Not tamper with, modify, or attempt to bypass the ELD hardware or software to produce inaccurate records.",
                    "Report any ELD malfunction to FleetPulse within 24 hours and to FMCSA as required by regulation.",
                    "Return ELD devices in good working condition upon subscription cancellation.",
                ]} />
                <CalloutBox variant="danger">
                    <span className="text-rose-300 font-medium">FleetPulse is not liable for violations, fines, citations, or penalties</span> issued by FMCSA, DOT, or any other regulatory body arising from your use or misuse of our ELD devices or software. You are solely responsible for ensuring your fleet operates within applicable legal requirements.
                </CalloutBox>
            </div>
        ),
    },
    {
        id: "acceptable-use",
        title: "Acceptable Use Policy",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L2 7l8 5 8-5-8-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M2 12l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-blue-300",
        dotColor: "bg-blue-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>FleetPulse is a professional platform for fleet management, ELD compliance, and freight operations. You agree to use it only for lawful purposes consistent with these Terms.</p>
                <p>You may <span className="text-emerald-300 font-medium">not</span> use FleetPulse to:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                    {[
                        "Submit false, inaccurate, or fraudulent HOS records",
                        "Falsify vehicle inspection reports (DVIRs)",
                        "Circumvent FMCSA ELD requirements or tamper with logbook data",
                        "Scrape, harvest, or systematically extract data from the Platform",
                        "Reverse-engineer, decompile, or disassemble any part of the Platform",
                        "Introduce malicious code, viruses, or disruptive software",
                        "Impersonate FleetPulse, another user, or any other person or entity",
                        "Use the API to build a competing product without prior written consent",
                        "Resell or sublicense access to the Platform to unauthorized third parties",
                        "Violate any applicable federal, state, or local law or regulation",
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 glass rounded-lg border border-slate-700/25 text-xs">
                            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5">
                                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                                <path d="M4 4l4 4M8 4l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                            <span className="text-slate-400">{item}</span>
                        </div>
                    ))}
                </div>
                <p>Violation of this Acceptable Use Policy may result in immediate suspension or termination of your account without refund. We reserve the right to report illegal activity to law enforcement.</p>
            </div>
        ),
    },
    {
        id: "api",
        title: "API Access & Integrations",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M7 8l-4 4 4 4M13 8l4 4-4 4M11 4l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-violet-300",
        dotColor: "bg-violet-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>FleetPulse provides a REST API to allow customers and authorized third-party developers to build integrations with the Platform. Access to the API is subject to these Terms and any API-specific documentation published at <span className="text-cyan-300">docs.fleetpulse.com</span>.</p>
                <div className="space-y-3">
                    <ItemRow title="API keys" desc="API keys are tied to your account and must be kept confidential. You are responsible for any activity that occurs using your API keys. Rotate compromised keys immediately via your account dashboard." />
                    <ItemRow title="Rate limits" desc="API requests are subject to rate limits described in our developer documentation. Exceeding rate limits may result in temporary throttling. We reserve the right to revoke API access for accounts that consistently abuse limits." />
                    <ItemRow title="Third-party integrations" desc="When you connect a third-party integration (DAT, Truckstop, QuickBooks, etc.), you authorize FleetPulse to exchange the minimum data necessary to operate that integration. You remain responsible for complying with those third parties' terms of service." />
                    <ItemRow title="Webhooks" desc="You are responsible for ensuring your webhook endpoints are secured, receive payloads promptly, and handle failures gracefully. FleetPulse is not liable for data loss caused by inaccessible or misconfigured endpoints." />
                </div>
            </div>
        ),
    },
    {
        id: "ip",
        title: "Intellectual Property",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M9 3H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V9l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-teal-300",
        dotColor: "bg-teal-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p><span className="text-slate-200 font-medium">FleetPulse content:</span> All software, algorithms, UI designs, documentation, trademarks, and other intellectual property comprising the FleetPulse Platform are owned by or licensed to FleetPulse, Inc. These Terms do not grant you any ownership rights in FleetPulse content.</p>
                <p>We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform during your active subscription solely for your internal business operations.</p>
                <p><span className="text-slate-200 font-medium">Your content:</span> You retain full ownership of your Customer Data — your HOS logs, GPS records, driver data, load information, and any other data you submit to the Platform. You grant FleetPulse a limited license to process, store, and transmit your Customer Data solely as required to provide the Platform services and as described in our <a href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</a>.</p>
                <p><span className="text-slate-200 font-medium">Feedback:</span> If you submit ideas, feature requests, or suggestions to FleetPulse, you grant us a perpetual, irrevocable, royalty-free license to use them without attribution or compensation. We're not obligated to implement any feedback.</p>
                <CalloutBox variant="info">
                    The FleetPulse name, logo, and product names are trademarks of FleetPulse, Inc. You may not use them without prior written permission except to identify our products in a factually accurate way.
                </CalloutBox>
            </div>
        ),
    },
    {
        id: "confidentiality",
        title: "Confidentiality",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 9V7a2 2 0 114 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="14" r="1" fill="currentColor" />
            </svg>
        ),
        accent: "text-amber-300",
        dotColor: "bg-amber-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>Each party may receive Confidential Information from the other in connection with the Platform. "Confidential Information" means any non-public information disclosed by one party to the other that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.</p>
                <p>Each party agrees to:</p>
                <Bullet items={[
                    "Keep the other party's Confidential Information strictly confidential.",
                    "Use Confidential Information only as necessary to exercise rights or fulfill obligations under these Terms.",
                    "Not disclose Confidential Information to third parties without prior written consent, except to employees and contractors who need it to deliver the Platform services and are bound by equivalent confidentiality obligations.",
                    "Protect Confidential Information with at least the same level of care used to protect its own confidential information, and in any case no less than reasonable care.",
                ]} />
                <p>These obligations do not apply to information that: (a) is or becomes publicly known through no fault of the receiving party; (b) was already known to the receiving party; (c) is independently developed without use of the Confidential Information; or (d) is required to be disclosed by law, regulation, or court order — provided the receiving party gives reasonable prior notice to allow the other party to seek a protective order.</p>
            </div>
        ),
    },
    {
        id: "uptime",
        title: "Service Availability & SLA",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        accent: "text-emerald-300",
        dotColor: "bg-emerald-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>FleetPulse targets 99.9% monthly uptime for the core Platform, excluding scheduled maintenance windows. Uptime is measured as the percentage of minutes in a calendar month during which the Platform is accessible and functional.</p>
                <div className="space-y-3">
                    <ItemRow title="Starter & Pro plans" desc="We target 99.9% monthly uptime. In months where uptime falls below this target, you may request a service credit of 10% of that month's subscription fee." />
                    <ItemRow title="Enterprise plans" desc="Uptime SLA and remedies are governed by your individual enterprise agreement, which may provide stronger guarantees than the default terms above." />
                    <ItemRow title="Scheduled maintenance" desc="We perform scheduled maintenance during low-traffic windows (typically 2–4am Central Time on weekdays). We provide at least 48 hours notice via the status page and email for planned downtime exceeding 30 minutes." />
                    <ItemRow title="What's excluded" desc="Uptime SLAs do not cover: force majeure events, failures caused by your own systems or internet connectivity, third-party service outages (e.g. AWS, Stripe), or outages caused by your violation of these Terms." />
                </div>
                <CalloutBox variant="info">
                    Service credits are your sole remedy for downtime. To claim a credit, email support@fleetpulse.com within 30 days of the affected month with 'SLA Credit Request' in the subject line.
                </CalloutBox>
            </div>
        ),
    },
    {
        id: "termination",
        title: "Term & Termination",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10h6M10 7l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-blue-300",
        dotColor: "bg-blue-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>These Terms are effective from the date you create your account and remain in effect until terminated by either party.</p>
                <p><span className="text-slate-200 font-medium">Termination by you:</span> You may cancel your subscription at any time from your account Settings page or by contacting support. Cancellation takes effect at the end of the current billing period. You retain access to the Platform until that date. We do not provide prorated refunds for unused subscription time.</p>
                <p><span className="text-slate-200 font-medium">Termination by FleetPulse:</span> We may suspend or terminate your account immediately without notice if:</p>
                <Bullet items={[
                    "You materially breach these Terms and fail to cure the breach within 10 days of written notice (or immediately for ELD tampering, fraudulent records, or illegal activity).",
                    "Your account is used to produce or certify false or fraudulent HOS records.",
                    "You fail to pay undisputed fees after three billing retries.",
                    "Continued operation of your account creates a legal or security risk to FleetPulse or other users.",
                    "We are required to do so by law or regulation.",
                ]} />
                <p><span className="text-slate-200 font-medium">Effect of termination:</span> Upon termination, your right to access the Platform ends immediately. Your Customer Data will be made available for export for 90 days following termination, after which it will be deleted in accordance with our data retention policy. FMCSA-mandated ELD records will be retained for the legally required period regardless of account status.</p>
                <p>Provisions that by their nature should survive termination — including IP ownership, payment obligations, confidentiality, disclaimers, limitation of liability, and dispute resolution — will continue to apply after termination.</p>
            </div>
        ),
    },
    {
        id: "disclaimers",
        title: "Disclaimers & Warranties",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L2 18h16L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M10 8v4M10 14v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-rose-300",
        dotColor: "bg-rose-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <CalloutBox variant="danger">
                    <span className="text-rose-300 font-medium">THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE"</span> WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </CalloutBox>
                <p>FleetPulse does not warrant that:</p>
                <Bullet items={[
                    "The Platform will be uninterrupted, error-free, or free of viruses or other harmful components.",
                    "The results obtained from using the Platform will be accurate or reliable.",
                    "Any defects in the Platform will be corrected within a specific timeframe.",
                    "The Platform will meet all FMCSA or DOT requirements in every jurisdiction or for every vehicle class.",
                ]} />
                <p>Some jurisdictions do not allow the exclusion of implied warranties. In such jurisdictions, the above exclusions apply to the fullest extent permitted by applicable law.</p>
                <p><span className="text-slate-200 font-medium">Compliance disclaimer:</span> While FleetPulse is designed to support FMCSA ELD mandate compliance, we make no guarantee that use of our Platform will ensure your compliance with all applicable regulations. You are solely responsible for understanding and complying with all laws and regulations applicable to your operations.</p>
            </div>
        ),
    },
    {
        id: "liability",
        title: "Limitation of Liability",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L3 5v6c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-slate-300",
        dotColor: "bg-slate-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <CalloutBox variant="warning">
                    <span className="text-amber-300 font-medium">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,</span> FleetPulse's total cumulative liability to you for any claims arising out of or related to these Terms or the Platform — regardless of the form of action or theory of liability — will not exceed the greater of: (a) the total fees paid by you to FleetPulse in the 12 months preceding the claim, or (b) $500 USD.
                </CalloutBox>
                <p>FleetPulse will not be liable for any:</p>
                <Bullet items={[
                    "Indirect, incidental, special, consequential, or punitive damages",
                    "Loss of profits, revenue, data, goodwill, or business opportunities",
                    "Regulatory fines, DOT citations, or FMCSA violations arising from your use of the Platform",
                    "Cost of procuring substitute services",
                    "Damages arising from unauthorized access to your account or Customer Data",
                    "Damages resulting from reliance on any GPS, ETA, or HOS calculation produced by the Platform",
                ]} />
                <p>These limitations apply even if FleetPulse has been advised of the possibility of such damages. Some jurisdictions do not allow certain exclusions or limitations on liability; in such jurisdictions, our liability is limited to the greatest extent permitted by law.</p>
            </div>
        ),
    },
    {
        id: "indemnification",
        title: "Indemnification",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-slate-300",
        dotColor: "bg-slate-500",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>You agree to indemnify, defend, and hold harmless FleetPulse, Inc. and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, fines, penalties, and expenses (including reasonable attorneys' fees) arising out of or related to:</p>
                <Bullet items={[
                    "Your use of the Platform in violation of these Terms or applicable law.",
                    "Your Customer Data, including any claim that it infringes a third party's rights.",
                    "False, inaccurate, or fraudulent HOS records submitted through the Platform.",
                    "Your failure to comply with FMCSA, DOT, or other applicable regulatory requirements.",
                    "Any claim by a driver, employee, or third party arising from your configuration or use of the Platform.",
                    "Your negligence or willful misconduct.",
                ]} />
                <p>FleetPulse reserves the right to assume exclusive control of the defense of any matter subject to indemnification at your expense, in which case you agree to cooperate with our defense of such claim.</p>
            </div>
        ),
    },
    {
        id: "disputes",
        title: "Dispute Resolution & Governing Law",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        accent: "text-cyan-300",
        dotColor: "bg-cyan-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles. Any dispute arising out of or related to these Terms or your use of the Platform will be resolved as follows:</p>
                <div className="space-y-3">
                    <ItemRow title="Informal resolution" desc="Before filing any legal claim, you agree to contact us at legal@fleetpulse.com with a written description of the dispute. We'll make a good-faith effort to resolve it within 30 days." />
                    <ItemRow title="Binding arbitration" desc="If informal resolution fails, disputes will be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. Arbitration will be conducted in Austin, Texas, or by videoconference for claims under $25,000." />
                    <ItemRow title="Class action waiver" desc="You waive any right to participate in a class action lawsuit or class-wide arbitration against FleetPulse. Claims must be brought individually." />
                    <ItemRow title="Exceptions" desc="Either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent misappropriation of intellectual property or unauthorized use of the Platform." />
                </div>
                <p>For customers located outside the United States, mandatory local laws may apply that override the above arbitration provisions. Nothing in these Terms is intended to limit rights that cannot be waived under applicable law.</p>
            </div>
        ),
    },
    {
        id: "general",
        title: "General Provisions",
        icon: (
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M4 6h12M4 10h8M4 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        accent: "text-slate-300",
        dotColor: "bg-slate-400",
        content: (
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <div className="space-y-3">
                    <ItemRow title="Entire agreement" desc="These Terms, together with our Privacy Policy and any signed enterprise agreements, constitute the entire agreement between you and FleetPulse regarding the Platform and supersede all prior agreements, representations, and understandings." />
                    <ItemRow title="Severability" desc="If any provision of these Terms is found to be invalid or unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will continue in full force and effect." />
                    <ItemRow title="Waiver" desc="Our failure to enforce any provision of these Terms on one occasion does not constitute a waiver of our right to enforce it on future occasions." />
                    <ItemRow title="Assignment" desc="You may not assign or transfer these Terms or your account without our prior written consent. FleetPulse may assign these Terms to an affiliate or in connection with a merger, acquisition, or sale of assets without your consent." />
                    <ItemRow title="Notices" desc="Legal notices to FleetPulse must be sent to: FleetPulse, Inc., 1801 E 6th Street, Suite 410, Austin, TX 78702, Attention: Legal Department. We will send notices to the email address on your account." />
                    <ItemRow title="Force majeure" desc="Neither party is liable for delays or failures caused by events outside its reasonable control, including natural disasters, government actions, internet or power failures, or labor disputes." />
                    <ItemRow title="Updates to Terms" desc="We may update these Terms periodically. Material changes will be communicated via email and in-app notice at least 14 days before taking effect. Continued use of the Platform after the effective date constitutes acceptance." />
                </div>
            </div>
        ),
    },
    {
        id: "contact-legal",
        title: "Contact — Legal",
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
                <p>Questions about these Terms of Service can be directed to our legal team:</p>
                <div className="glass rounded-xl p-5 border border-cyan-500/20 bg-cyan-500/4">
                    <div className="space-y-2.5 text-sm">
                        {[
                            ["Legal inquiries",  "legal@fleetpulse.com"],
                            ["Billing disputes", "billing@fleetpulse.com"],
                            ["Privacy matters",  "privacy@fleetpulse.com"],
                            ["Mailing address",  "FleetPulse, Inc.\n1801 E 6th Street, Suite 410\nAustin, TX 78702\nAttn: Legal Department"],
                        ].map(([label, value], i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-slate-500 w-32 flex-shrink-0">{label}</span>
                                <span className="text-slate-300 whitespace-pre-line">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-slate-500">
                    For technical support issues, please visit our <a href="/support" className="text-cyan-400 hover:underline">Support Center</a> rather than contacting the legal team.
                </p>
            </div>
        ),
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TermsOfServicePage() {
    const [activeSection, setActiveSection] = useState<string>("acceptance");
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
        );
        TOS_SECTIONS.forEach(s => {
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
                                Terms of Service
                            </h1>
                            <p className="text-slate-400 text-base leading-relaxed mb-6 max-w-2xl">
                                Please read these terms carefully before using FleetPulse. They govern your rights, obligations, and the scope of our services. Questions? Email <a href="mailto:legal@fleetpulse.com" className="text-cyan-300 hover:underline">legal@fleetpulse.com</a>.
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
                                    {TOS_SECTIONS.length} sections · ~15 min read
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
                            <div className="sticky top-24 space-y-0.5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">
                                    Contents
                                </div>
                                {TOS_SECTIONS.map((section) => (
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
                                        <span className="line-clamp-1">{section.title}</span>
                                    </button>
                                ))}
                                <div className="pt-4 border-t border-slate-800/60 mt-2 space-y-1">
                                    <a href="mailto:legal@fleetpulse.com" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-cyan-300 transition-colors">
                                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0">
                                            <rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1" />
                                            <path d="M1 3l5 4 5-4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                        </svg>
                                        legal@fleetpulse.com
                                    </a>
                                    <a href="/privacy" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-cyan-300 transition-colors">
                                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0">
                                            <path d="M6 1L2 3v3c0 2.5 1.9 4.2 4 4.8 2.1-.6 4-2.3 4-4.8V3L6 1z" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                        Privacy Policy
                                    </a>
                                </div>
                            </div>
                        </aside>

                        {/* ── ToS Content ────────────────────────────────── */}
                        <div className="flex-1 min-w-0 max-w-3xl">

                            {/* Key summary card */}
                            <div className="glass-strong rounded-2xl p-6 border border-amber-500/15 mb-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/4 rounded-full blur-[60px]" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Summary — What You're Agreeing To</span>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {[
                                            { icon: "⚖️", text: "You own your data. We license it solely to deliver the Platform." },
                                            { icon: "📋", text: "Compliance with FMCSA and DOT regulations is always your responsibility." },
                                            { icon: "💬", text: "Disputes are resolved by binding arbitration in Austin, TX." },
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
                                {TOS_SECTIONS.map((section) => (
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
                                        <div className="text-sm font-semibold text-white mb-0.5">Questions about these Terms?</div>
                                        <div className="text-xs text-slate-400">We're happy to explain anything in plain language before you sign up.</div>
                                    </div>
                                    <div className="flex gap-3 flex-shrink-0">
                                        <a
                                            href="mailto:legal@fleetpulse.com"
                                            className="btn-glow text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] px-5 py-2.5 rounded-lg whitespace-nowrap"
                                        >
                                            Email Legal Team
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