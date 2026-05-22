import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .uv-root * { font-family: 'DM Sans', sans-serif; }
  .uv-root h1, .uv-root h2, .uv-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes uv-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes uv-scale-in {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes uv-ripple {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes uv-check-draw {
    from { stroke-dashoffset: 40; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes uv-countdown {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: 100; }
  }
  @keyframes uv-glow-pulse {
    0%, 100% { box-shadow: 0 0 24px rgba(52,211,153,0.25); }
    50%       { box-shadow: 0 0 48px rgba(52,211,153,0.50); }
  }

  .uv-fade-up   { animation: uv-fade-up  0.6s ease-out forwards; }
  .uv-scale-in  { animation: uv-scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .uv-d1 { animation-delay: 0.1s; opacity: 0; }
  .uv-d2 { animation-delay: 0.25s; opacity: 0; }
  .uv-d3 { animation-delay: 0.4s; opacity: 0; }
  .uv-d4 { animation-delay: 0.55s; opacity: 0; }
  .uv-d5 { animation-delay: 0.7s; opacity: 0; }

  .uv-ripple-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba(52,211,153,0.45);
    animation: uv-ripple 2s ease-out infinite;
  }
  .uv-ripple-ring:nth-child(2) { animation-delay: 0.6s; }
  .uv-ripple-ring:nth-child(3) { animation-delay: 1.2s; }

  .uv-check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: uv-check-draw 0.5s ease-out 0.3s forwards;
  }

  .uv-glass {
    background: rgba(6, 29, 42, 0.72);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(52, 211, 153, 0.18);
    box-shadow: 0 0 60px rgba(52,211,153,0.06), 0 32px 80px rgba(0,0,0,0.5);
  }
  .uv-glass-sm {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(52,211,153,0.14);
  }
  .uv-glow-pulse { animation: uv-glow-pulse 2.5s ease-in-out infinite; }

  .uv-btn-primary {
    background: linear-gradient(135deg, #00e5cc, #14b8a6);
    box-shadow: 0 0 22px rgba(0,229,204,0.38), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .uv-btn-primary:hover {
    box-shadow: 0 0 38px rgba(0,229,204,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }

  .uv-btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.18);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  }
  .uv-btn-ghost:hover {
    background: rgba(0,229,204,0.07);
    border-color: rgba(0,229,204,0.38);
    transform: translateY(-1px);
  }

  .uv-grid-bg {
    background-image:
      linear-gradient(rgba(52,211,153,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52,211,153,0.025) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  .uv-progress-ring {
    animation: uv-countdown linear forwards;
  }
`;

// ─── Countdown ring ───────────────────────────────────────────────────────────

interface CountdownRingProps {
    seconds: number;
    total: number;
}

function CountdownRing({ seconds, total }: CountdownRingProps) {
    const r = 20;
    const circumference = 2 * Math.PI * r;
    const progress = seconds / total;
    const dashoffset = circumference * (1 - progress);

    return (
        <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
            {/* Track */}
            <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(52,211,153,0.12)" strokeWidth="3" />
            {/* Progress */}
            <circle
                cx="24" cy="24" r={r}
                fill="none"
                stroke="#34d399"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                style={{ transition: "stroke-dashoffset 1s linear" }}
            />
            {/* Number in center — rotated back upright */}
            <text
                x="24" y="24"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14"
                fontWeight="700"
                fill="#34d399"
                style={{ transform: "rotate(90deg)", transformOrigin: "24px 24px", fontFamily: "'Syne', sans-serif" }}
            >
                {seconds}
            </text>
        </svg>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const REDIRECT_AFTER = 8; // seconds before auto-redirect

export default function UserVerified() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState<number>(REDIRECT_AFTER);

    // Style injection
    useEffect(() => {
        const id = "fleetpulse-uv-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    // Auto-redirect countdown
    useEffect(() => {
        if (countdown <= 0) {
            navigate("/");
            return;
        }
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    const steps = [
        { label: "Email verified",       done: true },
        { label: "Account activated",    done: true },
        { label: "Permissions assigned", done: true },
    ];

    return (
        <div className="uv-root min-h-screen bg-[#040f16] text-white overflow-hidden flex items-center justify-center px-4 py-12">

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-160px] left-[-100px]  w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[110px]" />
                <div className="absolute bottom-[-140px] right-[-80px] w-[420px] h-[420px] rounded-full bg-teal-500/5  blur-[90px]"  />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/3 blur-[140px]" />
                <div className="uv-grid-bg absolute inset-0" />
            </div>

            {/* Card */}
            <div className="uv-glass relative rounded-3xl w-full max-w-md px-8 py-12 sm:px-10 text-center">
                {/* Top glow strip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent rounded-full" />

                {/* Logo */}
                <div className="uv-fade-up uv-d1 flex items-center justify-center gap-2 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                            <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                            <circle cx="6.5"  cy="16" r="2" fill="white" />
                            <circle cx="17.5" cy="16" r="2" fill="white" />
                        </svg>
                    </div>
                    <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-700">
            <span className="text-white">fleet</span>
            <span className="text-cyan-400">pulse</span>
          </span>
                </div>

                {/* Check icon with ripple rings */}
                <div className="uv-scale-in uv-d1 flex justify-center mb-8">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Ripple rings */}
                        <div className="uv-ripple-ring" />
                        <div className="uv-ripple-ring" />
                        <div className="uv-ripple-ring" />
                        {/* Circle bg */}
                        <div className="uv-glow-pulse relative z-10 w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center">
                            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                                <path
                                    className="uv-check-path"
                                    d="M10 20l7 7 13-14"
                                    stroke="#34d399"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <div className="uv-fade-up uv-d2 mb-2">
                    <div className="inline-flex items-center gap-2 uv-glass-sm rounded-full px-3 py-1 text-xs font-medium text-emerald-300 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verification complete
                    </div>
                    <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-700 text-white mb-2">
                        You're verified!
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Your FleetPulse carrier account has been successfully verified and activated.
                    </p>
                </div>

                {/* Step checklist */}
                <div className="uv-fade-up uv-d3 uv-glass-sm rounded-2xl p-5 my-7 text-left space-y-3">
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                                <svg viewBox="0 0 12 12" className="w-3 h-3">
                                    <path d="M2 6l3 3 5-5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-sm text-slate-300">{step.label}</span>
                            <span className="ml-auto text-xs text-emerald-400 font-medium">Done</span>
                        </div>
                    ))}
                </div>

                {/* Auto-redirect notice with countdown ring */}
                <div className="uv-fade-up uv-d4 flex items-center justify-center gap-3 mb-7">
                    <CountdownRing seconds={countdown} total={REDIRECT_AFTER} />
                    <p className="text-sm text-slate-400 text-left">
                        Redirecting to your
                        <br />
                        <span className="text-slate-300">dashboard</span> automatically…
                    </p>
                </div>

                {/* Actions */}
                <div className="uv-fade-up uv-d5 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="uv-btn-primary flex-1 rounded-xl py-3 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
                    >
                        Go to Dashboard
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="uv-btn-ghost flex-1 rounded-xl py-3 text-sm text-slate-300 font-medium"
                    >
                        Back to Login
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-8 text-xs text-slate-600">
                    © {new Date().getFullYear()} FleetPulse Inc. · FMCSA ELD #FP-12345
                </p>
            </div>
        </div>
    );
}