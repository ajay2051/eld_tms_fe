import { useState, useEffect, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import {useNavigate} from "react-router-dom";

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .lp-root * { font-family: 'DM Sans', sans-serif; }
  .lp-root h1, .lp-root h2, .lp-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes lp-slide-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes lp-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lp-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes lp-pulse-ring {
    0%   { transform: scale(1);    opacity: 0.6; }
    100% { transform: scale(1.55); opacity: 0;   }
  }

  .lp-animate-slide-up  { animation: lp-slide-up 0.65s ease-out forwards; }
  .lp-animate-fade-in   { animation: lp-fade-in  0.8s  ease-out forwards; }
  .lp-d1 { animation-delay: 0.08s; opacity: 0; }
  .lp-d2 { animation-delay: 0.18s; opacity: 0; }
  .lp-d3 { animation-delay: 0.28s; opacity: 0; }
  .lp-d4 { animation-delay: 0.40s; opacity: 0; }
  .lp-d5 { animation-delay: 0.52s; opacity: 0; }
  .lp-d6 { animation-delay: 0.64s; opacity: 0; }

  .lp-glass {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 229, 204, 0.13);
  }
  .lp-glass-card {
    background: rgba(6, 29, 42, 0.72);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(0, 229, 204, 0.18);
    box-shadow: 0 0 60px rgba(0, 229, 204, 0.06), 0 32px 80px rgba(0, 0, 0, 0.55);
  }

  .lp-input {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(0, 229, 204, 0.18);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .lp-input:focus {
    outline: none;
    border-color: rgba(0, 229, 204, 0.55);
    background: rgba(0, 229, 204, 0.04);
    box-shadow: 0 0 0 3px rgba(0, 229, 204, 0.08);
  }
  .lp-input::placeholder { color: rgba(148, 163, 184, 0.55); }

  .lp-btn-primary {
    background: linear-gradient(135deg, #00e5cc, #14b8a6);
    box-shadow: 0 0 22px rgba(0, 229, 204, 0.38), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
  }
  .lp-btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 38px rgba(0, 229, 204, 0.58), inset 0 1px 0 rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }
  .lp-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .lp-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

  .lp-divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,229,204,0.18), transparent);
  }

  .lp-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,204,0.03) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  .lp-social-btn {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.14);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  }
  .lp-social-btn:hover {
    background: rgba(0,229,204,0.07);
    border-color: rgba(0,229,204,0.35);
    transform: translateY(-1px);
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
    email: string;
    password: string;
    remember: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
    non_field?: string;
}

interface LoginResponseUser {
    first_name: string;
    last_name: string;
    user_number: string;
    email: string;
    role: string;
    user_id: number | string;
    last_login: string;
    timezone: string;
}

interface LoginResponse {
    message: string;
    access: string;
    refresh: string;
    data: { email: string; password?: string };
    user: LoginResponseUser;
}

// ─── API ──────────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function loginUser(
    email: string,
    password: string
): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login/`, // adjust path to match your Django URL
        { email, password },
        { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
}

function persistAuthData(data: LoginResponse): void {
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("first_name", data.user.first_name ?? "");
    localStorage.setItem("last_name", data.user.last_name ?? "");
    localStorage.setItem("email", data.user.email ?? "");
    localStorage.setItem("user_id", String(data.user.user_id ?? ""));
}

// ─── Component ────────────────────────────────────────────────────────────────

function LoginForm() {
    const [form, setForm] = useState<FormState>({ email: "", password: "", remember: false });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const navigate = useNavigate();

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.email.trim()) {
            errs.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = "Enter a valid email address.";
        }
        if (!form.password) {
            errs.password = "Password is required.";
        } else if (form.password.length < 6) {
            errs.password = "Password must be at least 6 characters.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setErrors({});

        try {
            const data = await loginUser(form.email, form.password);

            persistAuthData(data);
            setSuccess(true);

            if (data.user.role === "driver") {
                navigate("/route");
            } else if (data.user.role === "admin") {
                navigate("/dashboard");
            }
        } catch (err) {
            const axiosErr = err as AxiosError<Record<string, string | string[]>>;
            const responseData = axiosErr.response?.data;

            if (responseData) {
                const nextErrors: FormErrors = {};

                if (responseData.email) {
                    nextErrors.email = Array.isArray(responseData.email)
                        ? responseData.email[0]
                        : responseData.email;
                }
                if (responseData.password) {
                    nextErrors.password = Array.isArray(responseData.password)
                        ? responseData.password[0]
                        : responseData.password;
                }
                if (responseData.non_field_errors) {
                    nextErrors.non_field = Array.isArray(responseData.non_field_errors)
                        ? responseData.non_field_errors[0]
                        : (responseData.non_field_errors as string);
                }
                // DRF ValidationError sometimes wraps in detail
                if (responseData.detail && !nextErrors.email && !nextErrors.password) {
                    nextErrors.non_field = responseData.detail as string;
                }

                setErrors(nextErrors);
            } else {
                setErrors({ non_field: "Something went wrong. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center px-10 sm:px-14 py-14 h-full max-w-2xl w-full mx-auto">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="6.5" cy="16" r="2" fill="white" />
                        <circle cx="17.5" cy="16" r="2" fill="white" />
                    </svg>
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-700">
          <span className="text-white">fleet</span><span className="text-cyan-400">pulse</span>
        </span>
            </div>

            {/* Heading */}
            <div className="lp-animate-slide-up lp-d1 mb-8">
                <div className="inline-flex items-center gap-2 lp-glass rounded-full px-3 py-1 text-xs font-medium text-cyan-300 mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Carrier Portal
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-700 text-white mb-1.5">
                    Welcome back
                </h2>
                <p className="text-slate-400 text-sm">
                    Sign in to your FleetPulse account to continue.
                </p>
            </div>

            {success ? (
                <div className="lp-animate-fade-in lp-glass rounded-2xl p-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                            <path d="M5 12l5 5L19 7" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-700 text-white mb-2">Signed in!</h3>
                    <p className="text-sm text-slate-400">Redirecting to your dashboard…</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                    {/* Non-field / server error banner */}
                    {errors.non_field && (
                        <div className="lp-animate-fade-in rounded-xl border border-rose-500/30 bg-rose-500/8 px-4 py-3 text-xs text-rose-400 flex items-center gap-2">
                            <svg viewBox="0 0 12 12" className="w-3.5 h-3.5 flex-shrink-0">
                                <circle cx="6" cy="6" r="5" stroke="#f87171" strokeWidth="1.2"/>
                                <path d="M6 4v3M6 8.5v.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            {errors.non_field}
                        </div>
                    )}

                    {/* Social sign-in */}
                    <div className="lp-animate-slide-up lp-d2 grid grid-cols-2 gap-3">
                        {[
                            {
                                label: "Google",
                                icon: (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                ),
                            },
                            {
                                label: "Microsoft",
                                icon: (
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                                        <rect x="1"  y="1"  width="10" height="10" fill="#F25022"/>
                                        <rect x="13" y="1"  width="10" height="10" fill="#7FBA00"/>
                                        <rect x="1"  y="13" width="10" height="10" fill="#00A4EF"/>
                                        <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                                    </svg>
                                ),
                            },
                        ].map((s) => (
                            <button
                                key={s.label}
                                type="button"
                                className="lp-social-btn flex items-center justify-center gap-2.5 rounded-xl py-2.5 text-sm text-slate-300 font-medium"
                            >
                                {s.icon}
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="lp-animate-slide-up lp-d2 flex items-center gap-3">
                        <div className="lp-divider-line" />
                        <span className="text-xs text-slate-500 whitespace-nowrap">or sign in with email</span>
                        <div className="lp-divider-line" />
                    </div>

                    {/* Email */}
                    <div className="lp-animate-slide-up lp-d3">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                            Email address
                        </label>
                        <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
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
                                className={`lp-input w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white ${errors.email ? "border-rose-500/60" : ""}`}
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                                <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0"><circle cx="6" cy="6" r="5" stroke="#f87171" strokeWidth="1.2"/><path d="M6 4v3M6 8.5v.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="lp-animate-slide-up lp-d4">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                            <a href="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                  <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="????????"
                                className={`lp-input w-full rounded-xl pl-10 pr-12 py-3 text-sm text-white ${errors.password ? "border-rose-500/60" : ""}`}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
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
                        {errors.password && (
                            <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                                <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0"><circle cx="6" cy="6" r="5" stroke="#f87171" strokeWidth="1.2"/><path d="M6 4v3M6 8.5v.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember me */}
                    <div className="lp-animate-slide-up lp-d5 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={form.remember}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border border-cyan-500/30 bg-transparent accent-cyan-400 cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer select-none">
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="lp-animate-slide-up lp-d5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="lp-btn-primary w-full rounded-xl py-3.5 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                                        <path d="M12 2a10 10 0 0110 10" stroke="#040f16" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                        <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Sign up link */}
                    <p className="lp-animate-slide-up lp-d6 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Request Access
                        </a>
                    </p>
                </form>
            )}

            <p className="mt-10 text-xs text-slate-600 text-center">
                © {new Date().getFullYear()} FleetPulse Inc. · FMCSA ELD Registration #FP-12345
            </p>
        </div>
    );
}

export default function LoginPage() {
    useEffect(() => {
        const id = "fleetpulse-login-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    return (
        <div className="lp-root min-h-screen bg-[#040f16] text-white overflow-hidden flex items-center justify-center">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-180px] right-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/6 blur-[110px]" />
                <div className="absolute bottom-[-150px] left-[-80px] w-[420px] h-[420px] rounded-full bg-teal-500/5 blur-[90px]" />
                <div className="lp-grid-bg absolute inset-0" />
            </div>

            {/* Login card */}
            <div className="relative w-full max-w-[640px] mx-4 my-8">
                <div className="absolute inset-4 rounded-3xl bg-cyan-500/3 blur-2xl pointer-events-none" />
                <div className="lp-glass-card rounded-3xl relative">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}