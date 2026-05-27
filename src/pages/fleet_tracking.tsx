import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TruckStatus = "On Route" | "Idle" | "Break" | "Alert";

interface Truck {
    id: string;
    driver: string;
    status: TruckStatus;
    lat: number;
    lng: number;
    speed: number;
    fuel: number;
    miles: number;
    eta: string;
    load: string;
    temp: string | null;
}

interface StatCard {
    label: string;
    value: string;
    sub: string;
    icon: string;
    color: string;
}

interface MapPin {
    x: number;
    y: number;
    truck: string;
    status: TruckStatus;
}

interface RouteEvent {
    time: string;
    event: string;
    type: "depart" | "geo" | "break" | "fuel" | "drive" | "alert";
}

interface StatusMeta {
    color: string;
    bg: string;
    border: string;
    dot: string;
}

interface LiveMapProps {
    selectedTruck: string | null;
    onSelect: (id: string | null) => void;
}

interface TruckRowProps {
    truck: Truck;
    selected: boolean;
    onClick: () => void;
}

interface DetailPanelProps {
    truck: Truck;
    onClose: () => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TRUCKS: Truck[] = [
    { id: "TRK-4821", driver: "Marcus Webb",    status: "On Route", lat: 41.8781, lng: -87.6298,  speed: 62, fuel: 74, miles: 312, eta: "2h 14m", load: "CHI → DEN", temp: null },
    { id: "TRK-3310", driver: "Sarah Okafor",   status: "On Route", lat: 39.7392, lng: -104.9903, speed: 58, fuel: 51, miles: 189, eta: "1h 42m", load: "DEN → PHX", temp: null },
    { id: "TRK-7754", driver: "James Holloway", status: "Idle",     lat: 33.4484, lng: -112.0740, speed: 0,  fuel: 88, miles: 0,   eta: "—",      load: "Awaiting dispatch", temp: null },
    { id: "TRK-2209", driver: "Priya Rajan",    status: "On Route", lat: 34.0522, lng: -118.2437, speed: 71, fuel: 39, miles: 441, eta: "3h 55m", load: "LAX → SEA", temp: "38°F" },
    { id: "TRK-5503", driver: "Derek Nguyen",   status: "Break",    lat: 47.6062, lng: -122.3321, speed: 0,  fuel: 62, miles: 0,   eta: "22 min", load: "SEA → PDX", temp: null },
    { id: "TRK-9901", driver: "Angela Torres",  status: "Alert",    lat: 45.5051, lng: -122.6750, speed: 54, fuel: 17, miles: 267, eta: "2h 31m", load: "PDX → SFO", temp: null },
];

const STATUS_META: Record<TruckStatus, StatusMeta> = {
    "On Route": { color: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/30", dot: "bg-emerald-400" },
    Idle:       { color: "text-slate-300",   bg: "bg-slate-500/15",   border: "border-slate-500/30",   dot: "bg-slate-400"   },
    Break:      { color: "text-amber-300",   bg: "bg-amber-500/15",   border: "border-amber-500/30",   dot: "bg-amber-400"   },
    Alert:      { color: "text-rose-300",    bg: "bg-rose-500/15",    border: "border-rose-500/30",    dot: "bg-rose-400"    },
};

const ROUTE_EVENTS: RouteEvent[] = [
    { time: "08:14", event: "Departed Chicago Terminal",      type: "depart" },
    { time: "09:02", event: "Geofence exit — IL state line",  type: "geo"    },
    { time: "10:45", event: "30-min break logged (HOS)",      type: "break"  },
    { time: "11:47", event: "Fuel stop — Iowa City, IA",      type: "fuel"   },
    { time: "13:30", event: "Re-entered duty — driving",      type: "drive"  },
    { time: "15:22", event: "ETA updated — traffic on I-80",  type: "alert"  },
];

const MAP_PINS: MapPin[] = [
    { x: 68, y: 38, truck: "TRK-4821", status: "On Route" },
    { x: 42, y: 48, truck: "TRK-3310", status: "On Route" },
    { x: 22, y: 58, truck: "TRK-7754", status: "Idle"     },
    { x: 14, y: 65, truck: "TRK-2209", status: "On Route" },
    { x: 8,  y: 30, truck: "TRK-5503", status: "Break"    },
    { x: 11, y: 42, truck: "TRK-9901", status: "Alert"    },
];

const STAT_CARDS: StatCard[] = [
    { label: "Active Trucks",  value: "4",     sub: "of 6 total",            icon: "🚛", color: "cyan"    },
    { label: "Miles Today",    value: "1,209", sub: "across all routes",     icon: "📍", color: "teal"    },
    { label: "Fuel Alerts",    value: "1",     sub: "TRK-9901 — 17%",        icon: "⛽", color: "rose"    },
    { label: "HOS Violations", value: "0",     sub: "All drivers compliant", icon: "✅", color: "emerald" },
];

const DOT_COLOR: Record<TruckStatus, string> = {
    "On Route": "#34d399",
    Idle:       "#94a3b8",
    Break:      "#fbbf24",
    Alert:      "#f87171",
};

const FILTER_OPTIONS = ["All", "On Route", "Idle", "Break", "Alert"] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

// ─── LiveMap ──────────────────────────────────────────────────────────────────

function LiveMap({ selectedTruck, onSelect }: LiveMapProps) {
    const [tick, setTick] = useState<number>(0);

    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 2000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden" style={{ background: "#061820" }}>
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
                    <g key={v}>
                        <line x1={v} y1="0" x2={v} y2="100" stroke="#1e4a5a" strokeWidth="0.3" />
                        <line x1="0" y1={v} x2="100" y2={v} stroke="#1e4a5a" strokeWidth="0.3" />
                    </g>
                ))}
            </svg>

            {/* US outline */}
            <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMid meet" viewBox="0 0 200 130">
                <path
                    d="M20 40 L25 30 L40 28 L55 25 L70 22 L90 20 L110 22 L130 20 L150 22 L165 28 L175 35 L178 45 L175 60 L170 72 L160 80 L150 85 L140 88 L125 90 L110 88 L100 92 L90 95 L80 92 L70 88 L55 85 L40 80 L28 72 L18 60 L15 50 Z"
                    fill="none" stroke="#00e5cc" strokeWidth="0.8"
                />
                <path d="M140 38 Q110 50 85 55 Q60 58 45 62" stroke="#00e5cc" strokeWidth="0.5" strokeDasharray="2 2" fill="none" opacity="0.5" />
                <path d="M85 55 Q70 65 50 68"                stroke="#00e5cc" strokeWidth="0.5" strokeDasharray="2 2" fill="none" opacity="0.5" />
                <path d="M30 42 Q28 58 25 65"                stroke="#00e5cc" strokeWidth="0.5" strokeDasharray="2 2" fill="none" opacity="0.5" />
            </svg>

            {/* Truck pins */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {MAP_PINS.map((pin, i) => {
                    const isSelected = selectedTruck === pin.truck;
                    const color = DOT_COLOR[pin.status];
                    const pulse = tick % 3 === i % 3;
                    return (
                        <g
                            key={pin.truck}
                            onClick={() => onSelect(pin.truck === selectedTruck ? null : pin.truck)}
                            style={{ cursor: "pointer" }}
                        >
                            {(pin.status === "On Route" || isSelected) && (
                                <circle cx={pin.x} cy={pin.y} r={isSelected ? 5 : 3} fill={color} opacity={pulse ? 0.2 : 0.08} />
                            )}
                            <circle cx={pin.x} cy={pin.y} r={isSelected ? 2.5 : 1.8} fill={color} opacity="0.9" />
                            {isSelected && (
                                <circle cx={pin.x} cy={pin.y} r="3.5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.8" />
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1.5">
                {(Object.entries(DOT_COLOR) as [TruckStatus, string][]).map(([s, c]) => (
                    <div key={s} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                        <span className="text-[9px] text-slate-400">{s}</span>
                    </div>
                ))}
            </div>

            {/* Live badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-300 font-medium">LIVE</span>
            </div>
        </div>
    );
}

// ─── TruckRow ─────────────────────────────────────────────────────────────────

function TruckRow({ truck, selected, onClick }: TruckRowProps) {
    const meta = STATUS_META[truck.status];
    const fuelColor =
        truck.fuel < 20 ? "from-rose-500 to-red-400" :
            truck.fuel < 40 ? "from-amber-500 to-orange-400" :
                "from-cyan-500 to-teal-400";

    return (
        <div
            onClick={onClick}
            className={`rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 border ${
                selected
                    ? "bg-cyan-500/10 border-cyan-500/40"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-cyan-500/20"
            }`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot} ${truck.status === "Alert" ? "animate-pulse" : ""}`} />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white font-mono">{truck.id}</span>
                            {truck.temp !== null && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300">
                  ❄ {truck.temp}
                </span>
                            )}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{truck.driver}</div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.color} ${meta.bg} ${meta.border}`}>
            {truck.status}
          </span>
                </div>

                <div className="hidden md:block text-right flex-shrink-0">
                    <div className="text-xs text-slate-300 truncate max-w-[120px]">{truck.load}</div>
                    <div className="text-[10px] text-slate-500">ETA {truck.eta}</div>
                </div>

                <div className="flex-shrink-0 text-right">
                    <div className="text-xs text-slate-300">{truck.speed > 0 ? `${truck.speed} mph` : "—"}</div>
                    <div className="mt-1 w-14 h-1 rounded-full bg-slate-700">
                        <div className={`h-full rounded-full bg-gradient-to-r ${fuelColor}`} style={{ width: `${truck.fuel}%` }} />
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{truck.fuel}% fuel</div>
                </div>
            </div>
        </div>
    );
}

// ─── DetailPanel ──────────────────────────────────────────────────────────────

function DetailPanel({ truck, onClose }: DetailPanelProps) {
    const meta = STATUS_META[truck.status];
    const fuelColor =
        truck.fuel < 20 ? "from-rose-500 to-red-400" :
            truck.fuel < 40 ? "from-amber-500 to-orange-400" :
                "from-cyan-500 to-teal-400";

    const statRows: { label: string; value: string; sub: string }[] = [
        { label: "Speed",  value: truck.speed > 0 ? `${truck.speed} mph` : "Stopped", sub: "Current"     },
        { label: "Miles",  value: truck.miles > 0 ? String(truck.miles)  : "0",       sub: "Today"       },
        { label: "ETA",    value: truck.eta,                                            sub: "Destination" },
        { label: "Fuel",   value: `${truck.fuel}%`,                                    sub: "Remaining"   },
    ];

    const eventDotColor = (type: RouteEvent["type"]): string => {
        if (type === "alert") return "bg-rose-400";
        if (type === "fuel")  return "bg-amber-400";
        if (type === "break") return "bg-amber-300";
        return "bg-cyan-400";
    };

    return (
        <div className="glass-strong rounded-2xl border border-cyan-500/20 p-5 h-full flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-lg font-bold text-white">{truck.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.color} ${meta.bg} ${meta.border}`}>
              {truck.status}
            </span>
                    </div>
                    <div className="text-sm text-slate-400">{truck.driver}</div>
                    <div className="text-xs text-cyan-400 mt-0.5">{truck.load}</div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
                {statRows.map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3 py-2.5">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</div>
                        <div className="text-base font-semibold text-white mt-0.5">{s.value}</div>
                        <div className="text-[10px] text-slate-500">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Fuel bar */}
            <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Fuel Level</span>
                    <span className={truck.fuel < 20 ? "text-rose-400 font-semibold" : "text-slate-300"}>{truck.fuel}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700/60">
                    <div className={`h-full rounded-full bg-gradient-to-r ${fuelColor} transition-all`} style={{ width: `${truck.fuel}%` }} />
                </div>
                {truck.fuel < 20 && (
                    <div className="mt-1.5 text-[10px] text-rose-400 flex items-center gap-1">
                        <span>⚠</span> Low fuel — recommend refuel stop
                    </div>
                )}
            </div>

            {/* Route timeline */}
            <div className="flex-1 min-h-0">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Route Events</div>
                <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 220 }}>
                    {ROUTE_EVENTS.map((ev, i) => (
                        <div key={i} className="flex gap-3 items-start">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${eventDotColor(ev.type)}`} />
                                {i < ROUTE_EVENTS.length - 1 && <div className="w-px h-4 bg-slate-700/60 mt-0.5" />}
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500">{ev.time}</div>
                                <div className="text-xs text-slate-300">{ev.event}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
                <button className="text-xs text-slate-300 border border-slate-600/50 rounded-lg py-2 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors">
                    Message Driver
                </button>
                <button className="text-xs font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-[#040f16] rounded-lg py-2">
                    View Full Log
                </button>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FleetTrackingPage() {
    const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterOption>("All");
    const [searchQ, setSearchQ] = useState<string>("");

    const selectedTruck: Truck | null = TRUCKS.find((t) => t.id === selectedTruckId) ?? null;

    const filtered: Truck[] = TRUCKS.filter((t) => {
        const matchFilter = filter === "All" || t.status === filter;
        const matchSearch =
            searchQ === "" ||
            t.id.toLowerCase().includes(searchQ.toLowerCase()) ||
            t.driver.toLowerCase().includes(searchQ.toLowerCase());
        return matchFilter && matchSearch;
    });

    const handleSelectTruck = (id: string | null): void => {
        setSelectedTruckId(id);
    };

    return (
        <div className="min-h-screen bg-[#040f16] text-white overflow-x-hidden">
            {/* Ambient bg */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[120px]" />
                <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,229,204,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,204,0.3) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-cyan-500/10 bg-[#040f16]/90 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                            <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                            <circle cx="6.5"  cy="16" r="2" fill="white" />
                            <circle cx="17.5" cy="16" r="2" fill="white" />
                        </svg>
                    </div>
                    <span className="font-bold text-base tracking-tight">
            <span className="text-white">fleet</span><span className="text-cyan-400">pulse</span>
          </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-400">Fleet Tracking</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-medium text-white">Andrew Martin</div>
                        <div className="text-[10px] text-slate-500">Admin</div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-xs font-bold text-[#040f16]">
                        AM
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="inline-flex items-center gap-1.5 text-xs bg-white/[0.05] border border-cyan-500/20 rounded-full px-3 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-cyan-300">Fleet Tracking</span>
                    </div>
                    <span className="text-slate-600 text-xs">/ Live View</span>
                </div>

                {/* Page title */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Live Fleet Tracking</h1>
                    <p className="text-slate-400 text-sm">Real-time GPS positions, HOS status, and route activity for all vehicles.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {STAT_CARDS.map((s, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-4 flex items-center gap-3 hover:border-cyan-500/20 transition-colors"
                        >
                            <div className="text-2xl">{s.icon}</div>
                            <div>
                                <div className="text-xl font-bold text-white font-mono leading-none">{s.value}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main layout */}
                <div className="grid xl:grid-cols-[1fr_340px] gap-4">

                    {/* Left: map + list */}
                    <div className="flex flex-col gap-4">

                        {/* Map */}
                        <div className="rounded-2xl border border-cyan-500/15 overflow-hidden" style={{ height: 300 }}>
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-cyan-500/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-medium text-slate-300">Live Fleet Map</span>
                                </div>
                                <span className="text-[10px] text-slate-500">
                  {TRUCKS.filter((t) => t.status === "On Route").length} trucks on route
                </span>
                            </div>
                            <div style={{ height: "calc(300px - 41px)" }}>
                                <LiveMap selectedTruck={selectedTruckId} onSelect={handleSelectTruck} />
                            </div>
                        </div>

                        {/* Filter + search */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
                                {FILTER_OPTIONS.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                                            filter === f
                                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                                : "text-slate-400 hover:text-slate-300"
                                        }`}
                                    >
                                        {f}
                                        {f !== "All" && (
                                            <span className="ml-1 text-[9px] opacity-60">
                        {TRUCKS.filter((t) => t.status === f).length}
                      </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 relative">
                                <svg viewBox="0 0 20 20" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500">
                                    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search truck ID or driver..."
                                    value={searchQ}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQ(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-white/[0.03] border border-white/[0.06] rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 focus:bg-cyan-500/5 transition-all"
                                />
                            </div>
                        </div>

                        {/* Truck list */}
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                                <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Vehicle List</span>
                                <span className="text-[10px] text-slate-500">{filtered.length} of {TRUCKS.length} trucks</span>
                            </div>
                            <div className="p-3 space-y-2">
                                {filtered.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-sm">No trucks match your filter.</div>
                                ) : (
                                    filtered.map((truck) => (
                                        <TruckRow
                                            key={truck.id}
                                            truck={truck}
                                            selected={selectedTruckId === truck.id}
                                            onClick={() => setSelectedTruckId(selectedTruckId === truck.id ? null : truck.id)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: detail panel */}
                    <div>
                        {selectedTruck !== null ? (
                            <DetailPanel truck={selectedTruck} onClose={() => setSelectedTruckId(null)} />
                        ) : (
                            <div className="glass-strong rounded-2xl border border-white/[0.06] h-full min-h-[300px] flex flex-col items-center justify-center gap-3 p-8 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-cyan-400">
                                        <path d="M2 8h15l3 5v3H2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                        <circle cx="6.5"  cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="17.5" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-300 mb-1">Select a Truck</div>
                                    <div className="text-xs text-slate-500">
                                        Click any vehicle in the list or map to view real-time details, route events, and driver info.
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                                    {TRUCKS.filter((t) => t.status === "Alert").map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTruckId(t.id)}
                                            className="text-[10px] px-2.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                                        >
                                            ⚠ {t.id}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom strip */}
                <div className="mt-4 glass rounded-2xl border border-cyan-500/10 px-5 py-4 flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs text-slate-400">
              Updates every <span className="text-cyan-300 font-medium">30 sec</span>
            </span>
                    </div>
                    <div className="text-xs text-slate-500">|</div>
                    <div className="text-xs text-slate-400">All times in <span className="text-slate-300">driver local timezone</span></div>
                    <div className="text-xs text-slate-500">|</div>
                    <div className="text-xs text-slate-400">Data retention: <span className="text-slate-300">90 days</span></div>
                    <div className="ml-auto">
                        <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center gap-1">
                            Export Report
                            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                                <path d="M8 3v7M5 8l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

            </main>

            <style>{`
        .glass {
          background: rgba(6, 29, 42, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 229, 204, 0.08);
        }
        .glass-strong {
          background: rgba(4, 15, 22, 0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(0, 229, 204, 0.1);
        }
      `}</style>
        </div>
    );
}