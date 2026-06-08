"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { SAMPLE_PROJECTS } from "../../lib/mockData";

function getRiskBadge(level: string) {
  const map: Record<string, string> = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    "Very High": "bg-red-100 text-red-800",
  };
  return map[level] || "bg-gray-100 text-gray-800";
}

function formatUSD(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(0)}M`;
  return `$${v.toLocaleString()}`;
}

const ALL_SECTORS = [...new Set(SAMPLE_PROJECTS.map((p) => p.sector))].sort();
const ALL_COUNTRIES = [...new Set(SAMPLE_PROJECTS.map((p) => p.country))].sort();
const ALL_RISK_LEVELS = ["Low", "Medium", "High", "Very High"];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = SAMPLE_PROJECTS.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.project_name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.sector.toLowerCase().includes(q);
    return (
      matchSearch &&
      (!sectorFilter || p.sector === sectorFilter) &&
      (!countryFilter || p.country === countryFilter) &&
      (!riskFilter || p.risk_level === riskFilter)
    );
  });

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">IFC Project Database</h1>
        <p className="text-gray-500 mt-1">
          Reference dataset of past IFC-financed projects — used to match comparable projects during ESG assessment
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search projects, countries, sectors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Sectors</option>
          {ALL_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Countries</option>
          {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Risk Levels</option>
          {ALL_RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {(search || sectorFilter || countryFilter || riskFilter) && (
          <button onClick={() => { setSearch(""); setSectorFilter(""); setCountryFilter(""); setRiskFilter(""); }} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Clear filters
          </button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} projects</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Scale</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cat.</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((project) => (
              <>
                <tr key={project.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggle(project.id)}>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{project.project_name}</p>
                    <p className="text-xs text-gray-400">{project.id} · {project.year}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{project.country}</td>
                  <td className="px-6 py-3 text-gray-600">{project.sector}</td>
                  <td className="px-6 py-3 text-gray-600">{formatUSD(project.scale_usd)}</td>
                  <td className="px-6 py-3">
                    <span className={clsx("font-bold text-sm", {
                      "text-red-600": project.environmental_category === "A",
                      "text-yellow-600": project.environmental_category === "B",
                      "text-green-600": project.environmental_category === "C",
                    })}>
                      {project.environmental_category}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={clsx("h-full rounded-full", {
                            "bg-green-500": project.risk_score < 30,
                            "bg-yellow-500": project.risk_score >= 30 && project.risk_score < 60,
                            "bg-orange-500": project.risk_score >= 60 && project.risk_score < 75,
                            "bg-red-500": project.risk_score >= 75,
                          })}
                          style={{ width: `${project.risk_score}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-700">{project.risk_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", getRiskBadge(project.risk_level))}>
                      {project.risk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    <svg className={clsx("w-4 h-4 transition-transform", expanded === project.id ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </td>
                </tr>
                {expanded === project.id && (
                  <tr key={`${project.id}-detail`} className="bg-slate-50">
                    <td colSpan={8} className="px-6 py-5">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">PS1–PS8 Scores</p>
                          <div className="grid grid-cols-4 gap-2">
                            {(Object.entries(project.ps_scores) as [string, number][]).map(([key, score]) => (
                              <div key={key} className="text-center bg-white rounded-lg p-2 border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase">{key.toUpperCase()}</p>
                                <p className={clsx("text-lg font-bold", {
                                  "text-green-600": score < 30,
                                  "text-yellow-600": score >= 30 && score < 60,
                                  "text-orange-600": score >= 60 && score < 75,
                                  "text-red-600": score >= 75,
                                })}>{score}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Key ESG Issues</p>
                          <ul className="space-y-1.5">
                            {project.esg_issues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Lessons Learned</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{project.lessons_learned}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", project.status === "Completed" ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700")}>
                              {project.status}
                            </span>
                            <span className="text-xs text-gray-400">{project.project_type} · {project.region}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">No projects match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
