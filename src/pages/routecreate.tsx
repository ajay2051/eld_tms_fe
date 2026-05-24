import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../middleware/axiosinterceptor.tsx";

// ─── Style injection ──────────────────────────────────────────────────────────

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

  .rm-root * { font-family: 'DM Sans', sans-serif; }
  .rm-root h1, .rm-root h2, .rm-root h3 { font-family: 'Syne', sans-serif; }

  @keyframes rm-slide-in {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes rm-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes rm-pulse-dot {
    0%, 100% { transform: scale(1);   opacity: 1; }
    50%       { transform: scale(1.4); opacity: 0.6; }
  }
  @keyframes rm-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes rm-route-draw {
    from { stroke-dashoffset: 1000; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes rm-toast-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rm-slide-in { animation: rm-slide-in 0.5s ease-out forwards; }
  .rm-fade-in  { animation: rm-fade-in  0.4s ease-out forwards; }

  .rm-d1 { animation-delay: 0.05s; opacity: 0; }
  .rm-d2 { animation-delay: 0.12s; opacity: 0; }
  .rm-d3 { animation-delay: 0.19s; opacity: 0; }
  .rm-d4 { animation-delay: 0.26s; opacity: 0; }

  .rm-spin { animation: rm-spin 1s linear infinite; }
  .rm-pulse-dot { animation: rm-pulse-dot 1.5s ease-in-out infinite; }
  .rm-toast-in  { animation: rm-toast-in 0.35s ease-out forwards; }

  /* Panel glass */
  .rm-panel {
    background: rgba(4, 15, 22, 0.88);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(0,229,204,0.16);
    box-shadow: 0 0 40px rgba(0,229,204,0.06), 0 20px 60px rgba(0,0,0,0.6);
  }
  .rm-glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0,229,204,0.13);
  }

  /* Input */
  .rm-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(0,229,204,0.18);
    color: white;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .rm-input:focus {
    outline: none;
    border-color: rgba(0,229,204,0.55);
    background: rgba(0,229,204,0.05);
    box-shadow: 0 0 0 3px rgba(0,229,204,0.08);
  }
  .rm-input::placeholder { color: rgba(148,163,184,0.5); }
  .rm-input-active {
    border-color: rgba(0,229,204,0.55) !important;
    background: rgba(0,229,204,0.05) !important;
    box-shadow: 0 0 0 3px rgba(0,229,204,0.1) !important;
  }

  /* Buttons */
  .rm-btn-primary {
    background: linear-gradient(135deg, #00e5cc, #14b8a6);
    box-shadow: 0 0 20px rgba(0,229,204,0.38), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .rm-btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 34px rgba(0,229,204,0.55);
    transform: translateY(-1px);
  }
  .rm-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .rm-btn-icon {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(0,229,204,0.16);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  }
  .rm-btn-icon:hover {
    background: rgba(0,229,204,0.1);
    border-color: rgba(0,229,204,0.4);
    transform: translateY(-1px);
  }
  .rm-btn-danger {
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.25);
    transition: background 0.2s ease, border-color 0.2s ease;
  }
  .rm-btn-danger:hover {
    background: rgba(248,113,113,0.18);
    border-color: rgba(248,113,113,0.45);
  }

  /* Pin type tabs */
  .rm-pin-tab {
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    border: 1px solid transparent;
  }
  .rm-pin-tab-current  { background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.4); color: #fbbf24; }
  .rm-pin-tab-pickup   { background: rgba(52,211,153,0.15); border-color: rgba(52,211,153,0.4); color: #34d399; }
  .rm-pin-tab-dropoff  { background: rgba(248,113,113,0.15); border-color: rgba(248,113,113,0.4); color: #f87171; }
  .rm-pin-tab-inactive { background: rgba(255,255,255,0.04); border-color: rgba(148,163,184,0.15); color: #475569; }
  .rm-pin-tab-inactive:hover { background: rgba(255,255,255,0.07); border-color: rgba(148,163,184,0.3); color: #94a3b8; }

  /* Stat card */
  .rm-stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,229,204,0.12);
    transition: border-color 0.2s ease;
  }
  .rm-stat-card:hover { border-color: rgba(0,229,204,0.28); }

  /* Map container */
  #rm-map {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .leaflet-container {
    background: #040f16;
    font-family: 'DM Sans', sans-serif;
  }
  /* Dark map controls */
  .leaflet-control-zoom a {
    background: rgba(4,15,22,0.9) !important;
    color: #94a3b8 !important;
    border-color: rgba(0,229,204,0.2) !important;
  }
  .leaflet-control-zoom a:hover {
    background: rgba(0,229,204,0.15) !important;
    color: #00e5cc !important;
  }
  .leaflet-control-attribution {
    background: rgba(4,15,22,0.75) !important;
    color: #475569 !important;
    font-size: 10px !important;
  }
  .leaflet-control-attribution a { color: #64748b !important; }

  /* Toast */
  .rm-toast {
    background: rgba(4,15,22,0.95);
    border: 1px solid rgba(0,229,204,0.2);
    backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  /* Route stats bar */
  .rm-stats-bar {
    background: rgba(4,15,22,0.92);
    border: 1px solid rgba(0,229,204,0.16);
    backdrop-filter: blur(20px);
  }

  /* Scrollbar */
  .rm-panel::-webkit-scrollbar { width: 4px; }
  .rm-panel::-webkit-scrollbar-track { background: transparent; }
  .rm-panel::-webkit-scrollbar-thumb { background: rgba(0,229,204,0.2); border-radius: 4px; }

  /* Grid bg */
  .rm-grid-bg {
    background-image:
      linear-gradient(rgba(0,229,204,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,204,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const TOKEN_KEY    = "access_token";

// OSRM public routing API (free, no key needed)
const OSRM_BASE    = "https://router.project-osrm.org/route/v1/driving";

// Default center — Kathmandu
const DEFAULT_CENTER: [number, number] = [27.7172, 85.3240];
const DEFAULT_ZOOM = 13;

// ─── Types ────────────────────────────────────────────────────────────────────

type PinMode = "current" | "pickup" | "dropoff" | null;

interface Coords { lat: number; lng: number; }

interface LocationState {
    current:  Coords | null;
    pickup:   Coords | null;
    dropoff:  Coords | null;
}

interface RouteStats {
    distanceKm: number;
    durationMin: number;
}

interface ToastMsg {
    id:      number;
    type:    "success" | "error" | "info";
    message: string;
}

// ─── Auth guard ───────────────────────────────────────────────────────────────

function useAuthGuard() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);
}

// ─── Leaflet dynamic import helper ───────────────────────────────────────────
// Leaflet must be imported dynamically to avoid SSR issues and so we can
// inject its CSS via PAGE_STYLES above.

let L: typeof import("leaflet") | null = null;

async function getLeaflet() {
    if (L) return L;
    L = await import("leaflet");

    // Fix default marker icon paths broken by bundlers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    return L;
}

// ─── Custom SVG marker factory ────────────────────────────────────────────────

function makeMarkerIcon(Leaflet: typeof import("leaflet"), color: string, label: string) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
      <defs>
        <filter id="shadow" x="-30%" y="-10%" width="160%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="${color}" flood-opacity="0.5"/>
        </filter>
      </defs>
      <path d="M18 2C10.268 2 4 8.268 4 16c0 10.5 14 30 14 30S32 26.5 32 16C32 8.268 25.732 2 18 2z"
        fill="${color}" filter="url(#shadow)" opacity="0.95"/>
      <circle cx="18" cy="16" r="7" fill="white" opacity="0.95"/>
      <text x="18" y="20" text-anchor="middle" font-size="9" font-weight="700"
        font-family="DM Sans, sans-serif" fill="${color}">${label}</text>
    </svg>`;

    return Leaflet.divIcon({
        html: svg,
        className: "",
        iconSize:   [36, 48],
        iconAnchor: [18, 48],
        popupAnchor:[0, -48],
    });
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toasts, onRemove }: { toasts: ToastMsg[]; onRemove: (id: number) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className="rm-toast rm-toast-in rounded-xl px-4 py-3 flex items-center gap-3 pointer-events-auto min-w-[260px]"
                >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        t.type === "success" ? "bg-emerald-400" :
                            t.type === "error"   ? "bg-rose-400"    : "bg-cyan-400"
                    }`} />
                    <p className="text-sm text-slate-200 flex-1">{t.message}</p>
                    <button
                        onClick={() => onRemove(t.id)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <svg viewBox="0 0 12 12" className="w-3 h-3">
                            <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}

// ─── Coord display ────────────────────────────────────────────────────────────

function CoordBadge({ coords, color }: { coords: Coords; color: string }) {
    return (
        <div className="rm-glass rounded-lg px-2.5 py-1.5 mt-1.5">
            <p className="text-[10px] font-mono" style={{ color }}>
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RoutePage() {
    useAuthGuard();

    const navigate    = useNavigate();
    const mapRef      = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<import("leaflet").Map | null>(null);
    const markersRef  = useRef<Record<string, import("leaflet").Marker>>({});
    const routeLayerRef = useRef<import("leaflet").Polyline | null>(null);
    const toastIdRef  = useRef(0);

    const [locs,      setLocs]      = useState<LocationState>({ current: null, pickup: null, dropoff: null });
    const [pinMode,   setPinMode]   = useState<PinMode>(null);
    const [routeStats,setRouteStats]= useState<RouteStats | null>(null);
    const [loading,   setLoading]   = useState<{ route: boolean; save: boolean }>({ route: false, save: false });
    const [routeSaved,   setRouteSaved]   = useState<boolean>(false);
    const [savedRouteId, setSavedRouteId] = useState<number | null>(null);
    const [toasts,    setToasts]    = useState<ToastMsg[]>([]);
    const [mapReady,  setMapReady]  = useState(false);

    // ── Style injection ──────────────────────────────────────────────────────
    useEffect(() => {
        const id = "rm-styles";
        if (document.getElementById(id)) return;
        const tag = document.createElement("style");
        tag.id = id;
        tag.textContent = PAGE_STYLES;
        document.head.appendChild(tag);
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    // ── Toast helpers ────────────────────────────────────────────────────────
    const addToast = useCallback((type: ToastMsg["type"], message: string) => {
        const id = ++toastIdRef.current;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // ── Leaflet init ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        getLeaflet().then(Lf => {
            const map = Lf.map("rm-map", {
                center:    DEFAULT_CENTER,
                zoom:      DEFAULT_ZOOM,
                zoomControl: true,
                attributionControl: true,
            });

            // OpenStreetMap tiles — completely free
            Lf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            // Map click handler
            map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
                setPinMode(mode => {
                    if (!mode) return mode;
                    const coords: Coords = { lat: e.latlng.lat, lng: e.latlng.lng };

                    setLocs(prev => ({ ...prev, [mode]: coords }));

                    // Place/move marker
                    const colors: Record<string, string> = {
                        current: "#fbbf24",
                        pickup:  "#34d399",
                        dropoff: "#f87171",
                    };
                    const labels: Record<string, string> = {
                        current: "Me",
                        pickup:  "P",
                        dropoff: "D",
                    };

                    getLeaflet().then(L2 => {
                        if (markersRef.current[mode]) {
                            markersRef.current[mode].setLatLng([coords.lat, coords.lng]);
                        } else {
                            const marker = L2.marker([coords.lat, coords.lng], {
                                icon:      makeMarkerIcon(L2, colors[mode], labels[mode]),
                                draggable: true,
                            }).addTo(map);

                            marker.on("dragend", () => {
                                const pos = marker.getLatLng();
                                setLocs(prev => ({ ...prev, [mode]: { lat: pos.lat, lng: pos.lng } }));
                            });

                            markersRef.current[mode] = marker;
                        }
                    });

                    return null; // reset pin mode after placing
                });
            });

            mapInstance.current = map;
            setMapReady(true);
        });

        return () => {
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Get current GPS location ─────────────────────────────────────────────
    const handleGeolocate = useCallback(() => {
        if (!navigator.geolocation) {
            addToast("error", "Geolocation is not supported by your browser.");
            return;
        }
        addToast("info", "Getting your location…");
        navigator.geolocation.getCurrentPosition(
            pos => {
                const coords: Coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setLocs(prev => ({ ...prev, current: coords }));

                getLeaflet().then(Lf => {
                    const map = mapInstance.current;
                    if (!map) return;
                    if (markersRef.current["current"]) {
                        markersRef.current["current"].setLatLng([coords.lat, coords.lng]);
                    } else {
                        const marker = Lf.marker([coords.lat, coords.lng], {
                            icon:      makeMarkerIcon(Lf, "#fbbf24", "Me"),
                            draggable: true,
                        }).addTo(map);
                        marker.on("dragend", () => {
                            const p = marker.getLatLng();
                            setLocs(prev => ({ ...prev, current: { lat: p.lat, lng: p.lng } }));
                        });
                        markersRef.current["current"] = marker;
                    }
                    map.setView([coords.lat, coords.lng], 14);
                });
                addToast("success", "Location found!");
            },
            () => addToast("error", "Could not get your location. Please allow location access."),
            { enableHighAccuracy: true }
        );
    }, [addToast]);

    // ── Draw OSRM route ──────────────────────────────────────────────────────
    const drawRoute = useCallback(async () => {
        const { pickup, dropoff } = locs;
        if (!pickup || !dropoff) {
            addToast("error", "Please set both pickup and dropoff locations.");
            return;
        }

        setLoading(prev => ({ ...prev, route: true }));

        try {
            // OSRM expects lng,lat order
            const url = `${OSRM_BASE}/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`;
            const { data } = await axios.get(url);

            if (!data.routes?.length) throw new Error("No route found.");

            const route   = data.routes[0];
            const coords: [number, number][] = route.geometry.coordinates.map(
                ([lng, lat]: [number, number]) => [lat, lng]
            );
            const distKm  = (route.distance / 1000).toFixed(1);
            const durMin  = Math.ceil(route.duration / 60);

            setRouteStats({ distanceKm: parseFloat(distKm), durationMin: durMin });

            // Draw polyline
            getLeaflet().then(Lf => {
                const map = mapInstance.current;
                if (!map) return;

                // Remove old route
                if (routeLayerRef.current) {
                    routeLayerRef.current.remove();
                    routeLayerRef.current = null;
                }

                // Dashed background line
                Lf.polyline(coords, {
                    color: "rgba(0,229,204,0.15)",
                    weight: 10,
                    lineCap: "round",
                    lineJoin: "round",
                }).addTo(map);

                // Main glowing route line
                const routeLine = Lf.polyline(coords, {
                    color:  "#00e5cc",
                    weight: 4,
                    opacity: 0.9,
                    lineCap: "round",
                    lineJoin: "round",
                }).addTo(map);

                routeLayerRef.current = routeLine;

                // Fit map to route + all markers
                const allPoints: [number, number][] = [
                    ...coords,
                    ...(locs.current ? [[locs.current.lat, locs.current.lng] as [number, number]] : []),
                ];
                map.fitBounds(Lf.latLngBounds(allPoints), { padding: [60, 60] });
            });

            addToast("success", `Route found: ${distKm} km, ~${durMin} min`);
        } catch {
            addToast("error", "Could not fetch route. Please try again.");
        } finally {
            setLoading(prev => ({ ...prev, route: false }));
        }
    }, [locs, addToast]);

    // ── Save route to backend ────────────────────────────────────────────────
    const saveRoute = useCallback(async () => {
        const { current, pickup, dropoff } = locs;
        if (!current || !pickup || !dropoff) {
            addToast("error", "All three locations are required to save.");
            return;
        }

        const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        if (!token) { navigate("/login"); return; }

        setLoading(prev => ({ ...prev, save: true }));

        try {
            const response = await axiosInstance.post(
                "/route/create/",
                {
                    current_location: {
                        type: "Point",
                        coordinates: [current.lng, current.lat],
                    },
                    pickup_location: {
                        type: "Point",
                        coordinates: [pickup.lng, pickup.lat],
                    },
                    dropoff_location: {
                        type: "Point",
                        coordinates: [dropoff.lng, dropoff.lat],
                    },
                }
                // No manual Authorization header — request interceptor adds it automatically
            );
            const routeId = response.data?.id ?? response.data?.data?.id ?? null;
            setSavedRouteId(routeId);
            addToast("success", "Route saved successfully!");
            setRouteSaved(true);
        } catch {
            addToast("error", "Failed to save route. Please try again.");
        } finally {
            setLoading(prev => ({ ...prev, save: false }));
        }
    }, [locs, navigate, addToast]);

    // ── Clear a single pin ───────────────────────────────────────────────────
    const clearPin = useCallback((key: keyof LocationState) => {
        setLocs(prev => ({ ...prev, [key]: null }));
        if (markersRef.current[key]) {
            markersRef.current[key].remove();
            delete markersRef.current[key];
        }
        if (key === "pickup" || key === "dropoff") {
            if (routeLayerRef.current) {
                routeLayerRef.current.remove();
                routeLayerRef.current = null;
            }
            setRouteStats(null);
        }
    }, []);

    // ── Clear all ────────────────────────────────────────────────────────────
    const clearAll = useCallback(() => {
        Object.values(markersRef.current).forEach(m => m.remove());
        markersRef.current = {};
        if (routeLayerRef.current) { routeLayerRef.current.remove(); routeLayerRef.current = null; }
        setLocs({ current: null, pickup: null, dropoff: null });
        setRouteStats(null);
        setPinMode(null);
        setRouteSaved(false);
        setSavedRouteId(null);
    }, []);

    const allSet = locs.current && locs.pickup && locs.dropoff;

    const PIN_CONFIG = [
        { key: "current" as const, label: "Current Location", shortLabel: "Me", color: "#fbbf24", activeClass: "rm-pin-tab-current",  icon: (
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="8" cy="8" r="2" fill="currentColor"/>
                </svg>
            )},
        { key: "pickup"  as const, label: "Pickup Location",  shortLabel: "P", color: "#34d399", activeClass: "rm-pin-tab-pickup",   icon: (
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <path d="M8 2C5.239 2 3 4.239 3 7c0 4.5 5 9 5 9s5-4.5 5-9c0-2.761-2.239-5-5-5z" stroke="currentColor" strokeWidth="1.4"/>
                    <circle cx="8" cy="7" r="1.5" fill="currentColor"/>
                </svg>
            )},
        { key: "dropoff" as const, label: "Dropoff Location", shortLabel: "D", color: "#f87171", activeClass: "rm-pin-tab-dropoff",  icon: (
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <path d="M8 2C5.239 2 3 4.239 3 7c0 4.5 5 9 5 9s5-4.5 5-9c0-2.761-2.239-5-5-5z" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M6 6l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )},
    ];

    return (
        <div className="rm-root min-h-screen bg-[#040f16] text-white overflow-hidden" style={{ height: "100vh" }}>
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] rounded-full bg-cyan-500/4 blur-[100px]" />
                <div className="absolute bottom-[-100px] right-[-80px] w-[360px] h-[360px] rounded-full bg-teal-500/4 blur-[90px]" />
            </div>

            {/* ── Topbar ────────────────────────────────────────────────────────── */}
            <div className="rm-panel relative z-20 flex items-center justify-between px-5 py-3 border-b border-cyan-500/10">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                                <path d="M2 8h15l3 5v3H2V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                                <circle cx="6.5"  cy="16" r="2" fill="white" />
                                <circle cx="17.5" cy="16" r="2" fill="white" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 rounded-lg bg-cyan-400/15 blur-sm" />
                    </div>
                    <span style={{ fontFamily: "'Syne',sans-serif" }} className="text-lg font-700 tracking-tight hidden sm:block">
            <span className="text-white">fleet</span><span className="text-cyan-400">pulse</span>
          </span>
                </a>

                {/* Page title */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 rm-pulse-dot" />
                    <span style={{ fontFamily: "'Syne',sans-serif" }} className="text-sm font-600 text-slate-200">
            Route Planner
          </span>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    {routeStats && (
                        <div className="hidden sm:flex items-center gap-3 rm-glass rounded-lg px-3 py-1.5 mr-2">
                            <div className="flex items-center gap-1.5 text-xs">
                                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-cyan-400">
                                    <path d="M2 8h12M10 5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-cyan-300 font-medium">{routeStats.distanceKm} km</span>
                            </div>
                            <div className="w-px h-3 bg-slate-700" />
                            <div className="flex items-center gap-1.5 text-xs">
                                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-teal-400">
                                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
                                    <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                </svg>
                                <span className="text-teal-300 font-medium">{routeStats.durationMin} min</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => navigate(-1)}
                        className="rm-btn-icon rounded-lg p-2 text-slate-400 hover:text-slate-200"
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                            <path d="M13 8H3M7 5l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Main layout ───────────────────────────────────────────────────── */}
            <div className="flex" style={{ height: "calc(100vh - 57px)" }}>

                {/* ── Left sidebar ──────────────────────────────────────────────── */}
                <div
                    className="rm-panel relative z-10 w-80 flex-shrink-0 flex flex-col overflow-y-auto border-r border-cyan-500/10"
                    style={{ height: "100%" }}
                >
                    <div className="p-5 flex-1 flex flex-col gap-5">

                        {/* Header */}
                        <div className="rm-slide-in rm-d1">
                            <div className="inline-flex items-center gap-2 rm-glass rounded-full px-3 py-1 text-xs font-medium text-cyan-300 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                Route Planning
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Click a pin type, then click on the map to place it. Drag markers to adjust positions.
                            </p>
                        </div>

                        {/* ── Pin mode selector ──────────────────────────────────────── */}
                        <div className="rm-slide-in rm-d2 space-y-2">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Active Pin Mode
                            </p>
                            <div className="space-y-2">
                                {PIN_CONFIG.map(cfg => (
                                    <div key={cfg.key} className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPinMode(p => p === cfg.key ? null : cfg.key)}
                                            className={`rm-pin-tab flex-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${
                                                pinMode === cfg.key ? cfg.activeClass : "rm-pin-tab-inactive"
                                            }`}
                                        >
                                            {cfg.icon}
                                            <span className="flex-1 text-left">{cfg.label}</span>
                                            {pinMode === cfg.key && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                                      style={{ background: `${cfg.color}25`, color: cfg.color }}>
                          ACTIVE
                        </span>
                                            )}
                                            {locs[cfg.key] && pinMode !== cfg.key && (
                                                <svg viewBox="0 0 12 12" className="w-3 h-3 flex-shrink-0" style={{ color: cfg.color }}>
                                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </button>

                                        {/* Clear pin button */}
                                        {locs[cfg.key] && (
                                            <button
                                                onClick={() => clearPin(cfg.key)}
                                                className="rm-btn-danger rounded-lg p-2 text-rose-400"
                                                title={`Clear ${cfg.label}`}
                                            >
                                                <svg viewBox="0 0 12 12" className="w-3 h-3">
                                                    <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── GPS locate button ──────────────────────────────────────── */}
                        <div className="rm-slide-in rm-d2">
                            <button
                                onClick={handleGeolocate}
                                className="rm-btn-icon w-full rounded-xl py-2.5 px-4 text-sm text-slate-300 flex items-center justify-center gap-2"
                            >
                                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-amber-400">
                                    <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
                                    <path d="M10 1v3M10 16v3M1 10h3M16 10h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                                </svg>
                                Use My GPS Location
                            </button>
                        </div>

                        {/* ── Placed locations summary ───────────────────────────────── */}
                        <div className="rm-slide-in rm-d3 space-y-2">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Placed Pins
                            </p>
                            {PIN_CONFIG.map(cfg => (
                                <div key={cfg.key}
                                     className={`rm-glass rounded-xl px-3 py-2.5 transition-all duration-200 ${
                                         locs[cfg.key] ? "opacity-100" : "opacity-40"
                                     }`}
                                >
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <div className="w-2 h-2 rounded-full" style={{ background: locs[cfg.key] ? cfg.color : "#334155" }} />
                                        <span className="text-xs font-medium text-slate-300">{cfg.label}</span>
                                        {!locs[cfg.key] && <span className="ml-auto text-[10px] text-slate-600">Not set</span>}
                                    </div>
                                    {locs[cfg.key] && <CoordBadge coords={locs[cfg.key]!} color={cfg.color} />}
                                </div>
                            ))}
                        </div>

                        {/* ── Action buttons ─────────────────────────────────────────── */}
                        <div className="rm-slide-in rm-d4 space-y-3 mt-auto">

                            {/* Draw route */}
                            <button
                                onClick={drawRoute}
                                disabled={!locs.pickup || !locs.dropoff || loading.route}
                                className="rm-btn-primary w-full rounded-xl py-3 text-sm font-semibold text-[#040f16] flex items-center justify-center gap-2"
                            >
                                {loading.route ? (
                                    <>
                                        <svg className="w-4 h-4 rm-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="3"/>
                                            <path d="M12 2a10 10 0 0110 10" stroke="#040f16" strokeWidth="3" strokeLinecap="round"/>
                                        </svg>
                                        Calculating Route…
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                            <path d="M2 12 Q6 4 10 8 Q14 12 14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                        Draw Route
                                    </>
                                )}
                            </button>

                            {/* Save to backend */}
                            <button
                                onClick={saveRoute}
                                disabled={!allSet || loading.save}
                                className={`rm-btn-icon w-full rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                                    allSet ? "text-cyan-300" : "text-slate-600"
                                }`}
                            >
                                {loading.save ? (
                                    <>
                                        <svg className="w-4 h-4 rm-spin" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="rgba(0,229,204,0.2)" strokeWidth="3"/>
                                            <path d="M12 2a10 10 0 0110 10" stroke="#00e5cc" strokeWidth="3" strokeLinecap="round"/>
                                        </svg>
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                            <path d="M13 10v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                            <path d="M8 2v7M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Save Route
                                    </>
                                )}
                            </button>

                            {/* Create Driver Log — shown after route is saved */}
                            {routeSaved && (
                                <button
                                    onClick={() => navigate("/driver-log", { state: { route_id: savedRouteId } })}
                                    className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 rm-fade-in"
                                    style={{
                                        background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                                        boxShadow: "0 0 20px rgba(251,191,36,0.4)",
                                        color: "#040f16",
                                    }}
                                >
                                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                                        <rect x="2" y="2" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                                        <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                    </svg>
                                    Create Driver Log
                                </button>
                            )}

                            {/* Clear all */}
                            {(locs.current || locs.pickup || locs.dropoff) && (
                                <button
                                    onClick={clearAll}
                                    className="rm-btn-danger w-full rounded-xl py-2.5 text-xs text-rose-400 flex items-center justify-center gap-2"
                                >
                                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                                        <path d="M3 4h10M5 4V3h6v1M6 7v5M10 7v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                        <path d="M4 4l1 9h6l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Clear All Pins
                                </button>
                            )}
                        </div>

                        {/* ── Route stats ────────────────────────────────────────────── */}
                        {routeStats && (
                            <div className="rm-fade-in rm-glass rounded-2xl p-4 space-y-3">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Route Stats</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: "Distance",   value: `${routeStats.distanceKm} km`, color: "text-cyan-300", icon: "→" },
                                        { label: "Est. Time",  value: `${routeStats.durationMin} min`,  color: "text-teal-300",  icon: "⏱" },
                                    ].map(s => (
                                        <div key={s.label} className="rm-stat-card rounded-xl p-3 text-center">
                                            <p className={`text-lg font-700 ${s.color}`} style={{ fontFamily: "'Syne',sans-serif" }}>
                                                {s.value}
                                            </p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* ── Map ───────────────────────────────────────────────────────── */}
                <div className="relative flex-1" style={{ height: "100%" }}>
                    {/* Map container */}
                    <div ref={mapRef} id="rm-map" style={{ width: "100%", height: "100%" }} />

                    {/* Loading overlay while map initialises */}
                    {!mapReady && (
                        <div className="absolute inset-0 bg-[#040f16] flex items-center justify-center z-10">
                            <div className="text-center">
                                <svg className="w-8 h-8 rm-spin mx-auto mb-3 text-cyan-400" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="rgba(0,229,204,0.2)" strokeWidth="3"/>
                                    <path d="M12 2a10 10 0 0110 10" stroke="#00e5cc" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                                <p className="text-sm text-slate-400">Loading map…</p>
                            </div>
                        </div>
                    )}

                    {/* Active pin mode overlay hint */}
                    {pinMode && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] rm-toast rm-toast-in rounded-xl px-4 py-2.5 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full rm-pulse-dot"
                                 style={{ background: PIN_CONFIG.find(c => c.key === pinMode)?.color }} />
                            <p className="text-sm text-slate-200 whitespace-nowrap">
                                Click anywhere on the map to place{" "}
                                <span className="font-medium" style={{ color: PIN_CONFIG.find(c => c.key === pinMode)?.color }}>
                  {PIN_CONFIG.find(c => c.key === pinMode)?.label}
                </span>
                            </p>
                        </div>
                    )}

                    {/* Map attribution overlay fix */}
                    <div className="absolute bottom-0 right-0 z-[999] pointer-events-none">
                        <div className="w-2 h-2" />
                    </div>
                </div>
            </div>

            {/* ── Toasts ────────────────────────────────────────────────────────── */}
            <Toast toasts={toasts} onRemove={removeToast} />
        </div>
    );
}