"use client";

import { useState, useMemo } from "react";
import { clsx } from "clsx";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine,
} from "recharts";
import { SAMPLE_PROJECTS, getMonitoringData } from "../../lib/mockData";

function getRiskColor(level: string) {
  const map: Record<string, string> = {
    Low: "text-green-600 bg-green-100",
    Medium: "text-yellow-600 bg-yellow-100",
    High: "text-red-600 bg-red-100",
    None: "text-gray-500 bg-gray-100",
  };
  return map[level] || "text-gray-500 bg-gray-100";
}

function getSeverityDot(severity: string) {
  if (severity === "High") return "bg-red-500";
  if (severity === "Medium") return "bg-yellow-500";
  return "bg-blue-400";
}

function getStatusPill(status: string) {
  if (status === "Open") return "bg-red-100 text-red-700";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

// Simulated satellite NDVI tile grid
function SatelliteView({ ndviValue }: { ndviValue: number }) {
  // 12x10 grid of cells with NDVI-like color variation
  const cells = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => {
      const base = ndviValue;
      const noise = (Math.sin(i * 37.3) + Math.cos(i * 13.7)) * 0.08;
      const v = Math.max(0, Math.min(1, base + noise));
      return v;
    });
  }, [ndviValue]);

  function ndviToColor(v: number): string {
    // NDVI color scale: brown (low) → yellow → green (high)
    if (v < 0.1) return "#7c4a1e";
    if (v < 0.2) return "#a0652a";
    if (v < 0.3) return "#c8a040";
    if (v < 0.4) return "#d4c060";
    if (v < 0.5) return "#9fc050";
    if (v < 0.6) return "#6aaa30";
    if (v < 0.7) return "#3d9020";
    if (v < 0.8) return "#1e7010";
    return "#0a5008";
  }

  return (
    <div className="relative">
      <div className="grid rounded-lg overflow-hidden border border-gray-200" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
        {cells.map((v, i) => (
          <div
            key={i}
            style={{ backgroundColor: ndviToColor(v), height: "28px" }}
          />
        ))}
      </div>
      {/* Overlay: simulated project boundary */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 120 100" preserveAspectRatio="none">
          <rect x="28" y="18" width="60" height="55" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
          <circle cx="58" cy="45" r="4" fill="rgba(255,200,0,0.9)" stroke="white" strokeWidth="1" />
          <text x="63" y="44" fill="white" fontSize="6" fontWeight="bold" opacity="0.9">Project site</text>
        </svg>
      </div>
      {/* NDVI legend */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-500">NDVI:</span>
        <div className="flex-1 h-2 rounded-full" style={{ background: "linear-gradient(to right, #7c4a1e, #c8a040, #6aaa30, #0a5008)" }} />
        <span className="text-xs text-gray-400">0</span>
        <span className="text-xs text-gray-500 mx-1">→</span>
        <span className="text-xs text-gray-400">1.0</span>
        <span className="ml-2 text-xs font-semibold text-emerald-700">Current: {ndviValue.toFixed(2)}</span>
      </div>
      <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
        <span>📡 Sentinel-2 L2A · 10m resolution</span>
        <span>🗓 Last scene: {new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
    </div>
  );
}

export default function MonitorPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(SAMPLE_PROJECTS[0].id);
  const data = useMemo(() => getMonitoringData(selectedProjectId), [selectedProjectId]);

  const last12Temp = data.climate_data.temperature_monthly.slice(-12);
  const last12Precip = data.climate_data.precipitation_monthly.slice(-12);
  const last12Ndvi = data.climate_data.ndvi_monthly.slice(-12);
  const last12Aqi = data.climate_data.aqi_monthly.slice(-12);
  const latestNdvi = last12Ndvi[last12Ndvi.length - 1]?.value ?? 0.5;

  const avgTemp = (last12Temp.reduce((s, d) => s + d.value, 0) / last12Temp.length).toFixed(1);
  const totalPrecip = last12Precip.reduce((s, d) => s + d.value, 0).toFixed(0);
  const avgAqi = (last12Aqi.reduce((s, d) => s + d.value, 0) / last12Aqi.length).toFixed(0);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Continuous Monitoring</h1>
          <p className="text-gray-500 mt-1">
            Satellite imagery, climate indicators, and ESG incident feed per active project
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full font-semibold border border-amber-200">
            Demo — Simulated Data
          </span>
        </div>
      </div>

      {/* Intent banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-900">Planned Integration: Real-time Environmental Monitoring</p>
          <p className="text-xs text-blue-700 mt-0.5">
            In the production system, this dashboard will connect to <strong>Sentinel-2 satellite imagery</strong> (vegetation/land use change),
            <strong> ERA5 climate reanalysis</strong> (temperature/precipitation trends), <strong>OpenAQ</strong> (air quality), and
            IFC's own <strong>grievance tracker</strong> — providing continuous ESG signal through the full project lifecycle.
            Data shown below is simulated to demonstrate the intended interface.
          </p>
        </div>
      </div>

      {/* Project selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center gap-4 flex-wrap">
        <label className="text-sm font-semibold text-gray-700 flex-shrink-0">Active Project:</label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="flex-1 max-w-md px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {SAMPLE_PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>{p.project_name} — {p.country}</option>
          ))}
        </select>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Last synced: {new Date(data.last_updated).toLocaleTimeString()}
        </div>
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 space-y-2">
          <h3 className="font-semibold text-amber-800 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Active Alerts ({data.alerts.length})
          </h3>
          {data.alerts.map((a) => (
            <div key={a.id} className="text-sm text-amber-800">
              <span className="font-semibold">{a.type}:</span> {a.message}
            </div>
          ))}
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Avg Temperature", value: `${avgTemp}°C`, sub: "12-month average", color: "text-orange-600" },
          { label: "Annual Precipitation", value: `${totalPrecip}mm`, sub: "12-month total", color: "text-blue-600" },
          { label: "Vegetation Index", value: latestNdvi.toFixed(2), sub: "Latest NDVI reading", color: "text-emerald-600" },
          { label: "Avg Air Quality Index", value: avgAqi, sub: "AQI — lower is better", color: Number(avgAqi) > 100 ? "text-red-600" : Number(avgAqi) > 50 ? "text-yellow-600" : "text-green-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
            <p className={clsx("text-2xl font-black", kpi.color)}>{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Satellite + Climate risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Satellite Land-Cover View (NDVI)</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Simulated</span>
          </div>
          <SatelliteView ndviValue={latestNdvi} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Climate Risk Profile</h2>
          <div className="space-y-3">
            {[
              { label: "Flood Risk", value: data.climate_risk.flood_risk },
              { label: "Drought Risk", value: data.climate_risk.drought_risk },
              { label: "Cyclone Risk", value: data.climate_risk.cyclone_risk },
              { label: "Sea Level Rise Exposure", value: data.climate_risk.sea_level_rise_exposure },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-full", getRiskColor(item.value))}>
                  {item.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Extreme Heat Days/yr</span>
              <span className="text-sm font-bold text-orange-600">{data.climate_risk.extreme_heat_days_per_year} days</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Open Incidents</p>
            <div className="flex gap-3">
              {["High", "Medium", "Low"].map((s) => {
                const count = data.esg_incidents.filter((i) => i.severity === s && i.status !== "Resolved").length;
                return (
                  <div key={s} className="text-center">
                    <p className={clsx("text-xl font-black", s === "High" ? "text-red-600" : s === "Medium" ? "text-yellow-600" : "text-blue-600")}>{count}</p>
                    <p className="text-xs text-gray-400">{s}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Temperature Trend (°C)</h2>
          <p className="text-xs text-gray-400 mb-4">Monthly average — last 12 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last12Temp}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }} formatter={(v: number) => [`${v.toFixed(1)}°C`, "Temp"]} />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Precipitation (mm)</h2>
          <p className="text-xs text-gray-400 mb-4">Monthly total — last 12 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last12Precip}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }} formatter={(v: number) => [`${v}mm`, "Precip"]} />
              <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Vegetation Index (NDVI)</h2>
          <p className="text-xs text-gray-400 mb-4">0 = bare soil · 1 = dense vegetation — declining trend may indicate clearing</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last12Ndvi}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }} formatter={(v: number) => [v.toFixed(3), "NDVI"]} />
              <ReferenceLine y={0.3} stroke="#f97316" strokeDasharray="4 2" label={{ value: "Alert threshold", position: "right", fontSize: 9, fill: "#f97316" }} />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Air Quality Index (AQI)</h2>
          <p className="text-xs text-gray-400 mb-4">Monthly average — below 50 Good · 50–100 Moderate · above 100 Unhealthy</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last12Aqi}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }} formatter={(v: number) => [v, "AQI"]} />
              <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "Unhealthy", position: "right", fontSize: 9, fill: "#ef4444" }} />
              <ReferenceLine y={50} stroke="#eab308" strokeDasharray="4 2" label={{ value: "Moderate", position: "right", fontSize: 9, fill: "#eab308" }} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ESG Incidents + Alert config */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">ESG Incident Feed</h2>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {data.esg_incidents.map((incident) => (
              <div key={incident.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className={clsx("mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0", getSeverityDot(incident.severity))} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-semibold text-gray-700">{incident.type}</span>
                    <span className="text-xs text-gray-400">{incident.date}</span>
                  </div>
                  <p className="text-xs text-gray-600">{incident.description}</p>
                </div>
                <span className={clsx("flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium", getStatusPill(incident.status))}>
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Future integration: auto-populated from grievance tracker, news monitoring, and field reports
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Alert Threshold Configuration</h2>
          <div className="space-y-4">
            {[
              { label: "NDVI decline alert (monthly drop)", placeholder: "0.05", unit: "NDVI units", color: "emerald" },
              { label: "Temperature anomaly alert", placeholder: "+2.5", unit: "°C above baseline", color: "orange" },
              { label: "Precipitation deficit alert", placeholder: "-40", unit: "% below monthly avg", color: "blue" },
              { label: "AQI alert threshold", placeholder: "100", unit: "AQI index", color: "purple" },
            ].map((config) => (
              <div key={config.label} className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">{config.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={config.placeholder}
                      className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-400">{config.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors">
              Save Thresholds
            </button>
            <p className="text-xs text-gray-400">Email & Slack alerts — integration planned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
