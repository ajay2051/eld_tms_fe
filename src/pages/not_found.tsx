import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .nf-root * { font-family: 'DM Sans', sans-serif; }
  .nf-root h1, .nf-root h2, .nf-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes nf-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes nf-glitch-1 {
    0%, 95%, 100% { clip-path: none; transform: none; opacity: 1; }
    96%  { clip-path: inset(20% 0 60% 0); transform: translateX(-6px); opacity: 0.85; }
    97%  { clip-path: inset(60% 0 10% 0); transform: translateX( 6px); opacity: 0.85; }
    98%  { clip-path: inset(40% 0 40% 0); transform: translateX(-4px); opacity: 0.9; }
    99%  { clip-path: none; transform: translateX(2px); opacity: 0.95; }
  }
  @keyframes nf-glitch-shadow {
    0%, 95%, 100% { text-shadow: none; }
    96%  { text-shadow: -4px 0 rgba(0,229,204,0.7), 4px 0 rgba(255,80,80,0.7); }
    97%  { text-shadow:  4px 0 rgba(0,229,204,0.7), -4px 0 rgba(255,80,80,0.7); }
    98%  { text-shadow: -2px 0 rgba(0,229,204,0.5); }
    99%  { text-shadow: none; }
  }
  @keyframes nf-truck {
    0%   { transform: translateX(-160px); opacity: 0; }
    5%   { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateX(calc(100vw + 60px)); opacity: 0; }
  }
  @keyframes nf-road-dash {
    from { transform: translateX(0); }
    to   { transform: translateX(-112px); }
  }
  @keyframes nf-float {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50%       { transform: translateY(-8px) rotate(1deg); }
  }
  @keyframes nf-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes nf-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .nf-glitch {
    animation: nf-glitch-1 5s ease-in-out infinite, nf-glitch-shadow 5s ease-in-out infinite;
  }
  .nf-float  { animation: nf-float  4s ease-in-out infinite; }
  .nf-blink  { animation: nf-blink  1.1s step-end  infinite; }
  .nf-spin   { animation: nf-spin   1s   linear     infinite; }

  .nf-truck-anim  { animation: nf-truck     7s ease-in-out infinite; }
  .nf-road-scroll { animation: nf-road-dash 1s linear        infinite; }

  .nf-fade-up { animation: nf-fade-up 0.6s ease-out forwards; }
  .nf-d1 { animation-delay: 0.08s; opacity: 0; }
  .nf-d2 { animation-delay: 0.20s; opacity: 0; }
  .nf-d3 { animation-delay: 0.32s; opacity: 0; }
  .nf-d4 { animation-delay: 0.44s; opacity: 0; }
  .nf-d5 { animation-delay: 0.56s; opacity: 0; }

  .nf-glass {
    background: rgba(6, 29, 42, 0.72);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(0, 229, 204, 0.16);
    box-shadow: 0 0 60px rgba(0,229,204,0.05), 0 32px 80px rgba(0,0,0,0.5);
  }
  .nf-glass-sm {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0,229,204,0.12);
  }

  .nf-btn-primary {
    background: linear-gradient(135deg, #00e5cc, #14b8a6);
    box-shadow: 0 0 22px rgba(0,229,204,0.38), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .nf-btn-primary:hover {
    box-shadow: 0 0 38px rgba(0,229,204,0.55);
    transform: translateY(-1px);
  }
  .nf-btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.16);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  }
  .nf-btn-ghost:hover {
    background: rgba(0,229,204,0.07);
    border-color: rgba(0,229,204,0.38);
    transform: translateY(-1px);
  }

  .nf-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,204,0.03) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  .nf-scanline {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,229,204,0.015) 2px,
      rgba(0,229,204,0.015) 4px
    );
    pointer-events: none;
  }
`;

// ─── Animated truck scene ─────────────────────────────────────────────────────

function TruckScene() {
    return (
        <div className="relative w-full h-16 overflow-hidden my-6">
            {/* Road */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0a1f2b]/60 rounded" />
            {/* Dashes — scrolling */}
            <div className="absolute bottom-3.5 left-0 right-0 h-1.5 overflow-hidden">
                <div className="nf-road-scroll flex gap-6 w-[200%]">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-14 h-full bg-slate-600/40 rounded flex-shrink-0" />
                    ))}
                </div>
            </div>
            {/* Truck */}
            <div className="nf-truck-anim absolute bottom-4">
                <svg viewBox="0 0 90 30" fill="none" className="w-20 h-8">
                    <rect x="0"  y="7"  width="56" height="17" rx="2" fill="#0d3d4f" stroke="#00e5cc" strokeWidth="0.8" />
                    <rect x="38" y="3"  width="18" height="21" rx="2" fill="#0a2d3d" stroke="#00e5cc" strokeWidth="0.8" />
                    <rect x="40" y="5"  width="13" height="9"  rx="1" fill="#00e5cc" opacity="0.2" />
                    {/* Wheels */}
                    <circle cx="11" cy="24" r="5" fill="#061d26" stroke="#00e5cc" strokeWidth="0.8" />
                    <circle cx="11" cy="24" r="2" fill="#00e5cc" opacity="0.4" />
                    <circle cx="45" cy="24" r="5" fill="#061d26" stroke="#00e5cc" strokeWidth="0.8" />
                    <circle cx="45" cy="24" r="2" fill="#00e5cc" opacity="0.4" />
                    {/* Glow under */}
                    <ellipse cx="28" cy="29" rx="26" ry="2.5" fill="#00e5cc" opacity="0.07" />
                    {/* Headlight beam */}
                    <path d="M56 9 L80 6 L80 17 L56 17 Z" fill="#00e5cc" opacity="0.06" />
                    {/* Lost signal icon on trailer */}
                    <text x="14" y="20" fontSize="9" fill="#00e5cc" opacity="0.35" fontFamily="monospace">???</text>
                </svg>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotFound() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const [, setDots] = useState<string>(".");

    // Style injection
    useEffect(() => {
        const id = "fleetpulse-nf-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    // Animated dots
    useEffect(() => {
        const t = setInterval(() => {
            setDots((d) => (d.length >= 3 ? "." : d + "."));
        }, 500);
        return () => clearInterval(t);
    }, []);

    // The attempted path, shown in the terminal block
    const attemptedPath = location.pathname;

    const quickLinks = [
        { label: "Home",      path: "/",        icon: "⌂" },
        { label: "Dashboard", path: "/dashboard",icon: "▦" },
        { label: "Login",     path: "/login",    icon: "→" },
    ];

    return (
        <div className="nf-root min-h-screen bg-[#040f16] text-white overflow-hidden flex items-center justify-center px-4 py-12">

            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-160px] right-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/5  blur-[110px]" />
                <div className="absolute bottom-[-140px] left-[-80px]  w-[420px] h-[420px] rounded-full bg-rose-500/4  blur-[100px]" />
                <div className="nf-grid-bg absolute inset-0" />
                <div className="nf-scanline absolute inset-0" />
            </div>

            {/* Card */}
            <div className="nf-glass relative rounded-3xl w-full max-w-lg px-8 py-12 sm:px-10 text-center">
                {/* Top glow strip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-full" />

                {/* Logo */}
                <div className="nf-fade-up nf-d1 flex items-center justify-center gap-2 mb-10">
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

                {/* 404 glitch number */}
                <div className="nf-fade-up nf-d1 nf-float mb-2 select-none">
          <span
              className="nf-glitch"
              style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(80px, 18vw, 130px)",
                  fontWeight: 800,
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #00e5cc 0%, #ffffff 50%, #00e5cc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
              }}
          >
            404
          </span>
                </div>

                {/* Heading & sub */}
                <div className="nf-fade-up nf-d2 mb-2">
                    <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-700 text-white mb-2">
                        Route not found
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        This truck went off-route. The page you're looking for doesn't exist or was moved.
                    </p>
                </div>

                {/* Truck scene */}
                <div className="nf-fade-up nf-d2">
                    <TruckScene />
                </div>

                {/* Terminal block showing the bad path */}
                <div className="nf-fade-up nf-d3 nf-glass-sm rounded-xl p-4 mb-7 text-left font-mono text-xs">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                        </div>
                        <span className="text-slate-500 text-[10px] tracking-wider uppercase">fleet terminal</span>
                    </div>
                    <div className="space-y-1">
                        <p>
                            <span className="text-cyan-400">fleetpulse</span>
                            <span className="text-slate-500"> ~ </span>
                            <span className="text-slate-300">navigate</span>
                            <span className="text-amber-400"> {attemptedPath}</span>
                        </p>
                        <p className="text-rose-400">
                            ✗ Error 404: path not found in routing table
                        </p>
                        <p className="text-slate-500">
                            › Suggestion: check URL or return to{" "}
                            <span className="text-cyan-400">home</span>
                            <span className="nf-blink text-cyan-300">_</span>
                        </p>
                    </div>
                </div>

                {/* Quick links */}
                <div className="nf-fade-up nf-d4 flex items-center justify-center gap-2 mb-7 flex-wrap">
                    {quickLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className="nf-glass-sm rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                        >
                            <span className="opacity-60">{link.icon}</span>
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="nf-fade-up nf-d5 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="nf-btn-primary flex-1 rounded-xl py-3 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
                    >
                        Back to Home
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M3 8h10M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="nf-btn-ghost flex-1 rounded-xl py-3 text-sm text-slate-300 font-medium flex items-center justify-center gap-2"
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M13 8H3M7 5l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Go Back
                    </button>
                </div>

                <p className="mt-8 text-xs text-slate-600">
                    © {new Date().getFullYear()} FleetPulse Inc. · FMCSA ELD #FP-12345
                </p>
            </div>
        </div>
    );
}