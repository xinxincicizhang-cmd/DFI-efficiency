"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { clsx } from "clsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import MonitoringMap from "../../components/MonitoringMap";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Project {
  id: string;
  project_name: string;
  country: string;
  sector: string;
}

interface MonitoringData {
  project_id: string;
  project_name: string;
  country: string;
  sector: string;
  monitoring_status: string;
  last_updated: string;
  climate_data: {
    temperature_monthly: Array<{ date: string; value: number }>;
    precipitation_monthly: Array<{ date: string; value: number }>;
    ndvi_monthly: Array<{ date: string; value: number }>;
    aqi_monthly: Array<{ date: string; value: number }>;
  };
  climate_risk: {
    flood_risk: string;
    drought_risk: string;
    extreme_heat_days_per_year: number;
    sea_level_rise_exposure: string;
    cyclone_risk: string;
  };
  esg_incidents: Array<{
    id: string;
    date: string;
    type: string;
    severity: string;
    description: string;
    status: string;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    created_at: string;
  }>;
}

function getRiskColor(level: string) {
  const map: Record<string, string> = {
    Low: "text-green-600 bg-green-100",
    Medium: "text-yellow-600 bg-yellow-100",
    High: "text-red-600 bg-red-100",
    None: "text-gray-500 bg-gray-100",
  };
  return map[level] || "text-gray-500 bg-gray-100";
}

function getSeverityColor(severity: string) {
  const map: Record<string, string> = {
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  };
  return map[severity] || "bg-gray-100 text-gray-800";
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    Open: "bg-red-100 text-red-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Resolved: "bg-green-100 text-green-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export default function MonitorPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingMonitor, setLoadingMonitor] = useState(false);

  useEffect(() => {
    axios
      .get<Project[]>(`${API_BASE}/api/projects`)
      .then((res) => {
        setProjects(res.data);
        if (res.data.length > 0) {
          setSelectedProjectId(res.data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProjects(false));
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    setLoadingMonitor(true);
    axios
      .get<MonitoringData>(`${API_BASE}/api/monitoring/${selectedProjectId}`)
      .then((res) => setMonitoringData(res.data))
      .catch(() => setMonitoringData(null))
      .finally(() => setLoadingMonitor(false));
  }, [selectedProjectId]);

  const chartData = monitoringData?.climate_data.temperature_monthly.slice(-12) || [];
  const precipData = monitoringData?.climate_data.precipitation_monthly.slice(-12) || [];
  const ndviData = monitoringData?.climate_data.ndvi_monthly.slice(-12) || [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Continuous Monitoring</h1>
          <p className="text-gray-500 mt-1">
            Satellite imagery, climate indicators, and ESG incident feed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live Data Feed
          </span>
        </div>
      </div>

      {/* Project Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700 flex-shrink-0">Select Project:</label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="flex-1 max-w-md px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          disabled={loadingProjects}
        >
          {loadingProjects ? (
            <option>Loading projects...</option>
          ) : (
            projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_name} — {p.country}
              </option>
            ))
          )}
        </select>
        {monitoringData && (
          <div className="text-xs text-gray-400">
            Last updated: {new Date(monitoringData.last_updated).toLocaleString()}
          </div>
        )}
      </div>

      {loadingMonitor ? (
        <div className="text-center py-16 text-gray-400">Loading monitoring data...</div>
      ) : monitoringData ? (
        <div className="space-y-5">
          {/* Alerts */}
          {monitoringData.alerts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Active Alerts
              </h3>
              {monitoringData.alerts.map((alert) => (
                <div key={alert.id} className="text-sm text-amber-800">
                  <span className="font-medium">{alert.type}:</span> {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* Satellite + Climate Risk Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Satellite */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Satellite Imagery</h2>
              <MonitoringMap />
              <p className="text-xs text-gray-400 mt-2 text-center">
                Project: {monitoringData.project_name} · {monitoringData.country}
              </p>
            </div>

            {/* Climate Risk Indicators */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Climate Risk Profile</h2>
              <div className="space-y-3">
                {[
                  { label: "Flood Risk", value: monitoringData.climate_risk.flood_risk },
                  { label: "Drought Risk", value: monitoringData.climate_risk.drought_risk },
                  { label: "Cyclone Risk", value: monitoringData.climate_risk.cyclone_risk },
                  { label: "Sea Level Rise", value: monitoringData.climate_risk.sea_level_rise_exposure },
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
                  <span className="text-sm font-bold text-orange-600">
                    {monitoringData.climate_risk.extreme_heat_days_per_year}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Temperature Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-1">Temperature Trend (°C)</h2>
              <p className="text-xs text-gray-400 mb-4">Monthly average — last 12 months</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }}
                    formatter={(v: number) => [`${v.toFixed(1)}°C`, "Temp"]}
                  />
                  <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Precipitation Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-1">Precipitation (mm)</h2>
              <p className="text-xs text-gray-400 mb-4">Monthly total — last 12 months</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={precipData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }}
                    formatter={(v: number) => [`${v.toFixed(0)}mm`, "Precip"]}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NDVI Chart + ESG Incidents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* NDVI */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-1">Vegetation Index (NDVI)</h2>
              <p className="text-xs text-gray-400 mb-4">0 = bare soil · 1 = dense vegetation</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ndviData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f1f5f9", fontSize: "11px" }}
                    formatter={(v: number) => [v.toFixed(3), "NDVI"]}
                  />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ESG Incident Feed */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">ESG Incident Feed</h2>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {monitoringData.esg_incidents.map((incident) => (
                  <div key={incident.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={clsx("text-xs font-semibold px-1.5 py-0.5 rounded", getSeverityColor(incident.severity))}>
                          {incident.severity}
                        </span>
                        <span className="text-xs text-gray-400">{incident.date}</span>
                      </div>
                      <p className="text-xs text-gray-700">{incident.description}</p>
                    </div>
                    <span className={clsx("flex-shrink-0 text-xs px-2 py-0.5 rounded-full", getStatusColor(incident.status))}>
                      {incident.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Configuration Panel */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Alert Configuration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { label: "Temperature Threshold (°C)", value: "35", type: "number" },
                { label: "Precipitation Anomaly (%)", value: "50", type: "number" },
                { label: "NDVI Change Threshold", value: "0.1", type: "number" },
              ].map((config) => (
                <div key={config.label}>
                  <label className="text-xs text-gray-500 mb-1 block">{config.label}</label>
                  <input
                    type={config.type}
                    defaultValue={config.value}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors">
                Save Alert Settings
              </button>
              <p className="text-xs text-gray-400">
                Email notifications for threshold breaches — integration with satellite data coming soon
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">Select a project to view monitoring data.</div>
      )}
    </div>
  );
}
