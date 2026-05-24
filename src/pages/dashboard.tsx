import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../middleware/axiosinterceptor.tsx";
import axios from "axios";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  .db-root * { font-family: 'DM Sans', sans-serif; }
  .db-root .font-display { font-family: 'Syne', sans-serif; }
  .db-root .font-mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes db-fade-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes db-fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes db-scale-in  { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
  @keyframes db-spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes db-pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  @keyframes db-shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes db-slide-in  { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes db-bar-grow  { from{width:0} to{width:var(--w)} }
  @keyframes db-glow-pulse{ 0%,100%{box-shadow:0 0 20px rgba(0,229,204,.12)} 50%{box-shadow:0 0 40px rgba(0,229,204,.28)} }

  .db-fade-up  { animation: db-fade-up  0.5s ease-out forwards; }
  .db-fade-in  { animation: db-fade-in  0.4s ease-out forwards; }
  .db-scale-in { animation: db-scale-in 0.35s ease-out forwards; }
  .db-spin     { animation: db-spin     1s linear infinite; }
  .db-pulse    { animation: db-pulse    2s ease-in-out infinite; }
  .db-slide-in { animation: db-slide-in 0.45s ease-out forwards; }

  .db-d1{animation-delay:.04s;opacity:0} .db-d2{animation-delay:.09s;opacity:0}
  .db-d3{animation-delay:.14s;opacity:0} .db-d4{animation-delay:.19s;opacity:0}
  .db-d5{animation-delay:.24s;opacity:0} .db-d6{animation-delay:.29s;opacity:0}
  .db-d7{animation-delay:.34s;opacity:0} .db-d8{animation-delay:.39s;opacity:0}

  .db-shimmer-text {
    background: linear-gradient(90deg, #00e5cc 0%, #fff 45%, #00e5cc 90%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: db-shimmer 4s linear infinite;
  }

  /* Glass layers */
  .db-topbar {
    background: rgba(4,15,22,0.94);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(0,229,204,0.1);
  }
  .db-sidebar {
    background: rgba(4,15,22,0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid rgba(0,229,204,0.1);
  }
  .db-card {
    background: rgba(6,29,42,0.75);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(0,229,204,0.14);
    transition: border-color .25s, box-shadow .25s, transform .25s;
  }
  .db-card:hover {
    border-color: rgba(0,229,204,0.28);
    box-shadow: 0 0 28px rgba(0,229,204,0.07), 0 16px 40px rgba(0,0,0,.45);
    transform: translateY(-2px);
  }
  .db-card-glow { animation: db-glow-pulse 3s ease-in-out infinite; }
  .db-glass-sm {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.12);
    backdrop-filter: blur(10px);
  }

  /* Table */
  .db-table-row {
    border-bottom: 1px solid rgba(0,229,204,0.07);
    transition: background .15s;
  }
  .db-table-row:hover { background: rgba(0,229,204,0.04); }
  .db-table-head { border-bottom: 1px solid rgba(0,229,204,0.14); }

  /* Pagination */
  .db-page-btn {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.14);
    transition: background .2s, border-color .2s, transform .15s;
  }
  .db-page-btn:hover:not(:disabled) {
    background: rgba(0,229,204,0.1);
    border-color: rgba(0,229,204,0.4);
    transform: translateY(-1px);
  }
  .db-page-btn:disabled { opacity:.35; cursor:not-allowed; }
  .db-page-active {
    background: linear-gradient(135deg,#00e5cc,#14b8a6) !important;
    border-color: transparent !important;
    color: #040f16 !important;
    font-weight: 700;
    box-shadow: 0 0 16px rgba(0,229,204,.4);
  }

  /* Stat card accent bar */
  .db-accent-bar { height: 3px; border-radius: 2px; }

  /* Nav item */
  .db-nav-item {
    transition: background .18s, color .18s, border-color .18s;
    border-left: 2px solid transparent;
  }
  .db-nav-item:hover { background: rgba(0,229,204,0.07); color: #cbd5e1; }
  .db-nav-active {
    background: rgba(0,229,204,0.1) !important;
    border-left-color: #00e5cc !important;
    color: #00e5cc !important;
  }

  /* Badge */
  .db-badge-driver  { background:rgba(52,211,153,.14); color:#34d399; border:1px solid rgba(52,211,153,.3); }
  .db-badge-admin   { background:rgba(251,191,36,.14); color:#fbbf24; border:1px solid rgba(251,191,36,.3); }
  .db-badge-active  { background:rgba(52,211,153,.14); color:#34d399; border:1px solid rgba(52,211,153,.3); }
  .db-badge-pending { background:rgba(251,191,36,.14); color:#fbbf24; border:1px solid rgba(251,191,36,.3); }

  /* Logout */
  .db-btn-logout {
    background: rgba(248,113,113,.1);
    border: 1px solid rgba(248,113,113,.22);
    transition: background .2s, border-color .2s, transform .15s;
  }
  .db-btn-logout:hover { background:rgba(248,113,113,.2); border-color:rgba(248,113,113,.45); transform:translateY(-1px); }

  /* Primary button */
  .db-btn-primary {
    background: linear-gradient(135deg,#00e5cc,#14b8a6);
    box-shadow: 0 0 18px rgba(0,229,204,.35), inset 0 1px 0 rgba(255,255,255,.12);
    transition: box-shadow .2s, transform .2s;
  }
  .db-btn-primary:hover { box-shadow:0 0 30px rgba(0,229,204,.55); transform:translateY(-1px); }

  /* Grid bg */
  .db-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,.025) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,229,204,.025) 1px,transparent 1px);
    background-size: 48px 48px;
  }

  /* Coordinate chip */
  .db-coord { font-family:'JetBrains Mono',monospace; font-size:10px; color:#64748b; }

  /* Tab */
  .db-tab {
    border-bottom: 2px solid transparent;
    transition: color .18s, border-color .18s;
    color: #64748b;
  }
  .db-tab:hover { color: #94a3b8; }
  .db-tab-active { border-bottom-color: #00e5cc !important; color: #00e5cc !important; }

  /* Skeleton */
  @keyframes db-skel { 0%,100%{opacity:.4} 50%{opacity:.8} }
  .db-skeleton {
    background: rgba(0,229,204,0.06);
    border-radius: 6px;
    animation: db-skel 1.6s ease-in-out infinite;
  }

  /* Scrollbar */
  .db-scroll::-webkit-scrollbar { width:4px; height:4px; }
  .db-scroll::-webkit-scrollbar-track { background:transparent; }
  .db-scroll::-webkit-scrollbar-thumb { background:rgba(0,229,204,.18); border-radius:4px; }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface GeoPoint { type: "Point"; coordinates: [number, number]; }

interface RouteItem {
    id:               number;
    current_location: GeoPoint;
    pickup_location:  GeoPoint;
    dropoff_location: GeoPoint;
    created_at:       string;
    updated_at:       string;
    created_by:       string;
}

interface LogItem {
    id:                          number;
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
    route:                       number;
    created_at:                  string;
    driver_name:                 string;
    route_name:                  string;
}

interface UserItem {
    id:          number;
    first_name:  string;
    last_name:   string;
    email:       string;
    user_number: string | null;
    country:     string;
    role:        string;
    passport:    string;
    is_verified: boolean;
    is_staff:    boolean;
    is_superuser:boolean;
    created_at:  string;
}

interface PaginatedResponse<T> {
    count:    number;
    next:     string | null;
    previous: string | null;
    results:  T[];
}

type TabKey = "routes" | "logs" | "users";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCoord(pt: GeoPoint): string {
    const [lng, lat] = pt.coordinates;
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}

function fmtTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
}

function getInitials(name: string): string {
    return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0,2);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="relative w-10 h-10">
                <svg className="w-10 h-10 db-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(0,229,204,.15)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="#00e5cc" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl db-glass-sm flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-slate-600">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M9 9h.01M15 9h.01M9 15h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
            </div>
            <p className="text-slate-500 text-sm">{label}</p>
        </div>
    );
}

function Pagination({
                        total, page, pageSize, onPage,
                    }: { total:number; page:number; pageSize:number; onPage:(p:number)=>void; }) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    const pages: (number|"…")[] = [];
    if (totalPages <= 7) {
        for (let i=1;i<=totalPages;i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("…");
        for (let i=Math.max(2,page-1);i<=Math.min(totalPages-1,page+1);i++) pages.push(i);
        if (page < totalPages-2) pages.push("…");
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-between px-1 mt-5">
            <p className="text-xs text-slate-500">
                Showing <span className="text-slate-300">{Math.min((page-1)*pageSize+1, total)}–{Math.min(page*pageSize, total)}</span> of <span className="text-slate-300">{total}</span>
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPage(page-1)}
                    disabled={page===1}
                    className="db-page-btn rounded-lg px-2.5 py-1.5 text-xs text-slate-400 flex items-center gap-1"
                >
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                        <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                {pages.map((p,i) =>
                    p === "…" ? (
                        <span key={`e${i}`} className="text-slate-600 px-1 text-xs">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPage(p as number)}
                            className={`db-page-btn rounded-lg w-8 h-8 text-xs text-slate-400 ${page===p?"db-page-active":""}`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onPage(page+1)}
                    disabled={page===totalPages}
                    className="db-page-btn rounded-lg px-2.5 py-1.5 text-xs text-slate-400 flex items-center gap-1"
                >
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
                      label, value, sub, accentColor, icon, delay,
                  }: {
    label:string; value:string|number; sub?:string;
    accentColor:string; icon:React.ReactNode; delay:string;
}) {
    return (
        <div className={`db-card db-fade-up rounded-2xl p-5 ${delay}`}>
            <div className="db-accent-bar mb-4" style={{ background: accentColor, width:"40px" }} />
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
                    <p className="font-display text-3xl font-800 text-white" style={{ fontFamily:"'Syne',sans-serif" }}>{value}</p>
                    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${accentColor}18`, border:`1px solid ${accentColor}30` }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

// ─── Routes Table ─────────────────────────────────────────────────────────────

function RoutesTable({
                         data, total, page, onPage, loading,
                     }: { data:RouteItem[]; total:number; page:number; onPage:(p:number)=>void; loading:boolean; }) {
    if (loading) return <Spinner />;
    if (!data.length) return <EmptyState label="No routes found" />;

    return (
        <div>
            <div className="overflow-x-auto db-scroll rounded-xl">
                <table className="w-full min-w-[700px]">
                    <thead>
                    <tr className="db-table-head">
                        {["ID","Created By","Current","Pickup","Dropoff","Date","Time"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((r, i) => (
                        <tr key={r.id}
                            className={`db-table-row db-slide-in`}
                            style={{ animationDelay:`${0.03*i}s`, opacity:0 }}
                        >
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-cyan-400 font-medium">#{r.id}</span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[9px] font-bold text-cyan-400">{getInitials(r.created_by)}</span>
                                    </div>
                                    <span className="text-sm text-slate-300">{r.created_by}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                    <span className="db-coord">{fmtCoord(r.current_location)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                    <span className="db-coord">{fmtCoord(r.pickup_location)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                                    <span className="db-coord">{fmtCoord(r.dropoff_location)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-400">{fmtDate(r.created_at)}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-500 font-mono">{fmtTime(r.created_at)}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Pagination total={total} page={page} pageSize={10} onPage={onPage} />
        </div>
    );
}

// ─── Logs Table ───────────────────────────────────────────────────────────────

function LogsTable({
                       data, total, page, onPage, loading,
                   }: { data:LogItem[]; total:number; page:number; onPage:(p:number)=>void; loading:boolean; }) {
    if (loading) return <Spinner />;
    if (!data.length) return <EmptyState label="No driver logs found" />;

    return (
        <div>
            <div className="overflow-x-auto db-scroll rounded-xl">
                <table className="w-full min-w-[900px]">
                    <thead>
                    <tr className="db-table-head">
                        {["ID","Driver","Vehicle","Trailer","Date","Driving Hrs","On Duty","Shipper","Commodity","Load #","Route #"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((l, i) => (
                        <tr key={l.id}
                            className="db-table-row db-slide-in"
                            style={{ animationDelay:`${0.03*i}s`, opacity:0 }}
                        >
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-cyan-400 font-medium">#{l.id}</span>
                            </td>
                            <td className="px-4 py-3">
                                <div>
                                    <p className="text-sm text-slate-300">{l.driver_name}</p>
                                    <p className="text-[10px] text-slate-600 font-mono">{l.driver_number}</p>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-slate-400">{l.vehicle_number}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-slate-400">{l.trailer_number}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-400">{fmtDate(l.log_date)}</span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-emerald-400"
                                            style={{ width:`${Math.min((parseFloat(l.total_driving_time)/11)*100,100)}%` }}
                                        />
                                    </div>
                                    <span className="font-mono text-xs text-emerald-400">{l.total_driving_time}h</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-orange-400">{l.total_on_duty_time}h</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-400">{l.shipper}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-400">{l.commodity}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-slate-500">{l.load_no}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-cyan-500">#{l.route}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Pagination total={total} page={page} pageSize={10} onPage={onPage} />
        </div>
    );
}

// ─── Users Table ──────────────────────────────────────────────────────────────

function UsersTable({
                        data, total, page, onPage, loading,
                    }: { data:UserItem[]; total:number; page:number; onPage:(p:number)=>void; loading:boolean; }) {
    if (loading) return <Spinner />;
    if (!data.length) return <EmptyState label="No users found" />;

    return (
        <div>
            <div className="overflow-x-auto db-scroll rounded-xl">
                <table className="w-full min-w-[700px]">
                    <thead>
                    <tr className="db-table-head">
                        {["User","Email","Country","Role","Passport","Verified","Joined"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((u, i) => (
                        <tr key={u.id}
                            className="db-table-row db-slide-in"
                            style={{ animationDelay:`${0.03*i}s`, opacity:0 }}
                        >
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-teal-400">
                        {getInitials(`${u.first_name} ${u.last_name}`)}
                      </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-200">{u.first_name} {u.last_name}</p>
                                        <p className="text-[10px] text-slate-600">#{u.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-400">{u.email}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-400">{u.country}</span>
                            </td>
                            <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.role==="admin"?"db-badge-admin":"db-badge-driver"}`}>
                    {u.role}
                  </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs text-slate-500">{u.passport || "—"}</span>
                            </td>
                            <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.is_verified?"db-badge-active":"db-badge-pending"}`}>
                    {u.is_verified?"Verified":"Pending"}
                  </span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-slate-500">{fmtDate(u.created_at)}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Pagination total={total} page={page} pageSize={10} onPage={onPage} />
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const navigate = useNavigate();

    // Auth guard
    useEffect(() => {
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        if (!token) navigate("/", { replace: true });
    }, [navigate]);

    // User from localStorage
    const firstName = localStorage.getItem("first_name") || "";
    const lastName  = localStorage.getItem("last_name")  || "";
    const fullName  = `${firstName} ${lastName}`.trim() || "User";

    // Style injection
    useEffect(() => {
        const id = "db-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    // ── Tab state ────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<TabKey>("routes");
    const [showLogout, setShowLogout] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ── Routes state ─────────────────────────────────────────────────────────
    const [routes,      setRoutes]      = useState<RouteItem[]>([]);
    const [routeTotal,  setRouteTotal]  = useState(0);
    const [routePage,   setRoutePage]   = useState(1);
    const [routeLoading,setRouteLoading]= useState(false);

    // ── Logs state ───────────────────────────────────────────────────────────
    const [logs,      setLogs]      = useState<LogItem[]>([]);
    const [logTotal,  setLogTotal]  = useState(0);
    const [logPage,   setLogPage]   = useState(1);
    const [logLoading,setLogLoading]= useState(false);

    // ── Users state ──────────────────────────────────────────────────────────
    const [users,      setUsers]      = useState<UserItem[]>([]);
    const [userTotal,  setUserTotal]  = useState(0);
    const [userPage,   setUserPage]   = useState(1);
    const [userLoading,setUserLoading]= useState(false);

    // ── Fetch helpers ─────────────────────────────────────────────────────────

    const fetchRoutes = useCallback(async (page: number) => {
        setRouteLoading(true);
        try {
            const { data } = await axiosInstance.get<PaginatedResponse<RouteItem>>(
                `/route/list/?page=${page}`
            );
            setRoutes(data.results);
            setRouteTotal(data.count);
        } catch (err) {
            if (!axios.isAxiosError(err) || err.response?.status !== 401) {
                console.error("routes fetch error", err);
            }
        } finally {
            setRouteLoading(false);
        }
    }, []);

    const fetchLogs = useCallback(async (page: number) => {
        setLogLoading(true);
        try {
            const { data } = await axiosInstance.get<PaginatedResponse<LogItem>>(
                `/log/list/?page=${page}`
            );
            setLogs(data.results);
            setLogTotal(data.count);
        } catch (err) {
            if (!axios.isAxiosError(err) || err.response?.status !== 401) {
                console.error("logs fetch error", err);
            }
        } finally {
            setLogLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async (page: number) => {
        setUserLoading(true);
        try {
            const { data } = await axiosInstance.get<PaginatedResponse<UserItem>>(
                `/auth/list_users/?page=${page}`
            );
            setUsers(data.results);
            setUserTotal(data.count);
        } catch (err) {
            if (!axios.isAxiosError(err) || err.response?.status !== 401) {
                console.error("users fetch error", err);
            }
        } finally {
            setUserLoading(false);
        }
    }, []);

    // Initial loads
    useEffect(() => { fetchRoutes(1); }, [fetchRoutes]);
    useEffect(() => { fetchLogs(1);   }, [fetchLogs]);
    useEffect(() => { fetchUsers(1);  }, [fetchUsers]);

    const handleRoutePage = (p: number) => { setRoutePage(p); fetchRoutes(p); };
    const handleLogPage   = (p: number) => { setLogPage(p);   fetchLogs(p);   };
    const handleUserPage  = (p: number) => { setUserPage(p);  fetchUsers(p);  };

    // ── Logout ────────────────────────────────────────────────────────────────

    const handleLogout = () => {
        ["access_token","refresh_token","user","first_name","last_name","email","user_id"]
            .forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
        navigate("/");
    };

    // ── Nav items ─────────────────────────────────────────────────────────────

    const NAV_ITEMS: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
        {
            key: "routes", label: "Routes", count: routeTotal,
            icon: <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M2 12 Q6 4 10 8 Q14 12 14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
        },
        {
            key: "logs", label: "Driver Logs", count: logTotal,
            icon: <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><rect x="2" y="2" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
        },
        {
            key: "users", label: "Users", count: userTotal,
            icon: <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
        },
    ];

    const STAT_CARDS = [
        { label:"Total Routes",     value:routeTotal, sub:`Page ${routePage}`, accentColor:"#00e5cc", delay:"db-d1",
            icon:<svg viewBox="0 0 16 16" fill="none" className="w-5 h-5" style={{color:"#00e5cc"}}><path d="M2 12 Q6 4 10 8 Q14 12 14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
        { label:"Driver Logs",      value:logTotal,   sub:"All entries",       accentColor:"#34d399", delay:"db-d2",
            icon:<svg viewBox="0 0 16 16" fill="none" className="w-5 h-5" style={{color:"#34d399"}}><rect x="2" y="2" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
        { label:"Registered Users", value:userTotal,  sub:"Across all roles",  accentColor:"#fbbf24", delay:"db-d3",
            icon:<svg viewBox="0 0 16 16" fill="none" className="w-5 h-5" style={{color:"#fbbf24"}}><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
        { label:"Active Drivers",   value:users.filter(u=>u.role==="driver").length, sub:"From current page", accentColor:"#a78bfa", delay:"db-d4",
            icon:<svg viewBox="0 0 16 16" fill="none" className="w-5 h-5" style={{color:"#a78bfa"}}><path d="M1 6h11l2 3v2H1V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="4" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
    ];

    return (
        <div className="db-root min-h-screen bg-[#040f16] text-white flex flex-col">
            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-120px] right-[-100px] w-[450px] h-[450px] rounded-full bg-cyan-500/4  blur-[100px]" />
                <div className="absolute bottom-[-100px] left-[-80px]  w-[380px] h-[380px] rounded-full bg-teal-500/4  blur-[90px]"  />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/2 blur-[120px]" />
                <div className="db-grid-bg absolute inset-0" />
            </div>

            {/* ── Topbar ──────────────────────────────────────────────────────────── */}
            <header className="db-topbar sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6">
                {/* Left: hamburger (mobile) + logo */}
                <div className="flex items-center gap-3">
                    <button
                        className="sm:hidden p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                        onClick={() => setSidebarOpen(o => !o)}
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
                            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
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
                </div>

                {/* Center title */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 db-pulse" />
                    <span style={{ fontFamily:"'Syne',sans-serif" }} className="text-sm font-600 text-slate-300 hidden sm:block">
            Dashboard
          </span>
                </div>

                {/* Right: user + actions */}
                <div className="flex items-center gap-3">
                    {/* New route button */}
                    <button
                        onClick={() => navigate("/route")}
                        className="db-btn-primary hidden sm:flex rounded-lg px-3 py-1.5 text-xs font-semibold text-[#040f16] items-center gap-1.5"
                    >
                        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
                            <path d="M7 4.5V9.5M4.5 7h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        New Route
                    </button>

                    {/* User avatar + name */}
                    <div className="flex items-center gap-2 db-glass-sm rounded-xl px-3 py-1.5">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/35 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] font-bold text-cyan-400">{getInitials(fullName)}</span>
                        </div>
                        <span className="text-xs text-slate-300 hidden sm:block max-w-[100px] truncate">{fullName}</span>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => setShowLogout(true)}
                        className="db-btn-logout rounded-lg px-2.5 py-1.5 text-xs text-rose-400 font-medium flex items-center gap-1.5"
                    >
                        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                            <path d="M5.5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                            <path d="M9.5 9.5l3-2.5-3-2.5M12.5 7H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* ── Logout confirm ───────────────────────────────────────────────────── */}
            {showLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
                     style={{ background:"rgba(4,15,22,0.85)", backdropFilter:"blur(10px)" }}>
                    <div className="db-scale-in db-card rounded-2xl p-8 max-w-sm w-full text-center">
                        <div className="w-14 h-14 rounded-full bg-rose-500/12 border border-rose-500/28 flex items-center justify-center mx-auto mb-4">
                            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                                <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M16 17l5-5-5-5M21 12H9" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 style={{ fontFamily:"'Syne',sans-serif" }} className="text-xl font-700 text-white mb-2">Sign out?</h3>
                        <p className="text-sm text-slate-400 mb-7">You'll be redirected to the login page.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowLogout(false)}
                                    className="flex-1 db-glass-sm rounded-xl py-2.5 text-sm text-slate-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleLogout}
                                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
                                    style={{ background:"linear-gradient(135deg,#f87171,#ef4444)", boxShadow:"0 0 20px rgba(248,113,113,.35)" }}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Body ────────────────────────────────────────────────────────────── */}
            <div className="relative flex flex-1 overflow-hidden">

                {/* ── Sidebar ─────────────────────────────────────────────────────── */}
                <aside className={`db-sidebar flex-shrink-0 w-56 flex flex-col fixed sm:relative inset-y-0 left-0 z-20 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `} style={{ height:"calc(100vh - 56px)", top:56 }}>
                    <div className="p-4 flex-1 overflow-y-auto db-scroll">
                        {/* User card */}
                        <div className="db-glass-sm rounded-2xl p-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2">
                                <span style={{ fontFamily:"'Syne',sans-serif" }} className="text-sm font-700 text-cyan-300">{getInitials(fullName)}</span>
                            </div>
                            <p className="text-center text-sm text-slate-200 font-medium truncate">{fullName}</p>
                            <p className="text-center text-[10px] text-slate-500 mt-0.5">Fleet Driver</p>
                        </div>

                        {/* Nav */}
                        <nav className="space-y-1">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                                    className={`db-nav-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                                        activeTab === item.key ? "db-nav-active" : "text-slate-500"
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        {item.icon}
                                        {item.label}
                                    </div>
                                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                                        activeTab===item.key ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-600"
                                    }`}>
                    {item.count}
                  </span>
                                </button>
                            ))}
                        </nav>

                        {/* Quick actions */}
                        <div className="mt-6 space-y-2">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest px-1 mb-2">Quick Actions</p>
                            <button
                                onClick={() => navigate("/route")}
                                className="w-full db-glass-sm rounded-xl px-3 py-2.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                            >
                                <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                                    <path d="M7 4.5V9.5M4.5 7h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                </svg>
                                New Route
                            </button>
                            <button
                                onClick={() => navigate("/driver-log")}
                                className="w-full db-glass-sm rounded-xl px-3 py-2.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                            >
                                <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                                    <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                                    <path d="M4.5 4.5h5M4.5 7h5M4.5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                </svg>
                                New Driver Log
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Sidebar overlay (mobile) */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-10 bg-black/50 sm:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* ── Main content ─────────────────────────────────────────────────── */}
                <main className="flex-1 overflow-y-auto db-scroll p-4 sm:p-6">

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {STAT_CARDS.map(s => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </div>

                    {/* Main card */}
                    <div className="db-card rounded-2xl p-5 sm:p-6">
                        {/* Tabs */}
                        <div className="flex items-center gap-1 border-b border-cyan-500/10 mb-6 overflow-x-auto db-scroll">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => setActiveTab(item.key)}
                                    className={`db-tab flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                                        activeTab===item.key?"db-tab-active":""
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                                        activeTab===item.key?"bg-cyan-500/15 text-cyan-400":"bg-slate-800 text-slate-600"
                                    }`}>
                    {item.count}
                  </span>
                                </button>
                            ))}
                        </div>

                        {/* Table content */}
                        {activeTab === "routes" && (
                            <RoutesTable
                                data={routes} total={routeTotal}
                                page={routePage} onPage={handleRoutePage}
                                loading={routeLoading}
                            />
                        )}
                        {activeTab === "logs" && (
                            <LogsTable
                                data={logs} total={logTotal}
                                page={logPage} onPage={handleLogPage}
                                loading={logLoading}
                            />
                        )}
                        {activeTab === "users" && (
                            <UsersTable
                                data={users} total={userTotal}
                                page={userPage} onPage={handleUserPage}
                                loading={userLoading}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}