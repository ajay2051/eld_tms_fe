import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .fp-root * { font-family: 'DM Sans', sans-serif; }
  .fp-root h1, .fp-root h2, .fp-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes fp-slide-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fp-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fp-scale-in {
    from { opacity: 0; transform: scale(0.82); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fp-ripple {
    0%   { transform: scale(1);   opacity: 0.45; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes fp-envelope {
    0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
    50%       { transform: translateY(-9px) rotate(1.5deg); }
  }
  @keyframes fp-mail-draw {
    from { stroke-dashoffset: 80; opacity: 0; }
    to   { stroke-dashoffset: 0;  opacity: 1; }
  }

  .fp-slide-up { animation: fp-slide-up 0.55s ease-out forwards; }
  .fp-fade-in  { animation: fp-fade-in  0.65s ease-out forwards; }
  .fp-scale-in { animation: fp-scale-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  .fp-d1 { animation-delay: 0.06s; opacity: 0; }
  .fp-d2 { animation-delay: 0.14s; opacity: 0; }
  .fp-d3 { animation-delay: 0.22s; opacity: 0; }
  .fp-d4 { animation-delay: 0.30s; opacity: 0; }
  .fp-d5 { animation-delay: 0.38s; opacity: 0; }

  .fp-ripple-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px solid rgba(0,229,204,0.38);
    animation: fp-ripple 2.3s ease-out infinite;
  }
  .fp-ripple-ring:nth-child(2) { animation-delay: 0.75s; }
  .fp-ripple-ring:nth-child(3) { animation-delay: 1.5s; }

  .fp-envelope-float { animation: fp-envelope 3.8s ease-in-out infinite; }

  .fp-mail-draw {
    stroke-dasharray: 80;
    stroke-dashoffset: 80;
    animation: fp-mail-draw 0.65s ease-out 0.2s forwards;
  }

  /* Glass */
  .fp-glass-card {
    background: rgba(6, 29, 42, 0.75);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(0,229,204,0.18);
    box-shadow: 0 0 60px rgba(0,229,204,0.07), 0 32px 80px rgba(0,0,0,0.55);
  }
  .fp-glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(0,229,204,0.13);
  }

  /* Input */
  .fp-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.18);
    color: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .fp-input:focus {
    outline: none;
    border-color: rgba(0,229,204,0.55);
    background: rgba(0,229,204,0.04);
    box-shadow: 0 0 0 3px rgba(0,229,204,0.08);
  }
  .fp-input::placeholder { color: rgba(148,163,184,0.5); }
  .fp-input-error { border-color: rgba(248,113,113,0.6) !important; }

  /* Buttons */
  .fp-btn-primary {
    background: linear-gradient(135deg, #00e5cc, #14b8a6);
    box-shadow: 0 0 22px rgba(0,229,204,0.38), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .fp-btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 38px rgba(0,229,204,0.55);
    transform: translateY(-1px);
  }
  .fp-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .fp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .fp-btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.16);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  }
  .fp-btn-ghost:hover {
    background: rgba(0,229,204,0.07);
    border-color: rgba(0,229,204,0.38);
    transform: translateY(-1px);
  }

  /* Error banner */
  .fp-banner-error {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.28);
  }

  /* Grid background */
  .fp-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,204,0.03) 1px, transparent 1px);
    background-size: 56px 56px;
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState { email: string; }
interface FormErrors { email?: string; non_field?: string; }
interface ForgotPasswordResponse { message: string; }

// ─── API call ─────────────────────────────────────────────────────────────────

async function forgotPasswordApi(email: string): Promise<ForgotPasswordResponse> {
    const { data } = await axios.post<ForgotPasswordResponse>(
        `${API_BASE_URL}/auth/forgot-password/`,
        { email },
        { headers: { "Content-Type": "application/json" } }
    );
    return data;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Logo() {
    return (
        <div className="fp-slide-up fp-d1 flex items-center gap-2.5 mb-8">
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
    );
}

function ErrorInline({ msg }: { msg: string }) {
    return (
        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
            <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0">
                <circle cx="6" cy="6" r="5" stroke="#f87171" strokeWidth="1.2" />
                <path d="M6 4v3M6 8.5v.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {msg}
        </p>
    );
}

// ─── Email sent success state ─────────────────────────────────────────────────

function EmailSentState({ email, message, onBack }: { email: string; message: string; onBack: () => void }) {
    return (
        <div className="fp-scale-in text-center">
            {/* Animated envelope icon */}
            <div className="flex justify-center mb-8">
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="fp-ripple-ring" />
                    <div className="fp-ripple-ring" />
                    <div className="fp-ripple-ring" />
                    <div
                        className="relative z-10 w-24 h-24 rounded-full bg-cyan-500/12 border-2 border-cyan-500/35 flex items-center justify-center fp-envelope-float"
                        style={{ boxShadow: "0 0 35px rgba(0,229,204,0.15)" }}
                    >
                        <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
                            <rect x="4" y="11" width="40" height="28" rx="3" stroke="#00e5cc" strokeWidth="1.8" />
                            <path
                                className="fp-mail-draw"
                                d="M4 14l20 14 20-14"
                                stroke="#00e5cc"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* Mini check badge */}
                            <circle cx="36" cy="34" r="8" fill="#040f16" stroke="#00e5cc" strokeWidth="1.5" />
                            <path d="M32.5 34l2.5 2.5 5-4.5" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 fp-glass rounded-full px-3 py-1.5 text-xs font-medium text-cyan-300 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Email sent successfully
            </div>

            <h2 style={{ fontFamily: "'Syne',sans-serif" }} className="text-2xl font-700 text-white mb-2">
                Check your inbox
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-2">
                {message}
            </p>

            {/* Email chip */}
            <div className="fp-glass inline-flex items-center gap-2 rounded-xl px-4 py-2 mb-7">
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-cyan-400">
                    <path d="M1 4l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span className="text-cyan-300 text-sm font-medium">{email}</span>
            </div>

            {/* Steps */}
            <div className="fp-glass rounded-2xl p-5 mb-7 text-left space-y-3.5">
                {[
                    { step: "Open the email from FleetPulse",          note: "" },
                    { step: "Click the Reset Password button",         note: "" },
                    { step: "Create a new secure password",            note: "" },
                    { step: "Link expires after 24 hours",             note: "For security" },
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-cyan-500/18 border border-cyan-500/35 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-cyan-400 mt-0.5">
              {i + 1}
            </span>
                        <div>
                            <span className="text-sm text-slate-300">{item.step}</span>
                            {item.note && <span className="ml-2 text-xs text-slate-500">— {item.note}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onBack}
                className="fp-btn-ghost w-full rounded-xl py-3 text-sm text-slate-300 font-medium flex items-center justify-center gap-2"
            >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M13 8H3M7 5l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to login
            </button>
        </div>
    );
}

// ─── Main form ────────────────────────────────────────────────────────────────

function ForgotPasswordForm() {
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);

    const [form,    setForm]    = useState<FormState>({ email: "" });
    const [errors,  setErrors]  = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [sent,    setSent]    = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => { emailRef.current?.focus(); }, []);

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.email.trim()) {
            errs.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = "Enter a valid email address.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ email: e.target.value });
        setErrors({});
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await forgotPasswordApi(form.email);
            setMessage(res.message);
            setSent(true);
        } catch (err) {
            const axiosErr = err as AxiosError<Record<string, string | string[]>>;
            const d = axiosErr.response?.data;
            if (d) {
                const errs: FormErrors = {};
                if (d.email)   errs.email     = Array.isArray(d.email)   ? d.email[0]   : (d.email as string);
                if (d.message) errs.non_field = Array.isArray(d.message) ? d.message[0] : (d.message as string);
                if (d.detail)  errs.non_field = d.detail as string;
                setErrors(errs);
            } else {
                setErrors({ non_field: "Something went wrong. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-8 py-10 sm:px-10 sm:py-12 max-w-lg w-full mx-auto">
            <Logo />

            {sent ? (
                <EmailSentState email={form.email} message={message} onBack={() => navigate("/login")} />
            ) : (
                <>
                    {/* Heading */}
                    <div className="fp-slide-up fp-d2 mb-8">
                        <div className="inline-flex items-center gap-2 fp-glass rounded-full px-3 py-1 text-xs font-medium text-cyan-300 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            Password recovery
                        </div>
                        <h2 style={{ fontFamily: "'Syne',sans-serif" }} className="text-2xl font-700 text-white mb-2">
                            Forgot your password?
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Enter your registered email and we'll send you a secure reset link.
                        </p>
                    </div>

                    {/* API error banner */}
                    {errors.non_field && (
                        <div className="fp-fade-in fp-banner-error rounded-xl px-4 py-3 flex items-start gap-3 mb-5">
                            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5">
                                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <p className="text-sm text-rose-300">{errors.non_field}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        {/* Email */}
                        <div className="fp-slide-up fp-d3">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                                Email address <span className="text-cyan-400">*</span>
                            </label>
                            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
                                <input
                                    ref={emailRef}
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    className={`fp-input w-full rounded-xl pl-10 pr-4 py-3 text-sm ${errors.email ? "fp-input-error" : ""}`}
                                />
                            </div>
                            {errors.email && <ErrorInline msg={errors.email} />}
                        </div>

                        {/* Submit */}
                        <div className="fp-slide-up fp-d4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="fp-btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                                            <path d="M12 2a10 10 0 0110 10" stroke="#040f16" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        Sending reset link…
                                    </>
                                ) : (
                                    <>
                                        Send Reset Link
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                            <path d="M2 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Back to login */}
                        <div className="fp-slide-up fp-d5">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="fp-btn-ghost w-full rounded-xl py-3 text-sm text-slate-300 font-medium flex items-center justify-center gap-2"
                            >
                                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                    <path d="M13 8H3M7 5l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back to login
                            </button>
                        </div>

                    </form>
                </>
            )}

            <p className="mt-8 text-xs text-slate-600 text-center">
                © {new Date().getFullYear()} FleetPulse Inc. · FMCSA ELD #FP-12345
            </p>
        </div>
    );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
    useEffect(() => {
        const id = "fp-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    return (
        <div className="fp-root min-h-screen bg-[#040f16] text-white overflow-hidden flex items-center justify-center px-4 py-12">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/6  blur-[110px]" />
                <div className="absolute bottom-[-140px] left-[-80px]  w-[420px] h-[420px] rounded-full bg-teal-500/5  blur-[90px]"  />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/3 blur-[140px]" />
                <div className="fp-grid-bg absolute inset-0" />
            </div>
            <div className="fp-glass-card relative rounded-3xl w-full max-w-md">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full" />
                <ForgotPasswordForm />
            </div>
        </div>
    );
}