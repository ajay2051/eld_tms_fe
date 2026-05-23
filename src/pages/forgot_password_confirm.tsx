import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .fpc-root * { font-family: 'DM Sans', sans-serif; }
  .fpc-root h1, .fpc-root h2, .fpc-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes fpc-slide-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fpc-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fpc-scale-in {
    from { opacity: 0; transform: scale(0.82); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fpc-ripple {
    0%   { transform: scale(1);   opacity: 0.45; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes fpc-check-draw {
    from { stroke-dashoffset: 40; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes fpc-glow-pulse {
    0%, 100% { box-shadow: 0 0 22px rgba(0,229,204,0.2); }
    50%       { box-shadow: 0 0 42px rgba(0,229,204,0.45); }
  }
  @keyframes fpc-bar-grow {
    from { width: 0%; }
    to   { width: var(--bar-w); }
  }

  .fpc-slide-up { animation: fpc-slide-up 0.55s ease-out forwards; }
  .fpc-fade-in  { animation: fpc-fade-in  0.65s ease-out forwards; }
  .fpc-scale-in { animation: fpc-scale-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  .fpc-d1 { animation-delay: 0.06s; opacity: 0; }
  .fpc-d2 { animation-delay: 0.14s; opacity: 0; }
  .fpc-d3 { animation-delay: 0.22s; opacity: 0; }
  .fpc-d4 { animation-delay: 0.30s; opacity: 0; }
  .fpc-d5 { animation-delay: 0.38s; opacity: 0; }
  .fpc-d6 { animation-delay: 0.46s; opacity: 0; }

  .fpc-ripple-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px solid rgba(0,229,204,0.38);
    animation: fpc-ripple 2.3s ease-out infinite;
  }
  .fpc-ripple-ring:nth-child(2) { animation-delay: 0.75s; }
  .fpc-ripple-ring:nth-child(3) { animation-delay: 1.5s; }

  .fpc-check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: fpc-check-draw 0.45s ease-out 0.2s forwards;
  }
  .fpc-glow-pulse { animation: fpc-glow-pulse 2.5s ease-in-out infinite; }

  /* Glass */
  .fpc-glass-card {
    background: rgba(6, 29, 42, 0.75);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(0,229,204,0.18);
    box-shadow: 0 0 60px rgba(0,229,204,0.07), 0 32px 80px rgba(0,0,0,0.55);
  }
  .fpc-glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(0,229,204,0.13);
  }

  /* Input */
  .fpc-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.18);
    color: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .fpc-input:focus {
    outline: none;
    border-color: rgba(0,229,204,0.55);
    background: rgba(0,229,204,0.04);
    box-shadow: 0 0 0 3px rgba(0,229,204,0.08);
  }
  .fpc-input::placeholder { color: rgba(148,163,184,0.5); }
  .fpc-input-error { border-color: rgba(248,113,113,0.6) !important; }

  /* Buttons */
  .fpc-btn-primary {
    background: linear-gradient(135deg, #00e5cc, #14b8a6);
    box-shadow: 0 0 22px rgba(0,229,204,0.38), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .fpc-btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 38px rgba(0,229,204,0.55);
    transform: translateY(-1px);
  }
  .fpc-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .fpc-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .fpc-btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.16);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  }
  .fpc-btn-ghost:hover {
    background: rgba(0,229,204,0.07);
    border-color: rgba(0,229,204,0.38);
    transform: translateY(-1px);
  }

  /* Eye toggle */
  .fpc-eye-btn {
    transition: color 0.15s ease;
  }

  /* Error / warn banners */
  .fpc-banner-error {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.28);
  }
  .fpc-banner-warn {
    background: rgba(251,191,36,0.08);
    border: 1px solid rgba(251,191,36,0.28);
  }

  /* Strength bars */
  .fpc-bar { transition: background-color 0.3s ease; }
  .fpc-bar-filled-1 { background-color: #f87171; }
  .fpc-bar-filled-2 { background-color: #fb923c; }
  .fpc-bar-filled-3 { background-color: #facc15; }
  .fpc-bar-filled-4 { background-color: #34d399; }

  /* Requirement row */
  .fpc-req-met   { color: #34d399; }
  .fpc-req-unmet { color: #475569; }

  /* Grid background */
  .fpc-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,204,0.03) 1px, transparent 1px);
    background-size: 56px 56px;
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL   = import.meta.env.VITE_API_BASE_URL as string;
const SPECIAL_CHARS  = new Set("@_!#$%^&*()<>?/\\|}{~:");

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
    new_password:         string;
    confirm_new_password: string;
}
interface FormErrors {
    new_password?:         string;
    confirm_new_password?: string;
    non_field?:            string;
}

// ─── API call ─────────────────────────────────────────────────────────────────

async function resetPasswordApi(userId: string, token: string, payload: FormState) {
    const { data } = await axios.put(
        `${API_BASE_URL}/auth/forgot-password-confirm/${userId}/${token}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
    );
    return data;
}

// ─── Password strength ────────────────────────────────────────────────────────

interface StrengthResult { score: number; label: string; barClass: string; }

function getStrength(pw: string): StrengthResult {
    if (!pw) return { score: 0, label: "", barClass: "" };
    let s = 0;
    if (pw.length >= 8)  s++;
    if (pw.length >= 12) s++;
    if ([...pw].some(c => c >= "A" && c <= "Z")) s++;
    if ([...pw].some(c => c >= "0" && c <= "9")) s++;
    if ([...pw].some(c => SPECIAL_CHARS.has(c)))  s++;
    if (s <= 1) return { score: 1, label: "Weak",   barClass: "fpc-bar-filled-1" };
    if (s === 2) return { score: 2, label: "Fair",   barClass: "fpc-bar-filled-2" };
    if (s === 3) return { score: 3, label: "Good",   barClass: "fpc-bar-filled-4" };  // yellow→green jump
    return       { score: 4, label: "Strong", barClass: "fpc-bar-filled-4" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
    return (
        <div className="fpc-slide-up fpc-d1 flex items-center gap-2.5 mb-8">
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

function EyeIcon({ open }: { open: boolean }) {
    return open ? (
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
    );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState({ onLogin }: { onLogin: () => void }) {
    return (
        <div className="fpc-scale-in text-center py-4">
            <div className="flex justify-center mb-7">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="fpc-ripple-ring" />
                    <div className="fpc-ripple-ring" />
                    <div className="fpc-ripple-ring" />
                    <div className="fpc-glow-pulse relative z-10 w-20 h-20 rounded-full bg-cyan-500/15 border-2 border-cyan-500/40 flex items-center justify-center">
                        <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                            <path
                                className="fpc-check-path"
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

            <div className="inline-flex items-center gap-2 fpc-glass rounded-full px-3 py-1.5 text-xs font-medium text-cyan-300 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Password updated
            </div>

            <h2 style={{ fontFamily: "'Syne',sans-serif" }} className="text-2xl font-700 text-white mb-2">
                All done!
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-7">
                Your password has been reset successfully. You can now sign in with your new password.
            </p>

            <div className="fpc-glass rounded-2xl p-5 mb-7 text-left space-y-3">
                {[
                    "Password updated securely",
                    "Old password is now invalid",
                    "All other sessions have been logged out",
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/35 flex items-center justify-center flex-shrink-0">
                            <svg viewBox="0 0 12 12" className="w-3 h-3">
                                <path d="M2 6l3 3 5-5" stroke="#00e5cc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-sm text-slate-300">{item}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onLogin}
                className="fpc-btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
            >
                Sign In Now
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

// ─── Invalid link state ───────────────────────────────────────────────────────

function InvalidLinkState({ onBack }: { onBack: () => void }) {
    return (
        <div className="fpc-scale-in text-center py-4">
            <div className="w-20 h-20 rounded-full bg-rose-500/12 border-2 border-rose-500/35 flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                    <path d="M12 12l16 16M28 12L12 28" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif" }} className="text-xl font-700 text-white mb-2">
                Invalid reset link
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-7">
                This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
                onClick={onBack}
                className="fpc-btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
            >
                Request New Link
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

// ─── Main form ────────────────────────────────────────────────────────────────

function ForgotPasswordConfirmForm() {
    const navigate          = useNavigate();
    const [searchParams]    = useSearchParams();
    const user_id           = searchParams.get("user_id") ?? "";
    const token             = searchParams.get("token")   ?? "";

    const [form,          setForm]          = useState<FormState>({ new_password: "", confirm_new_password: "" });
    const [errors,        setErrors]        = useState<FormErrors>({});
    const [loading,       setLoading]       = useState<boolean>(false);
    const [success,       setSuccess]       = useState<boolean>(false);
    const [showPw,        setShowPw]        = useState<boolean>(false);
    const [showConfirmPw, setShowConfirmPw] = useState<boolean>(false);

    // ALL hooks must be called before any conditional return
    const strength = getStrength(form.new_password);

    const requirements = useMemo(() => [
        { label: "8 to 16 characters",   met: form.new_password.length >= 8 && form.new_password.length <= 16 },
        { label: "One uppercase letter",  met: /[A-Z]/.test(form.new_password) },
        { label: "One special character", met: [...form.new_password].some(c => SPECIAL_CHARS.has(c)) },
    ], [form.new_password]);

    // Conditional render AFTER all hooks
    if (!user_id || !token) {
        return (
            <div className="px-8 py-10 sm:px-10 sm:py-12 max-w-lg w-full mx-auto">
                <Logo />
                <InvalidLinkState onBack={() => navigate("/forgot-password")} />
            </div>
        );
    }

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.new_password) {
            errs.new_password = "New password is required.";
        } else if (form.new_password.length < 8 || form.new_password.length > 16) {
            errs.new_password = "Password must be 8 to 16 characters long.";
        } else if (!/[A-Z]/.test(form.new_password)) {
            errs.new_password = "Password must contain at least one uppercase letter.";
        } else if (![...form.new_password].some(c => SPECIAL_CHARS.has(c))) {
            errs.new_password = "Password must contain at least one special character.";
        }
        if (!form.confirm_new_password) {
            errs.confirm_new_password = "Please confirm your new password.";
        } else if (form.new_password !== form.confirm_new_password) {
            errs.confirm_new_password = "Passwords do not match.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined, non_field: undefined }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await resetPasswordApi(user_id, token, form);
            setSuccess(true);
        } catch (err) {
            const axiosErr = err as AxiosError<Record<string, string | string[]>>;
            const d = axiosErr.response?.data;
            if (d) {
                const errs: FormErrors = {};
                if (d.new_password)         errs.new_password         = Array.isArray(d.new_password)         ? d.new_password[0]         : (d.new_password as string);
                if (d.confirm_new_password) errs.confirm_new_password = Array.isArray(d.confirm_new_password) ? d.confirm_new_password[0] : (d.confirm_new_password as string);
                if (d.message)              errs.non_field             = Array.isArray(d.message)             ? d.message[0]             : (d.message as string);
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

            {success ? (
                <SuccessState onLogin={() => navigate("/login")} />
            ) : (
                <>
                    {/* Heading */}
                    <div className="fpc-slide-up fpc-d2 mb-8">
                        <div className="inline-flex items-center gap-2 fpc-glass rounded-full px-3 py-1 text-xs font-medium text-cyan-300 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            Password reset
                        </div>
                        <h2 style={{ fontFamily: "'Syne',sans-serif" }} className="text-2xl font-700 text-white mb-2">
                            Create new password
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Choose a strong password for your FleetPulse account.
                        </p>
                    </div>

                    {/* Non-field error banner */}
                    {errors.non_field && (
                        <div className="fpc-fade-in fpc-banner-error rounded-xl px-4 py-3 flex items-start gap-3 mb-5">
                            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5">
                                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <p className="text-sm text-rose-300">{errors.non_field}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        {/* New password */}
                        <div className="fpc-slide-up fpc-d3">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                                New password <span className="text-cyan-400">*</span>
                            </label>
                            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                                <input
                                    type={showPw ? "text" : "password"}
                                    name="new_password"
                                    value={form.new_password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    maxLength={16}
                                    autoComplete="new-password"
                                    className={`fpc-input w-full rounded-xl pl-10 pr-12 py-3 text-sm ${errors.new_password ? "fpc-input-error" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(v => !v)}
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                    className="fpc-eye-btn absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300"
                                >
                                    <EyeIcon open={showPw} />
                                </button>
                            </div>

                            {/* Strength bar */}
                            {form.new_password && (
                                <div className="mt-2.5">
                                    <div className="flex gap-1 mb-1.5">
                                        {[1,2,3,4].map(lvl => (
                                            <div
                                                key={lvl}
                                                className={`fpc-bar h-1 flex-1 rounded-full transition-colors duration-300 ${
                                                    strength.score >= lvl ? strength.barClass : "bg-slate-700/70"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Strength:{" "}
                                        <span className={
                                            strength.score >= 4 ? "text-emerald-400" :
                                                strength.score === 3 ? "text-yellow-400" :
                                                    strength.score === 2 ? "text-orange-400" : "text-rose-400"
                                        }>
                      {strength.label}
                    </span>
                                    </p>
                                </div>
                            )}

                            {/* Requirements checklist */}
                            <div className="mt-3 fpc-glass rounded-xl px-4 py-3 space-y-2">
                                {requirements.map((req, i) => (
                                    <div key={i} className={`flex items-center gap-2 text-xs transition-colors duration-200 ${req.met ? "fpc-req-met" : "fpc-req-unmet"}`}>
                                        <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0">
                                            {req.met ? (
                                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            ) : (
                                                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
                                            )}
                                        </svg>
                                        {req.label}
                                    </div>
                                ))}
                            </div>

                            {errors.new_password && <ErrorInline msg={errors.new_password} />}
                        </div>

                        {/* Confirm password */}
                        <div className="fpc-slide-up fpc-d4">
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                                Confirm new password <span className="text-cyan-400">*</span>
                            </label>
                            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M8 14l1.5 1.5L13 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                                <input
                                    type={showConfirmPw ? "text" : "password"}
                                    name="confirm_new_password"
                                    value={form.confirm_new_password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    maxLength={16}
                                    autoComplete="new-password"
                                    className={`fpc-input w-full rounded-xl pl-10 pr-12 py-3 text-sm ${errors.confirm_new_password ? "fpc-input-error" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPw(v => !v)}
                                    aria-label={showConfirmPw ? "Hide password" : "Show password"}
                                    className="fpc-eye-btn absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300"
                                >
                                    <EyeIcon open={showConfirmPw} />
                                </button>
                            </div>

                            {/* Match indicator */}
                            {form.confirm_new_password && !errors.confirm_new_password && form.new_password === form.confirm_new_password && (
                                <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1.5">
                                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Passwords match
                                </p>
                            )}
                            {errors.confirm_new_password && <ErrorInline msg={errors.confirm_new_password} />}
                        </div>

                        {/* Submit */}
                        <div className="fpc-slide-up fpc-d5 pt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="fpc-btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                                            <path d="M12 2a10 10 0 0110 10" stroke="#040f16" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        Updating password…
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                            <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Back link */}
                        <div className="fpc-slide-up fpc-d6 text-center">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-sm text-slate-500 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                            >
                                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
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

export default function ForgotPasswordConfirmPage() {
    useEffect(() => {
        const id = "fpc-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    return (
        <div className="fpc-root min-h-screen bg-[#040f16] text-white overflow-hidden flex items-center justify-center px-4 py-12">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/6  blur-[110px]" />
                <div className="absolute bottom-[-140px] left-[-80px]  w-[420px] h-[420px] rounded-full bg-teal-500/5  blur-[90px]"  />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/3 blur-[140px]" />
                <div className="fpc-grid-bg absolute inset-0" />
            </div>
            <div className="fpc-glass-card relative rounded-3xl w-full max-w-md">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full" />
                <ForgotPasswordConfirmForm />
            </div>
        </div>
    );
}