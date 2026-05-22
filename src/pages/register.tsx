import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .rp-root * { font-family: 'DM Sans', sans-serif; }
  .rp-root h1, .rp-root h2, .rp-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes rp-slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rp-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes rp-scale-in {
    from { opacity: 0; transform: scale(0.75); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes rp-ripple {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes rp-check-draw {
    from { stroke-dashoffset: 40; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes rp-countdown {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: 126; }
  }
  @keyframes rp-glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(0,229,204,0.2); }
    50%       { box-shadow: 0 0 40px rgba(0,229,204,0.45); }
  }
  @keyframes rp-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .rp-slide-up  { animation: rp-slide-up 0.55s ease-out forwards; }
  .rp-fade-in   { animation: rp-fade-in  0.7s  ease-out forwards; }
  .rp-scale-in  { animation: rp-scale-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  .rp-d1  { animation-delay: 0.05s;  opacity: 0; }
  .rp-d2  { animation-delay: 0.12s;  opacity: 0; }
  .rp-d3  { animation-delay: 0.19s;  opacity: 0; }
  .rp-d4  { animation-delay: 0.26s;  opacity: 0; }
  .rp-d5  { animation-delay: 0.33s;  opacity: 0; }
  .rp-d6  { animation-delay: 0.40s;  opacity: 0; }
  .rp-d7  { animation-delay: 0.47s;  opacity: 0; }
  .rp-d8  { animation-delay: 0.54s;  opacity: 0; }
  .rp-d9  { animation-delay: 0.61s;  opacity: 0; }
  .rp-d10 { animation-delay: 0.68s;  opacity: 0; }

  .rp-ripple-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(0,229,204,0.4);
    animation: rp-ripple 2.2s ease-out infinite;
  }
  .rp-ripple-ring:nth-child(2) { animation-delay: 0.7s; }
  .rp-ripple-ring:nth-child(3) { animation-delay: 1.4s; }

  .rp-check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: rp-check-draw 0.45s ease-out 0.25s forwards;
  }

  .rp-glass-card {
    background: rgba(6, 29, 42, 0.75);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(0, 229, 204, 0.18);
    box-shadow: 0 0 60px rgba(0,229,204,0.07), 0 32px 80px rgba(0,0,0,0.55);
  }
  .rp-glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(0,229,204,0.13);
  }

  .rp-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.18);
    color: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .rp-input:focus {
    outline: none;
    border-color: rgba(0,229,204,0.55);
    background: rgba(0,229,204,0.04);
    box-shadow: 0 0 0 3px rgba(0,229,204,0.08);
  }
  .rp-input::placeholder { color: rgba(148,163,184,0.5); }
  .rp-input-error { border-color: rgba(248,113,113,0.6) !important; }

  /* Style native select to match inputs */
  .rp-input option {
    background: #061d2a;
    color: #e2e8f0;
  }

  .rp-btn-primary {
    background: linear-gradient(135deg, #00e5cc, #14b8a6);
    box-shadow: 0 0 22px rgba(0,229,204,0.38), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .rp-btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 38px rgba(0,229,204,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }
  .rp-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .rp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .rp-progress-ring {
    animation: rp-countdown 5s linear forwards;
  }

  .rp-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,204,0.03) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  .rp-strength-bar {
    transition: width 0.3s ease, background-color 0.3s ease;
  }

  /* Password strength indicator colors */
  .rp-strength-weak   { background-color: #f87171; }
  .rp-strength-fair   { background-color: #fb923c; }
  .rp-strength-good   { background-color: #facc15; }
  .rp-strength-strong { background-color: #34d399; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const SPECIAL_CHARS = new Set("@_!#$%^&*()<>?/\\|}{~:");
const REDIRECT_AFTER = 5;

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "driver" | "admin" | "";

interface FormState {
    first_name: string;
    last_name:  string;
    email:      string;
    password:   string;
    confirm_password: string;
    country:    string;
    role:       Role;
    passport:   string;
}

type FormErrors = Partial<Record<keyof FormState | "api", string>>;

// ─── Validation (mirrors Django serializer exactly) ───────────────────────────

function validateField(name: keyof FormState, value: string, form: FormState): string {
    switch (name) {

        case "first_name":
            if (!value.trim()) return "First name is required.";
            if (value.length > 20) return "First name must be at most 20 characters long.";
            if ([...value].some((c) => SPECIAL_CHARS.has(c))) return "First name must contain only letters.";
            return "";

        case "last_name":
            if (!value.trim()) return "Last name is required.";
            if (value.length > 20) return "Last name must be at most 20 characters long.";
            if ([...value].some((c) => SPECIAL_CHARS.has(c))) return "Last name must contain only letters.";
            return "";

        case "email": {
            if (!value.trim()) return "Email is required.";
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!pattern.test(value)) return "Please enter a valid email address.";
            if (value.length > 50) return "Email must be at most 50 characters long.";
            return "";
        }

        case "password":
            if (!value) return "Password is required.";
            if (value.length < 8 || value.length > 16) return "Password must be 8 to 16 characters long.";
            if (![...value].some((c) => c >= "A" && c <= "Z")) return "Password must contain at least one uppercase letter.";
            if (![...value].some((c) => SPECIAL_CHARS.has(c))) return "Password must contain at least one special character.";
            return "";

        case "confirm_password":
            if (!value) return "Please confirm your password.";
            if (value !== form.password) return "Passwords do not match.";
            return "";

        case "country":
            if (!value.trim()) return "Country is required.";
            return "";

        case "role":
            if (!value) return "Please select a role.";
            return "";

        case "passport":
            if (!value) return "";  // optional field
            if (value.length > 30) return "Passport must be at most 30 characters long.";
            if ([...value].some((c) => SPECIAL_CHARS.has(c))) return "Passport must not contain any special characters.";
            return "";

        default:
            return "";
    }
}

function validateAll(form: FormState): FormErrors {
    const errs: FormErrors = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
        const msg = validateField(key, form[key], form);
        if (msg) errs[key] = msg;
    });
    return errs;
}

// ─── Password strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string): { score: number; label: string; className: string } {
    if (!password) return { score: 0, label: "", className: "" };
    let score = 0;
    if (password.length >= 8)  score++;
    if (password.length >= 12) score++;
    if ([...password].some((c) => c >= "A" && c <= "Z")) score++;
    if ([...password].some((c) => c >= "0" && c <= "9")) score++;
    if ([...password].some((c) => SPECIAL_CHARS.has(c))) score++;

    if (score <= 1) return { score: 1, label: "Weak",   className: "rp-strength-weak" };
    if (score === 2) return { score: 2, label: "Fair",   className: "rp-strength-fair" };
    if (score === 3) return { score: 3, label: "Good",   className: "rp-strength-good" };
    return           { score: 4, label: "Strong", className: "rp-strength-strong" };
}

// ─── Countdown ring ───────────────────────────────────────────────────────────

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
    const r = 18;
    const circumference = 2 * Math.PI * r;
    const dashoffset = circumference * (1 - seconds / total);

    return (
        <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
            <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(0,229,204,0.12)" strokeWidth="2.5" />
            <circle
                cx="22" cy="22" r={r}
                fill="none"
                stroke="#00e5cc"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
            />
            <text
                x="22" y="22"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="700"
                fill="#00e5cc"
                style={{ transform: "rotate(90deg)", transformOrigin: "22px 22px", fontFamily: "'Syne',sans-serif" }}
            >
                {seconds}
            </text>
        </svg>
    );
}

// ─── Input field wrapper ──────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    hint?: string;
}

function Field({ label, error, required, children, hint }: FieldProps) {
    return (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
            </label>
            {children}
            {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
            {error && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0">
                        <circle cx="6" cy="6" r="5" stroke="#f87171" strokeWidth="1.2" />
                        <path d="M6 4v3M6 8.5v.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function InputIcon({ children }: { children: React.ReactNode }) {
    return (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
      {children}
    </span>
    );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessCard({ countdown }: { countdown: number }) {
    return (
        <div className="rp-scale-in text-center px-2 py-4">
            {/* Check icon with ripple */}
            <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="rp-ripple-ring" />
                    <div className="rp-ripple-ring" />
                    <div className="rp-ripple-ring" />
                    <div className="relative z-10 w-20 h-20 rounded-full bg-cyan-500/15 border-2 border-cyan-500/40 flex items-center justify-center"
                         style={{ boxShadow: "0 0 30px rgba(0,229,204,0.2)" }}>
                        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                            <path
                                className="rp-check-path"
                                d="M10 20l7 7 13-14"
                                stroke="#00e5cc"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="inline-flex items-center gap-2 rp-glass rounded-full px-3 py-1 text-xs font-medium text-cyan-300 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Registration successful
            </div>

            <h2 style={{ fontFamily: "'Syne',sans-serif" }} className="text-2xl font-700 text-white mb-2">
                Account created!
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                We've sent a verification email to your inbox.
                Please check your email and click the link to activate your account.
            </p>

            {/* Steps */}
            <div className="rp-glass rounded-xl p-4 mb-6 text-left space-y-2.5">
                {[
                    "Account registered successfully",
                    "Verification email sent",
                    "Click the link in your email to activate",
                ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/35 flex items-center justify-center flex-shrink-0">
                            <svg viewBox="0 0 12 12" className="w-3 h-3">
                                <path d="M2 6l3 3 5-5" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-sm text-slate-300">{step}</span>
                    </div>
                ))}
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-3">
                <CountdownRing seconds={countdown} total={REDIRECT_AFTER} />
                <p className="text-sm text-slate-400 text-left">
                    Redirecting to<br />
                    <span className="text-slate-300">login page</span> automatically…
                </p>
            </div>
        </div>
    );
}

// ─── Main Register Form ───────────────────────────────────────────────────────

const EMPTY_FORM: FormState = {
    first_name:       "",
    last_name:        "",
    email:            "",
    password:         "",
    confirm_password: "",
    country:          "",
    role:             "",
    passport:         "",
};

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form,            setForm]            = useState<FormState>(EMPTY_FORM);
    const [errors,          setErrors]          = useState<FormErrors>({});
    const [showPassword,    setShowPassword]    = useState<boolean>(false);
    const [showConfirm,     setShowConfirm]     = useState<boolean>(false);
    const [loading,         setLoading]         = useState<boolean>(false);
    const [success,         setSuccess]         = useState<boolean>(false);
    const [countdown,       setCountdown]       = useState<number>(REDIRECT_AFTER);

    // Style injection
    useEffect(() => {
        const id = "fleetpulse-rp-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    // Auto-redirect countdown after success
    useEffect(() => {
        if (!success) return;
        if (countdown <= 0) { navigate("/login"); return; }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [success, countdown, navigate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Live-clear field error on change
        const msg = validateField(name as keyof FormState, value, { ...form, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: msg || undefined, api: undefined }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errs = validateAll(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setLoading(true);
        setErrors({});

        try {
            await axios.post(`${API_BASE_URL}/auth/create_users/`, {
                first_name: form.first_name,
                last_name:  form.last_name,
                email:      form.email,
                password:   form.password,
                country:    form.country,
                role:       form.role,
                passport:   form.passport || undefined,
            });

            setSuccess(true);

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;

                // Django REST Framework returns field errors as { field: ["msg"] }
                if (data && typeof data === "object") {
                    const fieldErrs: FormErrors = {};
                    let hasFieldError = false;

                    (Object.keys(data) as (keyof FormErrors)[]).forEach((key) => {
                        const val = (data as Record<string, unknown>)[key as string];
                        if (Array.isArray(val)) {
                            fieldErrs[key] = val[0] as string;
                            hasFieldError = true;
                        } else if (typeof val === "string") {
                            fieldErrs[key] = val;
                            hasFieldError = true;
                        }
                    });

                    if (hasFieldError) {
                        setErrors(fieldErrs);
                    } else {
                        setErrors({ api: data?.message ?? "Something went wrong. Please try again." });
                    }
                } else {
                    setErrors({ api: "Unable to connect to the server. Please try again." });
                }
            } else {
                setErrors({ api: "An unexpected error occurred." });
            }
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength(form.password);

    const inputBase = (hasError?: boolean) =>
        `rp-input w-full rounded-xl py-3 text-sm ${hasError ? "rp-input-error" : ""}`;

    return (
        <div className="rp-root min-h-screen bg-[#040f16] text-white overflow-x-hidden flex items-center justify-center px-4 py-12">

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/6  blur-[110px]" />
                <div className="absolute bottom-[-140px] left-[-80px]  w-[420px] h-[420px] rounded-full bg-teal-500/5  blur-[90px]"  />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/3 blur-[140px]" />
                <div className="rp-grid-bg absolute inset-0" />
            </div>

            {/* Card */}
            <div className="rp-glass-card relative rounded-3xl w-full max-w-2xl my-4">
                {/* Top glow strip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full" />

                <div className="px-8 py-10 sm:px-10 sm:py-12">

                    {/* Logo */}
                    <div className="rp-slide-up rp-d1 flex items-center gap-2.5 mb-8">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                    <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                                    <circle cx="6.5"  cy="16" r="2" fill="white" />
                                    <circle cx="17.5" cy="16" r="2" fill="white" />
                                    <path d="M2 11h11" stroke="white" strokeWidth="1" opacity="0.5" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-sm" />
                        </div>
                        <span style={{ fontFamily: "'Syne',sans-serif" }} className="text-xl font-700 tracking-tight">
              <span className="text-white">fleet</span>
              <span className="text-cyan-400">pulse</span>
            </span>
                    </div>

                    {success ? (
                        <SuccessCard countdown={countdown} />
                    ) : (
                        <>
                            {/* Heading */}
                            <div className="rp-slide-up rp-d2 mb-8">
                                <div className="inline-flex items-center gap-2 rp-glass rounded-full px-3 py-1 text-xs font-medium text-cyan-300 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    Carrier Portal
                                </div>
                                <h2 style={{ fontFamily: "'Syne',sans-serif" }} className="text-2xl font-700 text-white mb-1">
                                    Create your account
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Already have an account?{" "}
                                    <a href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                        Sign in
                                    </a>
                                </p>
                            </div>

                            {/* API-level error banner */}
                            {errors.api && (
                                <div className="rp-fade-in mb-6 flex items-start gap-3 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3">
                                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5">
                                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <p className="text-sm text-rose-300">{errors.api}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate className="space-y-5">

                                {/* Row 1 — First & Last name */}
                                <div className="rp-slide-up rp-d3 grid sm:grid-cols-2 gap-4">
                                    <Field label="First Name" error={errors.first_name} required>
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <circle cx="10" cy="7"  r="4" stroke="currentColor" strokeWidth="1.4" />
                                                    <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                </svg>
                                            </InputIcon>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={form.first_name}
                                                onChange={handleChange}
                                                placeholder="John"
                                                maxLength={20}
                                                autoComplete="given-name"
                                                className={`${inputBase(!!errors.first_name)} pl-10 pr-4`}
                                            />
                                        </div>
                                    </Field>

                                    <Field label="Last Name" error={errors.last_name} required>
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <circle cx="10" cy="7"  r="4" stroke="currentColor" strokeWidth="1.4" />
                                                    <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                </svg>
                                            </InputIcon>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={form.last_name}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                maxLength={20}
                                                autoComplete="family-name"
                                                className={`${inputBase(!!errors.last_name)} pl-10 pr-4`}
                                            />
                                        </div>
                                    </Field>
                                </div>

                                {/* Row 2 — Email */}
                                <div className="rp-slide-up rp-d4">
                                    <Field label="Email Address" error={errors.email} required>
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                    <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                                </svg>
                                            </InputIcon>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="you@company.com"
                                                maxLength={50}
                                                autoComplete="email"
                                                className={`${inputBase(!!errors.email)} pl-10 pr-4`}
                                            />
                                        </div>
                                    </Field>
                                </div>

                                {/* Row 3 — Password */}
                                <div className="rp-slide-up rp-d5">
                                    <Field
                                        label="Password"
                                        error={errors.password}
                                        required
                                        hint="8–16 characters, one uppercase letter, one special character"
                                    >
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                                    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                </svg>
                                            </InputIcon>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                maxLength={16}
                                                autoComplete="new-password"
                                                className={`${inputBase(!!errors.password)} pl-10 pr-12`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4" />
                                                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                                                        <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4" />
                                                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {/* Strength bar */}
                                        {form.password && (
                                            <div className="mt-2">
                                                <div className="flex gap-1 mb-1">
                                                    {[1, 2, 3, 4].map((lvl) => (
                                                        <div
                                                            key={lvl}
                                                            className={`rp-strength-bar h-1 flex-1 rounded-full ${
                                                                strength.score >= lvl ? strength.className : "bg-slate-700"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    Strength:{" "}
                                                    <span className={
                                                        strength.score === 4 ? "text-emerald-400" :
                                                            strength.score === 3 ? "text-yellow-400" :
                                                                strength.score === 2 ? "text-orange-400" : "text-rose-400"
                                                    }>
                            {strength.label}
                          </span>
                                                </p>
                                            </div>
                                        )}
                                    </Field>
                                </div>

                                {/* Row 4 — Confirm password */}
                                <div className="rp-slide-up rp-d6">
                                    <Field label="Confirm Password" error={errors.confirm_password} required>
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                                    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                    <path d="M8 14l1.5 1.5L13 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </InputIcon>
                                            <input
                                                type={showConfirm ? "text" : "password"}
                                                name="confirm_password"
                                                value={form.confirm_password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                maxLength={16}
                                                autoComplete="new-password"
                                                className={`${inputBase(!!errors.confirm_password)} pl-10 pr-12`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm((v) => !v)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 transition-colors"
                                            >
                                                {showConfirm ? (
                                                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4" />
                                                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                                                        <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4" />
                                                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </Field>
                                </div>

                                {/* Row 5 — Country & Role */}
                                <div className="rp-slide-up rp-d7 grid sm:grid-cols-2 gap-4">
                                    <Field label="Country" error={errors.country} required>
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
                                                    <path d="M2 10h16M10 2c-2 2-3 5-3 8s1 6 3 8M10 2c2 2 3 5 3 8s-1 6-3 8" stroke="currentColor" strokeWidth="1.4" />
                                                </svg>
                                            </InputIcon>
                                            <input
                                                type="text"
                                                name="country"
                                                value={form.country}
                                                onChange={handleChange}
                                                placeholder="United States"
                                                autoComplete="country-name"
                                                className={`${inputBase(!!errors.country)} pl-10 pr-4`}
                                            />
                                        </div>
                                    </Field>

                                    <Field label="Role" error={errors.role} required>
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                                    <path d="M7 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                    <path d="M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                </svg>
                                            </InputIcon>
                                            <select
                                                name="role"
                                                value={form.role}
                                                onChange={handleChange}
                                                className={`${inputBase(!!errors.role)} pl-10 pr-8 appearance-none cursor-pointer`}
                                            >
                                                <option value="" disabled>Select a role…</option>
                                                <option value="driver">🚛  Driver</option>
                                                <option value="admin">🛡️  Admin</option>
                                            </select>
                                            {/* Chevron */}
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                                        </div>
                                    </Field>
                                </div>

                                {/* Row 6 — Passport (optional) */}
                                <div className="rp-slide-up rp-d8">
                                    <Field
                                        label="Passport Number"
                                        error={errors.passport}
                                        hint="Optional — alphanumeric, max 30 characters"
                                    >
                                        <div className="relative">
                                            <InputIcon>
                                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                                                    <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                                    <circle cx="10" cy="9"  r="2.5" stroke="currentColor" strokeWidth="1.2" />
                                                    <path d="M6 14c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                    <path d="M7 5h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                </svg>
                                            </InputIcon>
                                            <input
                                                type="text"
                                                name="passport"
                                                value={form.passport}
                                                onChange={handleChange}
                                                placeholder="A12345678  (optional)"
                                                maxLength={30}
                                                className={`${inputBase(!!errors.passport)} pl-10 pr-4`}
                                            />
                                        </div>
                                    </Field>
                                </div>

                                {/* Submit */}
                                <div className="rp-slide-up rp-d9 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rp-btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                                                    <path d="M12 2a10 10 0 0110 10" stroke="#040f16" strokeWidth="3" strokeLinecap="round" />
                                                </svg>
                                                Creating account…
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                                    <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Sign in link */}
                                <p className="rp-slide-up rp-d10 text-center text-sm text-slate-500 pb-1">
                                    Already have an account?{" "}
                                    <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                        Sign in
                                    </a>
                                </p>
                            </form>
                        </>
                    )}

                    {/* Footer */}
                    <p className="mt-8 text-xs text-slate-600 text-center">
                        © {new Date().getFullYear()} FleetPulse Inc. · FMCSA ELD #FP-12345
                    </p>
                </div>
            </div>
        </div>
    );
}