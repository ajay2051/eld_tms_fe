import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .st-root * { font-family: 'DM Sans', sans-serif; }
  .st-root h1,.st-root h2,.st-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes st-slide-up  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes st-fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes st-scale-in  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  @keyframes st-shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes st-ripple    { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
  @keyframes st-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes st-check     { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }
  @keyframes st-count     { from{stroke-dashoffset:0} to{stroke-dashoffset:113} }
  @keyframes st-spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes st-bar-fill  { from{width:0} to{width:var(--w)} }
  @keyframes st-pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.5} }

  .st-slide-up { animation: st-slide-up 0.55s ease-out forwards; }
  .st-fade-in  { animation: st-fade-in  0.5s  ease-out forwards; }
  .st-scale-in { animation: st-scale-in 0.4s  cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .st-float    { animation: st-float    4s    ease-in-out infinite; }
  .st-spin     { animation: st-spin     1s    linear infinite; }
  .st-pulse    { animation: st-pulse-dot 2s   ease-in-out infinite; }

  .st-d1{animation-delay:.05s;opacity:0} .st-d2{animation-delay:.12s;opacity:0}
  .st-d3{animation-delay:.19s;opacity:0} .st-d4{animation-delay:.26s;opacity:0}
  .st-d5{animation-delay:.33s;opacity:0} .st-d6{animation-delay:.40s;opacity:0}
  .st-d7{animation-delay:.47s;opacity:0} .st-d8{animation-delay:.54s;opacity:0}

  .st-shimmer {
    background: linear-gradient(90deg,#00e5cc 0%,#fff 45%,#00e5cc 90%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: st-shimmer 4s linear infinite;
  }

  /* Glass */
  .st-page { background: #040f16; }
  .st-glass-card {
    background: rgba(6,29,42,0.78);
    backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(0,229,204,0.16);
    box-shadow: 0 0 60px rgba(0,229,204,0.07), 0 32px 80px rgba(0,0,0,0.55);
  }
  .st-glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(0,229,204,0.12);
  }
  .st-glass-hover {
    transition: background .2s, border-color .2s, transform .2s, box-shadow .2s;
  }
  .st-glass-hover:hover {
    background: rgba(0,229,204,0.06);
    border-color: rgba(0,229,204,0.3);
    transform: translateY(-2px);
    box-shadow: 0 0 24px rgba(0,229,204,0.08);
  }

  /* Input */
  .st-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.16);
    color: white;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .st-input:focus {
    outline: none;
    border-color: rgba(0,229,204,0.5);
    background: rgba(0,229,204,0.04);
    box-shadow: 0 0 0 3px rgba(0,229,204,0.08);
  }
  .st-input::placeholder { color: rgba(148,163,184,.45); }
  .st-input-error { border-color: rgba(248,113,113,.6) !important; }
  .st-input option { background:#061d2a; color:#e2e8f0; }

  /* Plan card */
  .st-plan {
    border: 1.5px solid rgba(0,229,204,0.12);
    background: rgba(6,29,42,0.6);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    cursor: pointer;
    transition: border-color .2s, background .2s, transform .2s, box-shadow .2s;
    position: relative;
  }
  .st-plan:hover {
    border-color: rgba(0,229,204,0.32);
    transform: translateY(-2px);
    box-shadow: 0 0 24px rgba(0,229,204,0.08);
  }
  .st-plan-selected {
    border-color: #00e5cc !important;
    background: rgba(0,229,204,0.06) !important;
    box-shadow: 0 0 30px rgba(0,229,204,0.15) !important;
  }
  .st-plan-popular {
    border-color: rgba(0,229,204,0.35) !important;
  }

  /* Buttons */
  .st-btn-primary {
    background: linear-gradient(135deg,#00e5cc,#14b8a6);
    box-shadow: 0 0 22px rgba(0,229,204,0.38), inset 0 1px 0 rgba(255,255,255,.12);
    transition: box-shadow .2s, transform .2s;
  }
  .st-btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 38px rgba(0,229,204,0.55);
    transform: translateY(-1px);
  }
  .st-btn-primary:disabled { opacity:.45; cursor:not-allowed; }

  .st-btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.14);
    transition: background .2s, border-color .2s, transform .15s;
  }
  .st-btn-ghost:hover {
    background: rgba(0,229,204,0.08);
    border-color: rgba(0,229,204,0.38);
    transform: translateY(-1px);
  }

  /* Step indicator */
  .st-step-dot {
    transition: background .3s, border-color .3s, transform .3s;
  }
  .st-step-line {
    transition: background .5s ease;
  }

  /* Check path animation */
  .st-check-path {
    stroke-dasharray: 40; stroke-dashoffset: 40;
    animation: st-check 0.45s ease-out 0.2s forwards;
  }

  /* Countdown ring */
  .st-count-ring {
    animation: st-count 5s linear forwards;
  }

  /* Ripple */
  .st-ripple {
    position:absolute; inset:0; border-radius:50%;
    border:1.5px solid rgba(0,229,204,.4);
    animation: st-ripple 2.2s ease-out infinite;
  }
  .st-ripple:nth-child(2){animation-delay:.75s;}
  .st-ripple:nth-child(3){animation-delay:1.5s;}

  /* Grid bg */
  .st-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,.025) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,229,204,.025) 1px,transparent 1px);
    background-size:56px 56px;
  }

  /* Scrollbar */
  .st-scroll::-webkit-scrollbar{width:4px}
  .st-scroll::-webkit-scrollbar-track{background:transparent}
  .st-scroll::-webkit-scrollbar-thumb{background:rgba(0,229,204,.18);border-radius:4px}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanKey = "starter" | "professional" | "enterprise";
type FleetSize = "1-5" | "6-20" | "21-50" | "51-100" | "100+";
type Step = 1 | 2 | 3;

interface Plan {
    key:       PlanKey;
    name:      string;
    price:     string;
    period:    string;
    desc:      string;
    popular:   boolean;
    accentColor: string;
    features:  string[];
    limits:    string;
}

interface FormState {
    company_name:  string;
    fleet_size:    FleetSize | "";
    phone:         string;
    first_name:    string;
    last_name:     string;
    email:         string;
    password:      string;
    agree_terms:   boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
    {
        key: "starter",
        name: "Starter",
        price: "Free",
        period: "14 days",
        desc: "Perfect for small owner-operators getting started.",
        popular: false,
        accentColor: "#60a5fa",
        limits: "Up to 5 trucks",
        features: [
            "Live GPS tracking",
            "FMCSA-certified ELD",
            "Basic HOS logging",
            "Email support",
            "1 admin account",
        ],
    },
    {
        key: "professional",
        name: "Professional",
        price: "$49",
        period: "per truck / month",
        desc: "For growing fleets that need full compliance and dispatch.",
        popular: true,
        accentColor: "#00e5cc",
        limits: "Up to 50 trucks",
        features: [
            "Everything in Starter",
            "Dispatch automation",
            "Load board integration",
            "Driver scorecards",
            "Maintenance alerts",
            "Priority support",
            "5 admin accounts",
        ],
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: "Custom",
        period: "contact us",
        desc: "For large fleets needing custom integrations and SLA.",
        popular: false,
        accentColor: "#a78bfa",
        limits: "Unlimited trucks",
        features: [
            "Everything in Professional",
            "Dedicated account manager",
            "Custom API integrations",
            "SSO / SAML login",
            "Custom SLA (99.9%)",
            "On-premise deployment option",
            "Unlimited admins",
        ],
    },
];

const FLEET_SIZES: { value: FleetSize; label: string }[] = [
    { value: "1-5",    label: "1–5 trucks (Owner-Operator)" },
    { value: "6-20",   label: "6–20 trucks (Small Fleet)" },
    { value: "21-50",  label: "21–50 trucks (Mid-size Fleet)" },
    { value: "51-100", label: "51–100 trucks (Large Fleet)" },
    { value: "100+",   label: "100+ trucks (Enterprise)" },
];

const STEPS = [
    { n: 1 as Step, label: "Choose Plan" },
    { n: 2 as Step, label: "Fleet Info" },
    { n: 3 as Step, label: "Your Account" },
];

const TRIAL_BENEFITS = [
    "No credit card required",
    "Full platform access for 14 days",
    "FMCSA-certified ELD included",
    "Cancel anytime, no questions asked",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ErrorMsg({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
            <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0">
                <circle cx="6" cy="6" r="5" stroke="#f87171" strokeWidth="1.2"/>
                <path d="M6 4v3M6 8.5v.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {msg}
        </p>
    );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
        </label>
    );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
    return (
        <div className="flex items-center justify-center gap-0 mb-10">
            {STEPS.map((s, i) => {
                const done   = s.n < current;
                const active = s.n === current;
                return (
                    <div key={s.n} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={`st-step-dot w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                done   ? "bg-cyan-500 border-cyan-500 text-[#040f16]" :
                                    active ? "bg-transparent border-cyan-400 text-cyan-400 shadow-[0_0_16px_rgba(0,229,204,.4)]" :
                                        "bg-transparent border-slate-700 text-slate-600"
                            }`}>
                                {done ? (
                                    <svg viewBox="0 0 12 12" className="w-3.5 h-3.5">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : s.n}
                            </div>
                            <span className={`text-[10px] font-medium whitespace-nowrap ${
                                active ? "text-cyan-300" : done ? "text-slate-400" : "text-slate-600"
                            }`}>
                {s.label}
              </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`st-step-line h-px w-16 sm:w-24 mx-2 mb-5 ${
                                s.n < current ? "bg-cyan-500/50" : "bg-slate-800"
                            }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({
                      plan, selected, onSelect,
                  }: { plan: Plan; selected: boolean; onSelect: () => void }) {
    return (
        <div
            onClick={onSelect}
            className={`st-plan p-5 select-none ${selected ? "st-plan-selected" : ""} ${plan.popular && !selected ? "st-plan-popular" : ""}`}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full text-[#040f16]"
                style={{ background:"linear-gradient(135deg,#00e5cc,#14b8a6)", boxShadow:"0 0 14px rgba(0,229,204,.4)" }}>
            MOST POPULAR
          </span>
                </div>
            )}

            {/* Selection indicator */}
            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                selected ? "bg-cyan-500 border-cyan-500" : "border-slate-600"
            }`}>
                {selected && (
                    <svg viewBox="0 0 10 10" className="w-3 h-3">
                        <path d="M2 5l2 2 4-4" stroke="#040f16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )}
            </div>

            {/* Accent dot */}
            <div className="w-2.5 h-2.5 rounded-full mb-4" style={{ background: plan.accentColor, boxShadow:`0 0 10px ${plan.accentColor}80` }} />

            <h3 style={{ fontFamily:"'Syne',sans-serif", color: selected ? plan.accentColor : "white" }}
                className="text-lg font-700 mb-0.5">{plan.name}</h3>
            <p className="text-slate-500 text-xs mb-4">{plan.desc}</p>

            {/* Price */}
            <div className="mb-4">
                <span style={{ fontFamily:"'Syne',sans-serif" }} className="text-3xl font-800 text-white">{plan.price}</span>
                <span className="text-xs text-slate-500 ml-1.5">{plan.period}</span>
            </div>

            {/* Limit badge */}
            <div className="text-[10px] font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1 mb-4"
                 style={{ background:`${plan.accentColor}15`, color: plan.accentColor, border:`1px solid ${plan.accentColor}30` }}>
                <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                    <path d="M1 6h11l-2 3.5V10H3V9.5L1 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M6 3V1M4 3.5L2.5 2M8 3.5L9.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {plan.limits}
            </div>

            {/* Features */}
            <ul className="space-y-2">
                {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                        <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: plan.accentColor }}>
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ─── Countdown ring (success page) ───────────────────────────────────────────

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
    const r = 18;
    const circ = 2 * Math.PI * r;
    return (
        <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
            <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(0,229,204,0.12)" strokeWidth="2.5"/>
            <circle cx="22" cy="22" r={r} fill="none" stroke="#00e5cc" strokeWidth="2.5"
                    strokeLinecap="round" strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - seconds / total)}
                    style={{ transition:"stroke-dashoffset 1s linear" }}
            />
            <text x="22" y="22" textAnchor="middle" dominantBaseline="central" fontSize="13"
                  fontWeight="700" fill="#00e5cc"
                  style={{ transform:"rotate(90deg)", transformOrigin:"22px 22px", fontFamily:"'Syne',sans-serif" }}>
                {seconds}
            </text>
        </svg>
    );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({
                          plan, firstName, countdown,
                      }: { plan: Plan; firstName: string; countdown: number }) {
    return (
        <div className="st-scale-in text-center py-4">
            {/* Icon */}
            <div className="flex justify-center mb-7">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="st-ripple" />
                    <div className="st-ripple" />
                    <div className="st-ripple" />
                    <div className="relative z-10 w-20 h-20 rounded-full bg-cyan-500/15 border-2 border-cyan-500/40 flex items-center justify-center"
                         style={{ boxShadow:"0 0 30px rgba(0,229,204,0.2)" }}>
                        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                            <path className="st-check-path" d="M10 20l7 7 13-14"
                                  stroke="#00e5cc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="inline-flex items-center gap-2 st-glass rounded-full px-3 py-1.5 text-xs font-medium text-cyan-300 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 st-pulse" />
                Trial activated
            </div>

            <h2 style={{ fontFamily:"'Syne',sans-serif" }} className="text-2xl font-700 text-white mb-2">
                Welcome to FleetPulse{firstName ? `, ${firstName}` : ""}!
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-2">
                Your <span className="text-cyan-300 font-medium">{plan.name}</span> 14-day free trial is ready.
            </p>
            <p className="text-slate-500 text-xs mb-7">
                Check your inbox to verify your email and activate your account.
            </p>

            {/* What's next */}
            <div className="st-glass rounded-2xl p-5 mb-7 text-left space-y-3.5">
                {[
                    "Verify your email to activate the account",
                    "Log in and set up your first route",
                    "Add your trucks and drivers",
                    "Start logging HOS with our ELD",
                ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/35 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-cyan-400 mt-0.5">
              {i + 1}
            </span>
                        <span className="text-sm text-slate-300">{step}</span>
                    </div>
                ))}
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-3">
                <CountdownRing seconds={countdown} total={5} />
                <p className="text-sm text-slate-400 text-left">
                    Redirecting to<br/>
                    <span className="text-slate-200">login page</span> automatically…
                </p>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StartTrial() {
    const navigate = useNavigate();

    const [step,       setStep]       = useState<Step>(1);
    const [selectedPlan, setPlan]     = useState<PlanKey>("professional");
    const [form,       setForm]       = useState<FormState>({
        company_name: "", fleet_size: "", phone: "",
        first_name: "", last_name: "", email: "",
        password: "", agree_terms: false,
    });
    const [errors,     setErrors]     = useState<FormErrors>({});
    const [loading,    setLoading]    = useState(false);
    const [success]    = useState(false);
    const [countdown,  setCountdown]  = useState(5);
    const [showPw,     setShowPw]     = useState(false);

    // Style injection
    useEffect(() => {
        const id = "st-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id; tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    // Countdown redirect after success
    useEffect(() => {
        if (!success) return;
        if (countdown <= 0) { navigate("/login"); return; }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [success, countdown, navigate]);

    const plan = PLANS.find(p => p.key === selectedPlan)!;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setForm(prev => ({ ...prev, [name]: val }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // ── Per-step validation ───────────────────────────────────────────────────

    const validateStep2 = (): boolean => {
        const errs: FormErrors = {};
        if (!form.company_name.trim()) errs.company_name = "Company name is required.";
        else if (form.company_name.length > 50) errs.company_name = "Company name must be at most 50 characters.";
        if (!form.fleet_size) errs.fleet_size = "Please select your fleet size.";
        if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) errs.phone = "Enter a valid phone number.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep3 = (): boolean => {
        const errs: FormErrors = {};
        if (!form.first_name.trim()) errs.first_name = "First name is required.";
        else if (form.first_name.length > 20) errs.first_name = "Max 20 characters.";
        if (!form.last_name.trim()) errs.last_name = "Last name is required.";
        else if (form.last_name.length > 20) errs.last_name = "Max 20 characters.";
        if (!form.email.trim()) errs.email = "Email is required.";
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) errs.email = "Enter a valid email.";
        if (!form.password) errs.password = "Password is required.";
        else if (form.password.length < 8 || form.password.length > 16) errs.password = "Password must be 8–16 characters.";
        else if (!/[A-Z]/.test(form.password)) errs.password = "Password needs at least one uppercase letter.";
        else if (!/[^A-Za-z0-9]/.test(form.password)) errs.password = "Password needs at least one special character.";
        if (!form.agree_terms) errs.agree_terms = "You must accept the terms to continue.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        if (step === 1) { setStep(2); return; }
        if (step === 2 && validateStep2()) { setStep(3); return; }
    };

    const handleBack = () => {
        if (step > 1) setStep((step - 1) as Step);
        setErrors({});
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateStep3()) return;

        setLoading(true);
        // Simulate a short delay (replace with actual API call if needed)
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);

        // Navigate to register with pre-filled data via state
        // so the user doesn't have to retype everything
        navigate("/register", {
            state: {
                prefill: {
                    first_name:   form.first_name,
                    last_name:    form.last_name,
                    email:        form.email,
                    password:     form.password,
                    plan:         selectedPlan,
                    company_name: form.company_name,
                    fleet_size:   form.fleet_size,
                },
            },
        });
    };

    const inputCls = (f: keyof FormErrors) =>
        `st-input w-full rounded-xl px-3.5 py-3 text-sm ${errors[f] ? "st-input-error" : ""}`;

    return (
        <div className="st-root st-page min-h-screen text-white overflow-x-hidden">
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-140px] right-[-80px]  w-[500px] h-[500px] rounded-full bg-cyan-500/6  blur-[110px]" />
                <div className="absolute bottom-[-120px] left-[-80px] w-[420px] h-[420px] rounded-full bg-teal-500/5  blur-[90px]"  />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/3 blur-[140px]" />
                <div className="st-grid-bg absolute inset-0" />
            </div>

            {/* ── Header ──────────────────────────────────────────────────────────── */}
            <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-5">
                {/*<Logo onClick={() => navigate("/")} />*/}
                {/*<div className="flex items-center gap-4">*/}
                {/*    <span className="text-xs text-slate-500 hidden sm:block">Already have an account?</span>*/}
                {/*    <button*/}
                {/*        onClick={() => navigate("/login")}*/}
                {/*        className="st-btn-ghost rounded-xl px-4 py-2 text-sm text-slate-300 font-medium"*/}
                {/*    >*/}
                {/*        Sign in*/}
                {/*    </button>*/}
                {/*</div>*/}
            </header>

            {/* ── Main ────────────────────────────────────────────────────────────── */}
            <main className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-20 pt-6">

                {!success ? (
                    <>
                        {/* Page heading */}
                        <div className="st-slide-up st-d1 text-center mb-8">
                            <div className="inline-flex items-center gap-2 st-glass rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 st-pulse" />
                                14-Day Free Trial — No Credit Card Required
                            </div>
                            <h1 style={{ fontFamily:"'Syne',sans-serif" }}
                                className="text-4xl sm:text-5xl font-800 leading-tight mb-3">
                                <span className="text-white">Start your free</span><br/>
                                <span className="st-shimmer">14-day trial today</span>
                            </h1>
                            <p className="text-slate-400 text-base max-w-xl mx-auto">
                                Full access to FleetPulse — GPS tracking, ELD compliance, dispatch automation, and more.
                                Cancel anytime.
                            </p>
                        </div>

                        {/* Trial benefits bar */}
                        <div className="st-slide-up st-d2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10">
                            {TRIAL_BENEFITS.map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                    <svg viewBox="0 0 12 12" className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    {b}
                                </div>
                            ))}
                        </div>

                        {/* Step indicator */}
                        <div className="st-slide-up st-d3">
                            <StepIndicator current={step} />
                        </div>

                        {/* ── Step 1: Plan selection ───────────────────────────────────── */}
                        {step === 1 && (
                            <div className="st-fade-in">
                                <h2 style={{ fontFamily:"'Syne',sans-serif" }} className="text-xl font-700 text-white text-center mb-6">
                                    Choose your plan
                                </h2>
                                <div className="grid sm:grid-cols-3 gap-5 mb-8">
                                    {PLANS.map(p => (
                                        <PlanCard
                                            key={p.key}
                                            plan={p}
                                            selected={selectedPlan === p.key}
                                            onSelect={() => setPlan(p.key)}
                                        />
                                    ))}
                                </div>
                                <div className="text-center">
                                    <button
                                        onClick={handleNext}
                                        className="st-btn-primary rounded-xl px-12 py-3.5 text-sm font-semibold text-[#040f16] inline-flex items-center gap-2"
                                    >
                                        Continue with {plan.name}
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                            <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <p className="mt-3 text-xs text-slate-500">
                                        You can change your plan anytime during or after the trial.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Step 2: Fleet info ───────────────────────────────────────── */}
                        {step === 2 && (
                            <div className="st-fade-in max-w-lg mx-auto">
                                <div className="st-glass-card rounded-3xl p-7 sm:p-9">
                                    {/* Selected plan reminder */}
                                    <div className="flex items-center gap-3 st-glass rounded-xl px-4 py-3 mb-7">
                                        <div className="w-2 h-2 rounded-full" style={{ background: plan.accentColor }} />
                                        <span className="text-sm text-slate-300">
                      Plan: <span className="font-medium" style={{ color: plan.accentColor }}>{plan.name}</span>
                    </span>
                                        <button onClick={() => setStep(1)} className="ml-auto text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                                            Change
                                        </button>
                                    </div>

                                    <h2 style={{ fontFamily:"'Syne',sans-serif" }} className="text-xl font-700 text-white mb-6">
                                        Tell us about your fleet
                                    </h2>

                                    <div className="space-y-5">
                                        {/* Company name */}
                                        <div>
                                            <FieldLabel label="Company Name" required />
                                            <input type="text" name="company_name" value={form.company_name}
                                                   onChange={handleChange} placeholder="Acme Trucking LLC"
                                                   maxLength={50} className={inputCls("company_name")} />
                                            <ErrorMsg msg={errors.company_name} />
                                        </div>

                                        {/* Fleet size */}
                                        <div>
                                            <FieldLabel label="Fleet Size" required />
                                            <div className="relative">
                                                <select name="fleet_size" value={form.fleet_size}
                                                        onChange={handleChange}
                                                        className={`${inputCls("fleet_size")} appearance-none cursor-pointer`}>
                                                    <option value="" disabled>Select fleet size…</option>
                                                    {FLEET_SIZES.map(s => (
                                                        <option key={s.value} value={s.value}>{s.label}</option>
                                                    ))}
                                                </select>
                                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </span>
                                            </div>
                                            <ErrorMsg msg={errors.fleet_size} />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <FieldLabel label="Phone Number" />
                                            <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                            <path d="M4 4l3.5 1L9 8 7 10s2 4 3 5l2-2 3 1.5L16 17c-7 1-14-6-12-13z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                          </svg>
                        </span>
                                                <input type="tel" name="phone" value={form.phone}
                                                       onChange={handleChange} placeholder="+1 (555) 000-0000"
                                                       className={`${inputCls("phone")} pl-10`} />
                                            </div>
                                            <ErrorMsg msg={errors.phone} />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-7">
                                        <button onClick={handleBack}
                                                className="st-btn-ghost flex-1 rounded-xl py-3 text-sm text-slate-300">
                                            Back
                                        </button>
                                        <button onClick={handleNext}
                                                className="st-btn-primary flex-1 rounded-xl py-3 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2">
                                            Continue
                                            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                                                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Step 3: Account details ──────────────────────────────────── */}
                        {step === 3 && (
                            <div className="st-fade-in max-w-lg mx-auto">
                                <div className="st-glass-card rounded-3xl p-7 sm:p-9">
                                    {/* Plan + company reminder */}
                                    <div className="flex items-center gap-3 st-glass rounded-xl px-4 py-3 mb-7">
                                        <div className="w-2 h-2 rounded-full" style={{ background: plan.accentColor }} />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs text-slate-400">{plan.name} plan</span>
                                            {form.company_name && (
                                                <span className="text-xs text-slate-500 ml-2">· {form.company_name}</span>
                                            )}
                                        </div>
                                        <button onClick={() => setStep(1)} className="text-xs text-slate-600 hover:text-cyan-400 transition-colors">
                                            Edit
                                        </button>
                                    </div>

                                    <h2 style={{ fontFamily:"'Syne',sans-serif" }} className="text-xl font-700 text-white mb-6">
                                        Create your account
                                    </h2>

                                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                        {/* Name row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <FieldLabel label="First Name" required />
                                                <input type="text" name="first_name" value={form.first_name}
                                                       onChange={handleChange} placeholder="John" maxLength={20}
                                                       autoComplete="given-name" className={inputCls("first_name")} />
                                                <ErrorMsg msg={errors.first_name} />
                                            </div>
                                            <div>
                                                <FieldLabel label="Last Name" required />
                                                <input type="text" name="last_name" value={form.last_name}
                                                       onChange={handleChange} placeholder="Doe" maxLength={20}
                                                       autoComplete="family-name" className={inputCls("last_name")} />
                                                <ErrorMsg msg={errors.last_name} />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <FieldLabel label="Work Email" required />
                                            <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                            <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                            <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                          </svg>
                        </span>
                                                <input type="email" name="email" value={form.email}
                                                       onChange={handleChange} placeholder="john@company.com"
                                                       autoComplete="email" className={`${inputCls("email")} pl-10`} />
                                            </div>
                                            <ErrorMsg msg={errors.email} />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <FieldLabel label="Password" required />
                                            <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                            <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                            <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          </svg>
                        </span>
                                                <input type={showPw ? "text" : "password"} name="password"
                                                       value={form.password} onChange={handleChange}
                                                       placeholder="••••••••" maxLength={16} autoComplete="new-password"
                                                       className={`${inputCls("password")} pl-10 pr-11`} />
                                                <button type="button" onClick={() => setShowPw(v => !v)}
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 transition-colors">
                                                    {showPw ? (
                                                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                                                            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                                                            <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                                        </svg>
                                                    ) : (
                                                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                                                            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="mt-1 text-[10px] text-slate-600">8–16 chars, one uppercase, one special character</p>
                                            <ErrorMsg msg={errors.password} />
                                        </div>

                                        {/* Terms */}
                                        <div>
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" id="agree_terms" name="agree_terms"
                                                       checked={form.agree_terms} onChange={handleChange}
                                                       className="w-4 h-4 mt-0.5 rounded border border-cyan-500/30 bg-transparent accent-cyan-400 cursor-pointer flex-shrink-0" />
                                                <label htmlFor="agree_terms" className="text-xs text-slate-400 cursor-pointer leading-relaxed">
                                                    I agree to the{" "}
                                                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Service</a>
                                                    {" "}and{" "}
                                                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>.
                                                    FleetPulse may contact me about my account.
                                                </label>
                                            </div>
                                            <ErrorMsg msg={errors.agree_terms} />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 pt-1">
                                            <button type="button" onClick={handleBack}
                                                    className="st-btn-ghost flex-1 rounded-xl py-3 text-sm text-slate-300">
                                                Back
                                            </button>
                                            <button type="submit" disabled={loading}
                                                    className="st-btn-primary flex-1 rounded-xl py-3 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2">
                                                {loading ? (
                                                    <>
                                                        <svg className="w-4 h-4 st-spin" viewBox="0 0 24 24" fill="none">
                                                            <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.2)" strokeWidth="3"/>
                                                            <path d="M12 2a10 10 0 0110 10" stroke="#040f16" strokeWidth="3" strokeLinecap="round"/>
                                                        </svg>
                                                        Setting up…
                                                    </>
                                                ) : (
                                                    <>
                                                        Start Free Trial
                                                        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                                                            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Trust signals */}
                                <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                                    {[
                                        { icon:"🔒", label:"256-bit SSL encryption" },
                                        { icon:"🏛", label:"FMCSA certified" },
                                        { icon:"⭐", label:"4.9/5 carrier rating" },
                                    ].map(s => (
                                        <div key={s.label} className="flex items-center gap-1.5 text-xs text-slate-600">
                                            <span>{s.icon}</span>{s.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* ── Success ─────────────────────────────────────────────────────── */
                    <div className="max-w-md mx-auto">
                        <div className="st-glass-card rounded-3xl p-8">
                            <SuccessState
                                plan={plan}
                                firstName={form.first_name}
                                countdown={countdown}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}