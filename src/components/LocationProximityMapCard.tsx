import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Navigation,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Globe,
  Compass,
  LocateFixed,
  CheckCircle2,
  Crosshair,
  Info,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

interface LocationScenario {
  id: string;
  label: string;
  currentLocationName: string;
  currentCoords: { lat: number; lng: number; x: number; y: number }; // x, y percentages for canvas map rendering
  ip: string;
  isp: string;
  distanceKm: number;
  status: "SAFE" | "ELEVATED" | "CRITICAL";
  statusMessage: string;
  vpnDetected: boolean;
  deviceFingerprint: string;
}

interface LocationProximityMapCardProps {
  username?: string;
  currentRole?: string;
}

const HOME_BRANCH = {
  name: "BankGuard HQ - BKC Financial District",
  city: "Mumbai, MH, India",
  coords: { lat: 19.0657, lng: 72.8682, x: 42, y: 55 }, // Canvas position
  address: "Plot C-54, G-Block, Bandra Kurla Complex, Mumbai 400051",
  geofenceRadiusKm: 25,
};

const getRoleScenarios = (role: string): LocationScenario[] => {
  switch (role) {
    case "Manager":
      return [
        {
          id: "near",
          label: "Active Session (Bengaluru Hub)",
          currentLocationName: "Outer Ring Road Tech Hub (Bengaluru, KA)",
          currentCoords: { lat: 12.9716, lng: 77.5946, x: 82, y: 84 },
          ip: "106.51.72.18 (SecOps Threat Intel Node)",
          isp: "Airtel Enterprise Cyber Gateway",
          distanceKm: 842.5,
          status: "ELEVATED",
          statusMessage: "Active Manager Session from Approved Regional Data Hub (Bengaluru)",
          vpnDetected: false,
          deviceFingerprint: "Match 99.2% (Windows Workstation #WS-MGR-04)",
        },
        {
          id: "regional",
          label: "Branch Audit (Hyderabad)",
          currentLocationName: "HITEC City Regional Node (Hyderabad, TS)",
          currentCoords: { lat: 17.4486, lng: 78.3742, x: 68, y: 62 },
          ip: "183.82.100.44 (Branch VPN Tunnel)",
          isp: "Reliance Jio Enterprise Fiber",
          distanceKm: 620.1,
          status: "ELEVATED",
          statusMessage: "Secondary Office Login within Verified South Zone Perimeter",
          vpnDetected: true,
          deviceFingerprint: "Match 98.1% (SecOps Laptop #NB-220)",
        },
        {
          id: "anomalous",
          label: "Anomalous Login (Unrecognized Proxy)",
          currentLocationName: "Zurich Datacenter Subnet (Switzerland)",
          currentCoords: { lat: 47.3769, lng: 8.5417, x: 12, y: 15 },
          ip: "185.220.101.5 (Tor Exit Node)",
          isp: "Unknown Foreign Host",
          distanceKm: 6540.0,
          status: "CRITICAL",
          statusMessage: "Critical Threat: Foreign Data Center IP Mismatch (>6500 km). Session Isolation Triggered",
          vpnDetected: true,
          deviceFingerprint: "Unrecognized Device Canvas / Mismatched TLS Fingerprint",
        },
      ];

    case "Auditor":
      return [
        {
          id: "near",
          label: "Active Session (New Delhi HQ)",
          currentLocationName: "Capital Compliance Subnet (New Delhi, DL)",
          currentCoords: { lat: 28.6139, lng: 77.2090, x: 28, y: 22 },
          ip: "115.240.90.5 (Auditor Vault Gateway)",
          isp: "National Informatics Cyber Fiber",
          distanceKm: 1150.2,
          status: "ELEVATED",
          statusMessage: "Active Compliance Auditor Session from Verified Delhi Capital Node",
          vpnDetected: false,
          deviceFingerprint: "Match 99.8% (Linux Secure Terminal #AUD-77)",
        },
        {
          id: "regional",
          label: "Field Inspection (Gurugram)",
          currentLocationName: "Cyber City Audit Terminal (Gurugram, HR)",
          currentCoords: { lat: 28.4595, lng: 77.0266, x: 24, y: 26 },
          ip: "122.160.18.99 (Audit Secure Wireless)",
          isp: "Airtel Enterprise Cyber Gateway",
          distanceKm: 1162.0,
          status: "ELEVATED",
          statusMessage: "Field Audit Connection within Approved NCR Capital Zone",
          vpnDetected: true,
          deviceFingerprint: "Match 98.7% (Audit Laptop #AUD-NB-02)",
        },
        {
          id: "anomalous",
          label: "Anomalous Login (Out-of-Region)",
          currentLocationName: "Frankfurt Cloud Terminal (Germany)",
          currentCoords: { lat: 50.1109, lng: 8.6821, x: 10, y: 12 },
          ip: "91.240.118.12 (High-Risk Hosting Subnet)",
          isp: "Unrecognized Foreign ISP",
          distanceKm: 6580.4,
          status: "CRITICAL",
          statusMessage: "Critical Anomaly: Out-of-Country Audit Attempt. Token Invalidated",
          vpnDetected: true,
          deviceFingerprint: "Unknown Hardware Key Signature",
        },
      ];

    case "Employee":
      return [
        {
          id: "near",
          label: "Active Session (Pune Branch)",
          currentLocationName: "Pune Operations Terminal (Pune, MH)",
          currentCoords: { lat: 18.5204, lng: 73.8567, x: 58, y: 66 },
          ip: "49.207.50.110 (Branch Staff Subnet)",
          isp: "Reliance Jio Corporate Subnet",
          distanceKm: 118.4,
          status: "ELEVATED",
          statusMessage: "Active Staff Session from Pune Regional Operations Branch",
          vpnDetected: false,
          deviceFingerprint: "Match 99.5% (Corporate ThinkPad #EMP-102)",
        },
        {
          id: "regional",
          label: "HQ Visit (Mumbai)",
          currentLocationName: "BKC Customer Service Terminal (Mumbai)",
          currentCoords: { lat: 19.0657, lng: 72.8682, x: 44, y: 53 },
          ip: "182.70.210.88 (HQ Guest Secure Portal)",
          isp: "BankGuard Internal Fiber Gateway",
          distanceKm: 0.8,
          status: "SAFE",
          statusMessage: "Within Registered HQ Perimeter Boundary (<25 km)",
          vpnDetected: false,
          deviceFingerprint: "Match 99.1% (Corporate ThinkPad #EMP-102)",
        },
        {
          id: "anomalous",
          label: "Anomalous Login (Unregistered IP)",
          currentLocationName: "Kolkata Residential Subnet (West Bengal)",
          currentCoords: { lat: 22.5726, lng: 88.3639, x: 92, y: 48 },
          ip: "192.168.1.105 (Consumer ISP / Anomaly)",
          isp: "B2C Consumer Broadband",
          distanceKm: 1650.0,
          status: "CRITICAL",
          statusMessage: "Geo-Anomaly: Login from Unverified Residential Subnet (>1600 km). Step-Up Required",
          vpnDetected: true,
          deviceFingerprint: "Mismatched Browser User-Agent",
        },
      ];

    case "Admin":
    default:
      return [
        {
          id: "near",
          label: "Active Session (CISO BKC HQ)",
          currentLocationName: "BKC SecOps Terminal 04 (Mumbai, MH)",
          currentCoords: { lat: 19.0720, lng: 72.8750, x: 46, y: 51 },
          ip: "182.70.241.12 (Dedicated CISO Leased Line)",
          isp: "BankGuard Internal Fiber Gateway",
          distanceKm: 0.8,
          status: "SAFE",
          statusMessage: "Within Registered Primary Geofence Radius (<25 km)",
          vpnDetected: false,
          deviceFingerprint: "Match 99.9% (CISO Workstation #WS-902)",
        },
        {
          id: "regional",
          label: "Regional Office Commute (Navi Mumbai)",
          currentLocationName: "Navi Mumbai Data Center Subnet",
          currentCoords: { lat: 19.0330, lng: 73.0297, x: 78, y: 72 },
          ip: "49.207.180.92 (Branch VPN Tunnel)",
          isp: "Reliance Jio Enterprise Fiber",
          distanceKm: 18.4,
          status: "ELEVATED",
          statusMessage: "Outside Immediate Office Perimeter but within Approved Metro Radius",
          vpnDetected: true,
          deviceFingerprint: "Match 98.4% (SecOps Laptop #NB-114)",
        },
        {
          id: "anomalous",
          label: "Anomalous Login (Out-of-State)",
          currentLocationName: "Outer Ring Road Tech Park (Bengaluru)",
          currentCoords: { lat: 12.9716, lng: 77.5946, x: 88, y: 92 },
          ip: "185.220.101.5 (Unknown Data Center IP)",
          isp: "Unrecognized Cloud Host / Datacenter",
          distanceKm: 842.5,
          status: "CRITICAL",
          statusMessage: "Severe Geo-Discrepancy: >800 km from Home Branch. Step-Up 2FA & Hold Triggered",
          vpnDetected: true,
          deviceFingerprint: "Unknown Device / Mismatched Browser Canvas",
        },
      ];
  }
};

export const LocationProximityMapCard: React.FC<LocationProximityMapCardProps> = ({
  username = "Harsh Ganeshwade",
  currentRole = "Admin",
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("near");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeScenarios = getRoleScenarios(currentRole);

  // Rotate and reset scenario state whenever currentRole changes
  useEffect(() => {
    setSelectedScenarioId("near");
  }, [currentRole]);

  const scenario = activeScenarios.find((s) => s.id === selectedScenarioId) || activeScenarios[0];

  const handleScenarioChange = (id: string) => {
    setIsSimulating(true);
    setSelectedScenarioId(id);
    setTimeout(() => {
      setIsSimulating(false);
    }, 300);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0F141D] border border-[#202938] space-y-5 shadow-xl relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <LocateFixed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Login Geo-Proximity & Branch Verification
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  REAL-TIME GPS / IP RADAR
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Compares active authentication origin coordinates against registered home branch geofence boundary.
              </p>
            </div>
          </div>
        </div>

        {/* Proximity Status Pill */}
        <div className="shrink-0">
          {scenario.status === "SAFE" && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 font-mono text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GEOFENCE MATCH ({scenario.distanceKm} km)</span>
            </div>
          )}

          {scenario.status === "ELEVATED" && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-2 font-mono text-xs font-bold shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ELEVATED DISTANCE ({scenario.distanceKm} km)</span>
            </div>
          )}

          {scenario.status === "CRITICAL" && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center gap-2 font-mono text-xs font-bold shadow-sm animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>GEO-ANOMALY ALERT ({scenario.distanceKm} km)</span>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#202938]/60 relative z-10">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1 mr-1">
          <Compass className="w-3.5 h-3.5 text-sky-400" /> Scenario Simulator:
        </span>
        {activeScenarios.map((sc) => {
          const isActive = sc.id === scenario.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? sc.status === "SAFE"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-sm"
                    : sc.status === "ELEVATED"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold shadow-sm"
                    : "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold shadow-sm"
                  : "bg-[#080B12] text-slate-400 border-[#202938] hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  sc.status === "SAFE"
                    ? "bg-emerald-400"
                    : sc.status === "ELEVATED"
                    ? "bg-amber-400"
                    : "bg-rose-400"
                }`}
              />
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tactical Map Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        {/* Map Canvas / Visual Radar Section (8 Cols) */}
        <div className="lg:col-span-7 bg-[#080B12] border border-[#202938] rounded-xl p-4 relative min-h-[300px] flex flex-col justify-between overflow-hidden group">
          {/* Top Bar inside Map Canvas */}
          <div className="flex items-center justify-between text-[11px] font-mono z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-bold tracking-wider uppercase">
                SecOps Geo-Radar v4.2
              </span>
            </div>
            <div className="text-slate-500 flex items-center gap-2">
              <span>LAT: {scenario.currentCoords.lat.toFixed(4)}° N</span>
              <span>LNG: {scenario.currentCoords.lng.toFixed(4)}° E</span>
            </div>
          </div>

          {/* SVG Map Canvas Overlay */}
          <div className="absolute inset-0 pt-8 pb-8 px-4 flex items-center justify-center">
            <svg className="w-full h-full text-slate-800/40" viewBox="0 0 400 240">
              {/* Radar Grid Circles */}
              <circle cx="160" cy="130" r="40" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="160" cy="130" r="90" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="160" cy="130" r="140" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="5 5" />

              {/* Crosshair Axes */}
              <line x1="20" y1="130" x2="380" y2="130" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="160" y1="20" x2="160" y2="220" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

              {/* Home Branch Geofence Safety Zone Boundary (25km) */}
              <circle
                cx={HOME_BRANCH.coords.x * 4}
                cy={HOME_BRANCH.coords.y * 2.4}
                r="45"
                fill="rgba(16, 185, 129, 0.05)"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="opacity-70"
              />

              {/* Vector Vector Connecting Line */}
              <motion.line
                x1={HOME_BRANCH.coords.x * 4}
                y1={HOME_BRANCH.coords.y * 2.4}
                x2={scenario.currentCoords.x * 4}
                y2={scenario.currentCoords.y * 2.4}
                stroke={
                  scenario.status === "SAFE"
                    ? "#10b981"
                    : scenario.status === "ELEVATED"
                    ? "#f59e0b"
                    : "#f43f5e"
                }
                strokeWidth="2"
                strokeDasharray="5 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              {/* Floating Distance Badge on Midpoint */}
              <foreignObject
                x={(HOME_BRANCH.coords.x * 4 + scenario.currentCoords.x * 4) / 2 - 35}
                y={(HOME_BRANCH.coords.y * 2.4 + scenario.currentCoords.y * 2.4) / 2 - 12}
                width="70"
                height="24"
              >
                <div className="bg-[#0F141D] border border-[#334155] rounded px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-200 text-center shadow-lg">
                  {scenario.distanceKm} km
                </div>
              </foreignObject>

              {/* HOME BRANCH MARKER */}
              <g transform={`translate(${HOME_BRANCH.coords.x * 4}, ${HOME_BRANCH.coords.y * 2.4})`}>
                <circle r="12" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.5" />
                <circle r="4" fill="#38bdf8" />
              </g>

              {/* CURRENT LOGIN LOCATION MARKER */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                transform={`translate(${scenario.currentCoords.x * 4}, ${scenario.currentCoords.y * 2.4})`}
              >
                <circle
                  r="16"
                  fill={
                    scenario.status === "SAFE"
                      ? "rgba(16, 185, 129, 0.2)"
                      : scenario.status === "ELEVATED"
                      ? "rgba(245, 158, 11, 0.2)"
                      : "rgba(244, 63, 94, 0.3)"
                  }
                  stroke={
                    scenario.status === "SAFE"
                      ? "#10b981"
                      : scenario.status === "ELEVATED"
                      ? "#f59e0b"
                      : "#f43f5e"
                  }
                  strokeWidth="2"
                  className="animate-ping"
                />
                <circle
                  r="6"
                  fill={
                    scenario.status === "SAFE"
                      ? "#10b981"
                      : scenario.status === "ELEVATED"
                      ? "#f59e0b"
                      : "#f43f5e"
                  }
                />
              </motion.g>
            </svg>
          </div>

          {/* HTML Overlay Pins for Labels */}
          <div className="relative w-full h-[220px] pointer-events-none z-20">
            {/* Home Branch Label Pin */}
            <div
              className="absolute -translate-x-1/2 -translate-y-full mb-1 flex flex-col items-center"
              style={{
                left: `${HOME_BRANCH.coords.x}%`,
                top: `${HOME_BRANCH.coords.y}%`,
              }}
            >
              <div className="bg-[#0F141D]/90 border border-sky-500/40 rounded px-2 py-1 text-[10px] font-mono text-sky-300 font-bold whitespace-nowrap shadow-md flex items-center gap-1 backdrop-blur-xs">
                <Building2 className="w-3 h-3 text-sky-400" />
                <span>BKC Home Branch</span>
              </div>
            </div>

            {/* Current Login Label Pin */}
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -translate-x-1/2 -translate-y-full mb-1 flex flex-col items-center"
              style={{
                left: `${scenario.currentCoords.x}%`,
                top: `${scenario.currentCoords.y}%`,
              }}
            >
              <div
                className={`bg-[#0F141D]/95 border rounded px-2.5 py-1 text-[10px] font-mono font-bold whitespace-nowrap shadow-xl flex items-center gap-1.5 backdrop-blur-xs ${
                  scenario.status === "SAFE"
                    ? "border-emerald-500/50 text-emerald-300"
                    : scenario.status === "ELEVATED"
                    ? "border-amber-500/50 text-amber-300"
                    : "border-rose-500/60 text-rose-300 animate-bounce"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Current Login ({scenario.distanceKm} km)</span>
              </div>
            </motion.div>
          </div>

          {/* Map Legend Footer */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-[#202938] pt-2 z-20">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Registered Branch
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Geofence Boundary (25km)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Active Session Origin
              </span>
            </div>
            <span className="text-slate-500">Haversine Distance Model</span>
          </div>
        </div>

        {/* Telemetry Details Section (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          {/* Home Branch Card Box */}
          <div className="p-3.5 rounded-xl bg-[#080B12] border border-[#202938] space-y-1.5 font-mono text-xs">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" /> Registered Home Branch
            </div>
            <div className="text-slate-100 font-bold font-sans">{HOME_BRANCH.name}</div>
            <div className="text-[11px] text-slate-400 font-sans">{HOME_BRANCH.address}</div>
            <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between border-t border-[#1e293b]">
              <span>Geofence Policy:</span>
              <span className="text-emerald-400 font-bold">{HOME_BRANCH.geofenceRadiusKm} km Safe Zone</span>
            </div>
          </div>

          {/* Active Session Location Box */}
          <div className="p-3.5 rounded-xl bg-[#080B12] border border-[#202938] space-y-2 font-mono text-xs">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Active Login Origin
              </span>
              <span className="text-[9px] text-slate-400">IP Geolocation</span>
            </div>

            <div className="text-white font-bold font-sans text-sm">{scenario.currentLocationName}</div>

            <div className="space-y-1 text-[11px] pt-1 border-t border-[#1e293b]">
              <div className="flex justify-between">
                <span className="text-slate-400">IP Address:</span>
                <span className="text-sky-300 font-bold">{scenario.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ISP Provider:</span>
                <span className="text-slate-300">{scenario.isp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Proximity Offset:</span>
                <span
                  className={
                    scenario.status === "SAFE"
                      ? "text-emerald-400 font-bold"
                      : scenario.status === "ELEVATED"
                      ? "text-amber-400 font-bold"
                      : "text-rose-400 font-bold"
                  }
                >
                  {scenario.distanceKm} km from Branch
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hardware Fingerprint:</span>
                <span className="text-slate-300">{scenario.deviceFingerprint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Proxy / VPN Detection:</span>
                <span className={scenario.vpnDetected ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                  {scenario.vpnDetected ? "DETECTED (Proxy Tunnel)" : "NONE (Direct IP)"}
                </span>
              </div>
            </div>
          </div>

          {/* Proximity Assessment Summary Banner */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
              scenario.status === "SAFE"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : scenario.status === "ELEVATED"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-rose-500/15 border-rose-500/40 text-rose-300"
            }`}
          >
            <Info className="w-4 h-4 shrink-0" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold block">Security Policy Evaluation:</span>
              {scenario.statusMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
