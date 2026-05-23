import { useState, useEffect, useCallback, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {getAccessToken, getStoredUser, logout} from "./logout.tsx";
import axiosInstance from "../middleware/axiosinterceptor.tsx";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  .dl-root * { font-family: 'DM Sans', sans-serif; }
  .dl-root h1, .dl-root h2, .dl-root h3, .dl-root .font-display { font-family: 'Syne', sans-serif; }
  .dl-root .font-mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes dl-slide-up   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dl-fade-in    { from{opacity:0} to{opacity:1} }
  @keyframes dl-scale-in   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
  @keyframes dl-spin       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dl-pulse-dot  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.5} }
  @keyframes dl-toast-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dl-bar-enter  { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }

  .dl-slide-up  { animation: dl-slide-up  0.5s ease-out forwards; }
  .dl-fade-in   { animation: dl-fade-in   0.4s ease-out forwards; }
  .dl-scale-in  { animation: dl-scale-in  0.4s ease-out forwards; }
  .dl-spin      { animation: dl-spin      1s   linear   infinite; }
  .dl-pulse-dot { animation: dl-pulse-dot 1.8s ease-in-out infinite; }
  .dl-toast-in  { animation: dl-toast-in  0.3s ease-out forwards; }
  .dl-bar-enter { animation: dl-bar-enter 0.5s ease-out forwards; transform-origin: left; }

  .dl-d1{animation-delay:.04s;opacity:0} .dl-d2{animation-delay:.10s;opacity:0}
  .dl-d3{animation-delay:.16s;opacity:0} .dl-d4{animation-delay:.22s;opacity:0}
  .dl-d5{animation-delay:.28s;opacity:0} .dl-d6{animation-delay:.34s;opacity:0}

  /* Glass */
  .dl-glass-page {
    background: rgba(4,15,22,0.96);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  .dl-card {
    background: rgba(6,29,42,0.78);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0,229,204,0.14);
    box-shadow: 0 0 40px rgba(0,229,204,0.05), 0 16px 48px rgba(0,0,0,0.5);
  }
  .dl-card-hover { transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
  .dl-card-hover:hover {
    border-color: rgba(0,229,204,0.28);
    box-shadow: 0 0 30px rgba(0,229,204,0.08), 0 20px 50px rgba(0,0,0,0.55);
    transform: translateY(-1px);
  }
  .dl-glass-sm {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0,229,204,0.12);
  }

  /* Input */
  .dl-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(0,229,204,0.16);
    color: white;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .dl-input:focus {
    outline: none;
    border-color: rgba(0,229,204,0.5);
    background: rgba(0,229,204,0.04);
    box-shadow: 0 0 0 3px rgba(0,229,204,0.08);
  }
  .dl-input::placeholder { color: rgba(148,163,184,.45); }
  .dl-input-error { border-color: rgba(248,113,113,.6) !important; }

  /* Buttons */
  .dl-btn-primary {
    background: linear-gradient(135deg,#00e5cc,#14b8a6);
    box-shadow: 0 0 20px rgba(0,229,204,.35), inset 0 1px 0 rgba(255,255,255,.12);
    transition: box-shadow .2s, transform .2s;
  }
  .dl-btn-primary:hover:not(:disabled){ box-shadow:0 0 34px rgba(0,229,204,.55); transform:translateY(-1px); }
  .dl-btn-primary:disabled{ opacity:.45; cursor:not-allowed; }

  .dl-btn-ghost {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(0,229,204,.14);
    transition: background .2s, border-color .2s, transform .15s;
  }
  .dl-btn-ghost:hover { background:rgba(0,229,204,.08); border-color:rgba(0,229,204,.35); transform:translateY(-1px); }

  .dl-btn-danger {
    background: rgba(248,113,113,.1);
    border: 1px solid rgba(248,113,113,.22);
    transition: background .2s, border-color .2s;
  }
  .dl-btn-danger:hover { background:rgba(248,113,113,.18); border-color:rgba(248,113,113,.4); }

  .dl-btn-logout {
    background: rgba(248,113,113,.1);
    border: 1px solid rgba(248,113,113,.22);
    transition: background .2s, border-color .2s, transform .15s;
  }
  .dl-btn-logout:hover { background:rgba(248,113,113,.2); border-color:rgba(248,113,113,.45); transform:translateY(-1px); }

  /* Log entry card */
  .dl-log-card {
    background: rgba(6,29,42,0.65);
    border: 1px solid rgba(0,229,204,0.13);
    border-radius: 20px;
    transition: border-color .2s;
  }
  .dl-log-card:hover { border-color: rgba(0,229,204,0.25); }

  /* Add log button */
  .dl-add-btn {
    border: 2px dashed rgba(0,229,204,0.22);
    background: rgba(0,229,204,0.03);
    transition: background .2s, border-color .2s;
  }
  .dl-add-btn:hover { background:rgba(0,229,204,0.07); border-color:rgba(0,229,204,0.4); }

  /* HOS grid */
  .dl-hos-grid {
    background: rgba(4,15,22,0.9);
    border: 1px solid rgba(0,229,204,0.18);
    border-radius: 12px;
    overflow: hidden;
  }
  .dl-hos-row-label {
    background: rgba(0,229,204,0.06);
    border-right: 1px solid rgba(0,229,204,0.14);
  }
  .dl-hos-cell {
    border-right: 1px solid rgba(0,229,204,0.07);
    border-bottom: 1px solid rgba(0,229,204,0.07);
    cursor: pointer;
    transition: background .15s;
  }
  .dl-hos-cell:hover { background: rgba(0,229,204,0.1); }
  .dl-hos-cell-active-off     { background: rgba(251,191,36,0.35); }
  .dl-hos-cell-active-sleeper { background: rgba(96,165,250,0.35); }
  .dl-hos-cell-active-driving { background: rgba(52,211,153,0.45); }
  .dl-hos-cell-active-onduty  { background: rgba(249,115,22,0.35); }

  /* HOS Legend */
  .dl-hos-legend-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: #94a3b8;
  }

  /* Error banner */
  .dl-banner-error {
    background: rgba(248,113,113,.08);
    border: 1px solid rgba(248,113,113,.25);
  }

  /* Toast */
  .dl-toast {
    background: rgba(4,15,22,.96);
    border: 1px solid rgba(0,229,204,.18);
    backdrop-filter: blur(16px);
    box-shadow: 0 8px 30px rgba(0,0,0,.5);
  }

  /* Grid bg */
  .dl-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,.025) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,229,204,.025) 1px,transparent 1px);
    background-size: 48px 48px;
  }

  /* Section divider */
  .dl-divider {
    height: 1px;
    background: linear-gradient(90deg,transparent,rgba(0,229,204,.15),transparent);
  }

  /* Recharts overrides */
  .recharts-cartesian-grid line { stroke: rgba(0,229,204,.1); }
  .recharts-tooltip-wrapper { font-size: 12px; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// HOS status rows matching the physical log book
const HOS_ROWS = [
    { key: "off",     label: "1: OFF DUTY",             color: "#fbbf24", cellClass: "dl-hos-cell-active-off"     },
    { key: "sleeper", label: "2: SLEEPER BERTH",         color: "#60a5fa", cellClass: "dl-hos-cell-active-sleeper" },
    { key: "driving", label: "3: DRIVING",               color: "#34d399", cellClass: "dl-hos-cell-active-driving" },
    { key: "onduty",  label: "4: ON DUTY (NOT DRIVING)", color: "#f97316", cellClass: "dl-hos-cell-active-onduty"  },
] as const;

type HOSStatus = "off" | "sleeper" | "driving" | "onduty";

// 24 hours × 4 quarter-hour segments = 96 cells per row
const TOTAL_CELLS = 96;
const HOUR_LABELS = ["Midnight","1","2","3","4","5","6","7","8","9","10","11","Noon","1","2","3","4","5","6","7","8","9","10","11","Midnight"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface HOSGrid {
    off:     boolean[];
    sleeper: boolean[];
    driving: boolean[];
    onduty:  boolean[];
}

interface LogEntry {
    id:                          string;  // local UUID for list key
    log_date:                    string;
    driver_number:               string;
    driver_signature:            string;
    co_driver_name:              string;
    driver_initials:             string;
    vehicle_number:              string;
    trailer_number:              string;
    total_miles_today:           string;
    total_mileage_today:         string;
    operating_center_name_address: string;
    total_off_duty_time:         string;
    total_sleeper_time:          string;
    total_driving_time:          string;
    total_on_duty_time:          string;
    shipper:                     string;
    commodity:                   string;
    load_no:                     string;
    // HOS grid (not sent to backend directly — computed into total_* fields)
    hosGrid:                     HOSGrid;
}

type LogErrors = Partial<Record<keyof Omit<LogEntry, "id" | "hosGrid">, string>>;

interface ToastMsg { id: number; type: "success" | "error" | "info"; message: string; }

interface StoredUser { first_name: string; last_name: string; role: string; email: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() { return `log-${Date.now()}-${Math.random().toString(36).slice(2)}`; }

function emptyHOS(): HOSGrid {
    return {
        off:     Array(TOTAL_CELLS).fill(false),
        sleeper: Array(TOTAL_CELLS).fill(false),
        driving: Array(TOTAL_CELLS).fill(false),
        onduty:  Array(TOTAL_CELLS).fill(false),
    };
}

function countCells(cells: boolean[]): number {
    return cells.filter(Boolean).length;
}

function cellsToHours(cells: boolean[]): string {
    const hours = countCells(cells) * 0.25;
    return hours.toFixed(2);
}

function emptyLog(): LogEntry {
    const today = new Date().toISOString().split("T")[0];
    return {
        id: uid(),
        log_date: today,
        driver_number: "",
        driver_signature: "",
        co_driver_name: "",
        driver_initials: "",
        vehicle_number: "",
        trailer_number: "",
        total_miles_today: "",
        total_mileage_today: "",
        operating_center_name_address: "",
        total_off_duty_time: "0.00",
        total_sleeper_time: "0.00",
        total_driving_time: "0.00",
        total_on_duty_time: "0.00",
        shipper: "",
        commodity: "",
        load_no: "",
        hosGrid: emptyHOS(),
    };
}

// ─── Validation (mirrors Django serializer) ───────────────────────────────────

const SPECIAL_CHARS = new Set("@_!#$%^&*()<>?/\\|}{~:");
const ALPHANUMERIC  = /^[A-Za-z0-9]+$/;

function validateLog(log: LogEntry): LogErrors {
    const e: LogErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!log.log_date) e.log_date = "Log date is required.";
    else if (log.log_date < today) e.log_date = "Log date cannot be less than today's date.";

    if (!log.driver_number) e.driver_number = "Driver number is required.";
    else if (log.driver_number.length > 15) e.driver_number = "Driver number must be less than 15 characters.";
    else if (!ALPHANUMERIC.test(log.driver_number)) e.driver_number = "Driver number should contain only letters and numbers.";

    if (!log.driver_initials) e.driver_initials = "Driver initials are required.";
    else if (log.driver_initials.length > 5) e.driver_initials = "Driver initials must be less than 5 characters.";
    else if (!ALPHANUMERIC.test(log.driver_initials)) e.driver_initials = "Driver initials should contain only letters and numbers.";

    if (!log.vehicle_number) e.vehicle_number = "Vehicle number is required.";
    else if (log.vehicle_number.length > 15) e.vehicle_number = "Vehicle number must be less than 15 characters.";
    else if (!ALPHANUMERIC.test(log.vehicle_number)) e.vehicle_number = "Vehicle number should contain only letters and numbers.";

    if (!log.trailer_number) e.trailer_number = "Trailer number is required.";
    else if (log.trailer_number.length > 15) e.trailer_number = "Trailer number must be less than 15 characters.";
    else if (!ALPHANUMERIC.test(log.trailer_number)) e.trailer_number = "Trailer number should contain only letters and numbers.";

    if (log.co_driver_name) {
        if (log.co_driver_name.length > 20) e.co_driver_name = "Co-driver name must be at most 20 characters.";
        else if ([...log.co_driver_name].some(c => SPECIAL_CHARS.has(c))) e.co_driver_name = "Co-driver name must contain only letters.";
    }

    if (!log.shipper) e.shipper = "Shipper is required.";
    else if (log.shipper.length > 25) e.shipper = "Shipper must be less than 25 characters.";
    else if ([...log.shipper].some(c => SPECIAL_CHARS.has(c))) e.shipper = "Shipper must contain only letters.";

    if (!log.commodity) e.commodity = "Commodity is required.";
    else if (log.commodity.length > 25) e.commodity = "Commodity must be less than 25 characters.";
    else if ([...log.commodity].some(c => SPECIAL_CHARS.has(c))) e.commodity = "Commodity must contain only letters.";

    if (!log.load_no) e.load_no = "Load number is required.";
    else if (log.load_no.length > 20) e.load_no = "Load number must be less than 20 characters.";
    else if (!ALPHANUMERIC.test(log.load_no)) e.load_no = "Load number should contain only letters and numbers.";

    return e;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toasts, onRemove }: { toasts: ToastMsg[]; onRemove: (id: number) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div key={t.id}
                     className="dl-toast dl-toast-in rounded-xl px-4 py-3 flex items-center gap-3 pointer-events-auto min-w-64">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        t.type==="success"?"bg-emerald-400":t.type==="error"?"bg-rose-400":"bg-cyan-400"}`} />
                    <p className="text-sm text-slate-200 flex-1">{t.message}</p>
                    <button onClick={() => onRemove(t.id)} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <svg viewBox="0 0 12 12" className="w-3 h-3">
                            <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}

// ─── Error inline ─────────────────────────────────────────────────────────────

function ErrMsg({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
            <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0">
                <circle cx="6" cy="6" r="5" stroke="#f87171" strokeWidth="1.2"/>
                <path d="M6 4v3M6 8.5v.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {msg}
        </p>
    );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, required, children }: {
    label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
            </label>
            {children}
            <ErrMsg msg={error} />
        </div>
    );
}

// ─── HOS Grid Component ───────────────────────────────────────────────────────

function HOSGridEditor({
                           grid, onChange,
                       }: {
    grid: HOSGrid;
    onChange: (grid: HOSGrid) => void;
}) {
    const [activeStatus, setActiveStatus] = useState<HOSStatus>("driving");
    const [isDrawing, setIsDrawing]       = useState(false);
    const [drawValue, setDrawValue]       = useState(true);

    // Build recharts data from grid — y axis: 0=off,1=sleeper,2=driving,3=onduty
    const STATUS_LABELS: Record<number, string> = { 0: "On Duty", 1: "Driving", 2: "Sleeper", 3: "Off Duty" };

    const chartData = Array.from({ length: TOTAL_CELLS }, (_, i) => {
        let y = 3; // default off
        if (grid.onduty[i])  y = 0;
        else if (grid.driving[i]) y = 1;
        else if (grid.sleeper[i]) y = 2;
        else if (grid.off[i])     y = 3;
        return { cell: i, status: y, hour: (i / 4).toFixed(2) };
    });

    const handleCellInteraction = useCallback((rowKey: HOSStatus, cellIdx: number, isStart: boolean) => {
        if (isStart) {
            const currentVal = grid[rowKey][cellIdx];
            setDrawValue(!currentVal);
            setIsDrawing(true);
        }
        if (!isDrawing && !isStart) return;

        onChange({
            ...grid,
            [rowKey]: grid[rowKey].map((v, i) => {
                if (i !== cellIdx) return v;
                return isStart ? !grid[rowKey][cellIdx] : drawValue;
            }),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grid, isDrawing, drawValue, onChange]);

    useEffect(() => {
        const stop = () => setIsDrawing(false);
        window.addEventListener("mouseup", stop);
        window.addEventListener("touchend", stop);
        return () => { window.removeEventListener("mouseup", stop); window.removeEventListener("touchend", stop); };
    }, []);

    const hours = Array.from({ length: 25 }, (_, i) => i);

    return (
        <div className="space-y-4">
            {/* Status selector */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 mr-1">Paint mode:</span>
                {HOS_ROWS.map(r => (
                    <button
                        key={r.key}
                        type="button"
                        onClick={() => setActiveStatus(r.key as HOSStatus)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-150 ${
                            activeStatus === r.key
                                ? "text-[#040f16] font-bold"
                                : "dl-glass-sm text-slate-400 hover:text-slate-200"
                        }`}
                        style={activeStatus === r.key ? {
                            background: r.color,
                            borderColor: r.color,
                            boxShadow: `0 0 12px ${r.color}60`,
                        } : {}}
                    >
                        {r.label}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => onChange(emptyHOS())}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors ml-auto px-2 py-1"
                >
                    Clear grid
                </button>
            </div>

            {/* Grid */}
            <div className="dl-hos-grid select-none overflow-x-auto">
                {/* Hour header */}
                <div className="flex" style={{ minWidth: 700 }}>
                    <div className="dl-hos-row-label flex-shrink-0 w-36" />
                    {hours.map(h => (
                        <div key={h}
                             className="flex-1 text-center text-[9px] text-slate-500 py-1 border-b border-cyan-500/10 font-mono"
                             style={{ minWidth: 26 }}>
                            {HOUR_LABELS[h]}
                        </div>
                    ))}
                    <div className="w-12 text-[9px] text-slate-500 text-center py-1 border-b border-cyan-500/10 border-l border-l-cyan-500/10">HRS</div>
                </div>

                {/* Status rows */}
                {HOS_ROWS.map(row => {
                    const rowKey = row.key as HOSStatus;
                    const hrs    = cellsToHours(grid[rowKey]);
                    return (
                        <div key={row.key} className="flex" style={{ minWidth: 700 }}>
                            {/* Label */}
                            <div className="dl-hos-row-label flex-shrink-0 w-36 flex items-center px-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: row.color }} />
                                    <span className="text-[10px] text-slate-300 font-medium leading-tight">{row.label}</span>
                                </div>
                            </div>

                            {/* 96 cells */}
                            {grid[rowKey].map((active, ci) => (
                                <div
                                    key={ci}
                                    className={`dl-hos-cell flex-1 h-8 ${active ? row.cellClass : ""} ${
                                        ci % 4 === 0 ? "border-l border-l-cyan-500/15" : ""
                                    }`}
                                    style={{ minWidth: 6.5 }}
                                    onMouseDown={() => handleCellInteraction(rowKey, ci, true)}
                                    onMouseEnter={() => handleCellInteraction(rowKey, ci, false)}
                                    onTouchStart={() => handleCellInteraction(rowKey, ci, true)}
                                />
                            ))}

                            {/* Hours count */}
                            <div className="w-12 flex items-center justify-center border-l border-cyan-500/10">
                <span className="font-mono text-[11px] font-medium" style={{ color: row.color }}>
                  {hrs}
                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Total row */}
                <div className="flex border-t border-cyan-500/10" style={{ minWidth: 700 }}>
                    <div className="dl-hos-row-label flex-shrink-0 w-36 flex items-center px-2 py-2">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Hours</span>
                    </div>
                    <div className="flex-1" />
                    <div className="w-12 flex items-center justify-center border-l border-cyan-500/10 py-2">
            <span className="font-mono text-[11px] text-cyan-300 font-bold">
              {(
                  parseFloat(cellsToHours(grid.off)) +
                  parseFloat(cellsToHours(grid.sleeper)) +
                  parseFloat(cellsToHours(grid.driving)) +
                  parseFloat(cellsToHours(grid.onduty))
              ).toFixed(2)}
            </span>
                    </div>
                </div>
            </div>

            {/* Recharts line chart — visual representation */}
            <div className="dl-glass-sm rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">HOS Activity Chart</p>
                <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,204,0.08)" />
                        <XAxis
                            dataKey="cell"
                            ticks={[0,8,16,24,32,40,48,56,64,72,80,88,96]}
                            tickFormatter={v => `${v/4}h`}
                            tick={{ fontSize: 9, fill: "#475569" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[-0.5, 3.5]}
                            ticks={[0,1,2,3]}
                            tickFormatter={v => STATUS_LABELS[v as number]?.split(" ")[0] ?? ""}
                            tick={{ fontSize: 9, fill: "#475569" }}
                            axisLine={false}
                            tickLine={false}
                            width={44}
                        />
                        <Tooltip
                            contentStyle={{ background: "rgba(4,15,22,0.95)", border: "1px solid rgba(0,229,204,0.2)", borderRadius: 8, fontSize: 11 }}
                            labelFormatter={l => `${(Number(l)/4).toFixed(2)}h`}
                            formatter={(v) => [STATUS_LABELS[v as number], "Status"]}
                        />
                        {/* Reference lines at each hour */}
                        {Array.from({length:24},(_,i)=>i+1).map(h => (
                            <ReferenceLine key={h} x={h*4} stroke="rgba(0,229,204,0.06)" />
                        ))}
                        <Line
                            type="stepAfter"
                            dataKey="status"
                            stroke="#00e5cc"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 3, fill: "#00e5cc" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
                {HOS_ROWS.map(r => (
                    <div key={r.key} className="dl-hos-legend-item">
                        <div className="w-3 h-3 rounded-sm" style={{ background: r.color }} />
                        <span>{r.label}</span>
                        <span className="font-mono font-medium" style={{ color: r.color }}>
              {cellsToHours(grid[r.key as HOSStatus])}h
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Single Log Card ──────────────────────────────────────────────────────────

function LogCard({
                     log, index, errors, onChange, onRemove, canRemove,
                 }: {
    log:      LogEntry;
    index:    number;
    errors:   LogErrors;
    onChange: (id: string, field: keyof LogEntry, value: string | HOSGrid) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}) {
    const [collapsed, setCollapsed] = useState(false);

    const field = (name: keyof Omit<LogEntry, "id"|"hosGrid">) => (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChange(log.id, name, e.target.value);

    const hosChange = useCallback((grid: HOSGrid) => {
        // Auto-update total time fields from grid
        onChange(log.id, "total_off_duty_time",  cellsToHours(grid.off));
        onChange(log.id, "total_sleeper_time",   cellsToHours(grid.sleeper));
        onChange(log.id, "total_driving_time",   cellsToHours(grid.driving));
        onChange(log.id, "total_on_duty_time",   cellsToHours(grid.onduty));
        onChange(log.id, "hosGrid", grid);
    }, [log.id, onChange]);

    const inputCls = (f: keyof LogErrors) =>
        `dl-input w-full rounded-xl px-3 py-2.5 text-sm ${errors[f] ? "dl-input-error" : ""}`;

    const drivingHrs = parseFloat(log.total_driving_time) || 0;
    const ondutyHrs  = parseFloat(log.total_on_duty_time)  || 0;

    return (
        <div className="dl-log-card">
            {/* Card header */}
            <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer"
                onClick={() => setCollapsed(c => !c)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-xs font-700 text-cyan-400">{index + 1}</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">
                            Log Entry {index + 1}
                            {log.log_date && <span className="text-slate-500 font-normal ml-2 text-xs">{log.log_date}</span>}
                        </p>
                        <div className="flex gap-3 mt-0.5">
                            {drivingHrs > 0 && (
                                <span className="text-[10px] text-emerald-400">🚛 {drivingHrs}h driving</span>
                            )}
                            {ondutyHrs > 0 && (
                                <span className="text-[10px] text-orange-400">⚙ {ondutyHrs}h on duty</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {canRemove && (
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onRemove(log.id); }}
                            className="dl-btn-danger rounded-lg p-1.5 text-rose-400"
                            title="Remove log"
                        >
                            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5">
                                <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                <path d="M3 3.5l.7 7.5h6.6l.7-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                    <svg
                        viewBox="0 0 16 16" fill="none"
                        className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
                    >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            {!collapsed && (
                <div className="px-6 pb-6 space-y-6">
                    <div className="dl-divider" />

                    {/* ── Section 1: Driver Info ─────────────────────────────────── */}
                    <div>
                        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/>
                                <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                            Driver Information
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Field label="Log Date" error={errors.log_date} required>
                                <input type="date" value={log.log_date} onChange={field("log_date")}
                                       className={inputCls("log_date")} />
                            </Field>
                            <Field label="Driver Number" error={errors.driver_number} required>
                                <input type="text" value={log.driver_number} onChange={field("driver_number")}
                                       placeholder="DRV001" maxLength={15} className={inputCls("driver_number")} />
                            </Field>
                            <Field label="Driver Initials" error={errors.driver_initials} required>
                                <input type="text" value={log.driver_initials} onChange={field("driver_initials")}
                                       placeholder="JD" maxLength={5} className={inputCls("driver_initials")} />
                            </Field>
                            <Field label="Driver Signature" error={errors.driver_signature}>
                                <input type="text" value={log.driver_signature} onChange={field("driver_signature")}
                                       placeholder="John Doe" className={inputCls("driver_signature")} />
                            </Field>
                            <Field label="Co-Driver Name" error={errors.co_driver_name}>
                                <input type="text" value={log.co_driver_name} onChange={field("co_driver_name")}
                                       placeholder="Jane Smith" maxLength={20} className={inputCls("co_driver_name")} />
                            </Field>
                        </div>
                    </div>

                    <div className="dl-divider" />

                    {/* ── Section 2: Vehicle Info ────────────────────────────────── */}
                    <div>
                        <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                <path d="M1 6h11l2 3v2H1V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                <circle cx="4" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                                <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
                            </svg>
                            Vehicle Information
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Field label="Vehicle Number" error={errors.vehicle_number} required>
                                <input type="text" value={log.vehicle_number} onChange={field("vehicle_number")}
                                       placeholder="TRK12345" maxLength={15} className={inputCls("vehicle_number")} />
                            </Field>
                            <Field label="Trailer Number" error={errors.trailer_number} required>
                                <input type="text" value={log.trailer_number} onChange={field("trailer_number")}
                                       placeholder="TRL45678" maxLength={15} className={inputCls("trailer_number")} />
                            </Field>
                            <Field label="Total Miles Today" error={errors.total_miles_today}>
                                <input type="number" value={log.total_miles_today} onChange={field("total_miles_today")}
                                       placeholder="0" min="0" className={inputCls("total_miles_today")} />
                            </Field>
                            <Field label="Total Mileage Today" error={errors.total_mileage_today}>
                                <input type="number" value={log.total_mileage_today} onChange={field("total_mileage_today")}
                                       placeholder="0" min="0" className={inputCls("total_mileage_today")} />
                            </Field>
                            <Field label="Operating Center & Address" error={errors.operating_center_name_address}>
                                <input type="text" value={log.operating_center_name_address}
                                       onChange={field("operating_center_name_address")}
                                       placeholder="HQ, 123 Main St" className={inputCls("operating_center_name_address")} />
                            </Field>
                        </div>
                    </div>

                    <div className="dl-divider" />

                    {/* ── Section 3: HOS Grid ────────────────────────────────────── */}
                    <div>
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                                <path d="M5 4V2.5M11 4V2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                <path d="M1 7h14" stroke="currentColor" strokeWidth="1.3"/>
                            </svg>
                            Hours of Service (HOS) Grid
                            <span className="text-slate-600 font-normal normal-case tracking-normal text-[10px] ml-1">
                — click/drag cells to mark status
              </span>
                        </p>
                        <HOSGridEditor grid={log.hosGrid} onChange={hosChange} />

                        {/* HOS totals (auto-filled, read-only display) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                            {[
                                { label: "Off Duty",  value: log.total_off_duty_time,  color: "#fbbf24" },
                                { label: "Sleeper",   value: log.total_sleeper_time,    color: "#60a5fa" },
                                { label: "Driving",   value: log.total_driving_time,    color: "#34d399" },
                                { label: "On Duty",   value: log.total_on_duty_time,    color: "#f97316" },
                            ].map(s => (
                                <div key={s.label} className="dl-glass-sm rounded-xl p-3 text-center">
                                    <p className="font-mono text-lg font-bold" style={{ color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>
                                        {s.value}h
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dl-divider" />

                    {/* ── Section 4: Load Info ───────────────────────────────────── */}
                    <div>
                        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                                <path d="M5 3V1.5h6V3M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                            Load Information
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <Field label="Shipper" error={errors.shipper} required>
                                <input type="text" value={log.shipper} onChange={field("shipper")}
                                       placeholder="ABC Freight" maxLength={25} className={inputCls("shipper")} />
                            </Field>
                            <Field label="Commodity" error={errors.commodity} required>
                                <input type="text" value={log.commodity} onChange={field("commodity")}
                                       placeholder="Electronics" maxLength={25} className={inputCls("commodity")} />
                            </Field>
                            <Field label="Load Number" error={errors.load_no} required>
                                <input type="text" value={log.load_no} onChange={field("load_no")}
                                       placeholder="LD20240001" maxLength={20} className={inputCls("load_no")} />
                            </Field>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DriverLogPage() {
    const navigate = useNavigate();

    const [logs,      setLogs]      = useState<LogEntry[]>([emptyLog()]);
    const [allErrors, setAllErrors] = useState<LogErrors[]>([{}]);
    const [loading,   setLoading]   = useState(false);
    const [toasts,    setToasts]    = useState<ToastMsg[]>([]);
    const [showLogout,setShowLogout]= useState(false);
    const toastIdRef                = useRef(0);

    const user = getStoredUser<StoredUser>();

    // Auth guard
    useEffect(() => {
        if (!getAccessToken()) navigate("/login", { replace: true });
    }, [navigate]);

    // Style injection
    useEffect(() => {
        const id = "dl-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    const addToast = useCallback((type: ToastMsg["type"], message: string) => {
        const id = ++toastIdRef.current;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
    }, []);

    const handleLogout = useCallback(() => {
        logout(navigate);
    }, [navigate]);

    // ── Field change ───────────────────────────────────────────────────────────
    const handleChange = useCallback((id: string, field: keyof LogEntry, value: string | HOSGrid) => {
        setLogs(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
        // Clear that field's error
        setAllErrors(prev => {
            const idx = logs.findIndex(l => l.id === id);
            if (idx === -1) return prev;
            const next = [...prev];
            next[idx] = { ...next[idx], [field as keyof LogErrors]: undefined };
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logs]);

    // ── Add / remove log ───────────────────────────────────────────────────────
    const addLog = () => {
        setLogs(prev  => [...prev, emptyLog()]);
        setAllErrors(prev => [...prev, {}]);
    };

    const removeLog = (id: string) => {
        setLogs(prev  => prev.filter(l => l.id !== id));
        setAllErrors(prev => {
            const idx = logs.findIndex(l => l.id === id);
            const next = [...prev];
            next.splice(idx, 1);
            return next;
        });
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate all logs
        const errors = logs.map(validateLog);
        setAllErrors(errors);

        const hasErrors = errors.some(e => Object.keys(e).length > 0);
        if (hasErrors) {
            addToast("error", "Please fix validation errors before submitting.");
            return;
        }

        const token = getAccessToken();
        if (!token) { navigate("/login"); return; }

        setLoading(true);

        // Build payload — strip local-only fields (id, hosGrid)
        const payload = logs.map(({ id: _id, hosGrid: _g, ...rest }) => rest);

        try {
            await axiosInstance.post(
                `${API_BASE_URL}/log/create/`,
                payload,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            addToast("success", `${logs.length} driver log${logs.length > 1 ? "s" : ""} saved successfully!`);
            // Reset to a fresh single log
            setLogs([emptyLog()]);
            setAllErrors([{}]);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;
                if (Array.isArray(data)) {
                    // DRF returns array of error objects for many=True
                    setAllErrors(data.map((d: Record<string, string[]>) => {
                        const mapped: LogErrors = {};
                        Object.entries(d).forEach(([k, v]) => {
                            (mapped as Record<string, string>)[k] = Array.isArray(v) ? v[0] : String(v);
                        });
                        return mapped;
                    }));
                    addToast("error", "Some logs have errors. Please review each entry.");
                } else if (data?.detail) {
                    addToast("error", data.detail);
                } else {
                    addToast("error", "Failed to save logs. Please try again.");
                }
            } else {
                addToast("error", "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const totalDrivingHrs = logs.reduce((s, l) => s + (parseFloat(l.total_driving_time)||0), 0);

    return (
        <div className="dl-root dl-glass-page min-h-screen text-white">
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-120px] right-[-100px] w-[450px] h-[450px] rounded-full bg-cyan-500/4 blur-[100px]" />
                <div className="absolute bottom-[-100px] left-[-80px]  w-[380px] h-[380px] rounded-full bg-teal-500/4 blur-[90px]"  />
                <div className="dl-grid-bg absolute inset-0" />
            </div>

            {/* ── Topbar ──────────────────────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 border-b border-cyan-500/10"
                 style={{ background: "rgba(4,15,22,0.94)", backdropFilter: "blur(20px)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
                                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                    <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                                    <circle cx="6.5"  cy="16" r="2" fill="white"/>
                                    <circle cx="17.5" cy="16" r="2" fill="white"/>
                                </svg>
                            </div>
                            <div className="absolute inset-0 rounded-lg bg-cyan-400/15 blur-sm" />
                        </div>
                        <span style={{ fontFamily:"'Syne',sans-serif" }} className="text-lg font-700 tracking-tight hidden sm:block">
              <span className="text-white">fleet</span><span className="text-cyan-400">pulse</span>
            </span>
                    </a>

                    {/* Center title */}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 dl-pulse-dot" />
                        <span style={{ fontFamily:"'Syne',sans-serif" }} className="text-sm font-600 text-slate-200">
              Driver Daily Log
            </span>
                    </div>

                    {/* Right — user + logout */}
                    <div className="flex items-center gap-3 relative">
                        {user && (
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/35 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-cyan-400">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                                </div>
                                <span className="text-xs text-slate-400">
                  {user.first_name} {user.last_name}
                </span>
                            </div>
                        )}

                        {/* Logout button */}
                        <button
                            onClick={() => setShowLogout(true)}
                            className="dl-btn-logout rounded-lg px-3 py-1.5 text-xs text-rose-400 font-medium flex items-center gap-1.5"
                        >
                            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Logout confirm modal ─────────────────────────────────────────────── */}
            {showLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
                     style={{ background: "rgba(4,15,22,0.8)", backdropFilter: "blur(8px)" }}>
                    <div className="dl-scale-in dl-card rounded-2xl p-8 max-w-sm w-full text-center">
                        <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
                            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                                <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M16 17l5-5-5-5M21 12H9" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 style={{ fontFamily:"'Syne',sans-serif" }} className="text-xl font-700 text-white mb-2">
                            Sign out?
                        </h3>
                        <p className="text-sm text-slate-400 mb-7">
                            You'll be redirected to the login page. Any unsaved logs will be lost.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogout(false)}
                                className="dl-btn-ghost flex-1 rounded-xl py-2.5 text-sm text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg,#f87171,#ef4444)", boxShadow:"0 0 20px rgba(248,113,113,.35)" }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Page content ────────────────────────────────────────────────────── */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">

                {/* Page header */}
                <div className="dl-slide-up dl-d1 mb-8">
                    <div className="inline-flex items-center gap-2 dl-glass-sm rounded-full px-3 py-1 text-xs font-medium text-amber-300 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        ELD — Electronic Logging Device
                    </div>
                    <h1 style={{ fontFamily:"'Syne',sans-serif" }} className="text-3xl font-800 text-white mb-2">
                        Driver's Daily Log
                    </h1>
                    <p className="text-slate-400 text-sm">
                        One calendar day (24 hours) · CN only: Cycle 70 hr / 7 day.
                        You can add multiple logs for the same route.
                    </p>
                </div>

                {/* Stats bar */}
                <div className="dl-slide-up dl-d2 grid grid-cols-3 gap-3 mb-8">
                    {[
                        { label: "Log Entries",    value: logs.length,                     color: "text-cyan-300" },
                        { label: "Total Drive Hrs",value: totalDrivingHrs.toFixed(2) + "h", color: "text-emerald-300" },
                        { label: "HOS Limit",      value: "11h / 14h",                      color: "text-amber-300" },
                    ].map(s => (
                        <div key={s.label} className="dl-card rounded-2xl p-4 text-center">
                            <p style={{ fontFamily:"'Syne',sans-serif" }} className={`text-2xl font-700 ${s.color}`}>
                                {s.value}
                            </p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Log entries */}
                    {logs.map((log, idx) => (
                        <div key={log.id} className="dl-slide-up" style={{ animationDelay: `${0.1 + idx * 0.06}s`, opacity: 0 }}>
                            <LogCard
                                log={log}
                                index={idx}
                                errors={allErrors[idx] || {}}
                                onChange={handleChange}
                                onRemove={removeLog}
                                canRemove={logs.length > 1}
                            />
                        </div>
                    ))}

                    {/* Add another log */}
                    <button
                        type="button"
                        onClick={addLog}
                        className="dl-add-btn w-full rounded-2xl py-4 text-sm text-slate-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                            <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        Add Another Log Entry
                    </button>

                    {/* Submit */}
                    <div className="dl-slide-up dl-d5 pt-2 flex flex-col sm:flex-row gap-4 items-center justify-end">
                        <p className="text-xs text-slate-500 mr-auto">
                            Submitting {logs.length} log{logs.length > 1 ? "s" : ""} to the server
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="dl-btn-ghost rounded-xl px-6 py-3 text-sm text-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="dl-btn-primary rounded-xl px-8 py-3 text-sm font-semibold text-[#040f16] flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 dl-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,.2)" strokeWidth="3"/>
                                        <path d="M12 2a10 10 0 0110 10" stroke="#040f16" strokeWidth="3" strokeLinecap="round"/>
                                    </svg>
                                    Saving {logs.length} Log{logs.length > 1 ? "s" : ""}…
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                        <path d="M13 10v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                        <path d="M8 2v7M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Submit {logs.length} Log{logs.length > 1 ? "s" : ""}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <Toast toasts={toasts} onRemove={id => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}