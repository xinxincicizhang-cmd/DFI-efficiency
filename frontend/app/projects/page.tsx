"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { clsx } from "clsx";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Project {
  id: string;
  project_name: string;
  country: string;
  region: string;
  sector: string;
  project_type: string;
  scale_usd: number | null;
  environmental_category: string;
  risk_level: string;
  risk_score: number;
  ps_scores: Record<string, number>;
  year: number;
  status: string;
  esg_issues: string[];
  lessons_learned: string;
}

interface Filters {
  countries: string[];
  sectors: string[];
  risk_levels: string[];
}

function getRiskBadge(level: string) {
  const map: Record<string, string> = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    "Very High": "bg-red-100 text-red-800",
  };
  return map[level] || "bg-gray-100 text-gray-800";
}

function getCatBadge(cat: string) {
  const map: Record<string, string> = {
    A: "bg-red-100 text-red-800",
    B: "bg-yellow-100 text-yellow-800",
    C: "bg-green-100 text-green-800",
  };
  return map[cat] || "bg-gray-100 text-gray-800";
}

function formatUSD(value: number | null) {
  if (!value) return "—";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  return `$${(value / 1_000_000).toFixed(0)}M`;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<Filters>({ countries: [], sectors: [], risk_levels: [] });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCountry) params.country = selectedCountry;
      if (selectedSector) params.sector = selectedSector;
      if (selectedRisk) params.risk_level = selectedRisk;
      const res = await axios.get<Project[]>(`${API_BASE}/api/projects`, { params });
      setProjects(res.data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const res = await axios.get<Filters>(`${API_BASE}/api/projects/filters`);
      setFilters(res.data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, selectedSector, selectedRisk]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${API_BASE}/api/projects/import`, formData);
      await fetchProjects();
      await fetchFilters();
    } catch {
      alert("Import failed. Please check the file format.");
    } finally {
      setImporting(false);
      if (importRef.current) importRef.current.value = "";
    }
  };

  const filtered = projects.filter((p) =>
    searchQuery
      ? p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IFC Project Database</h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} projects · Browse comparable ESG assessments
          </p>
        </div>
        <div>
          <button
            onClick={() => importRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {importing ? "Importing..." : "Import JSON"}
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search projects or countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Countries</option>
          {filters.countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Sectors</option>
          {filters.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Risk Levels</option>
          {filters.risk_levels.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {(selectedCountry || selectedSector || selectedRisk || searchQuery) && (
          <button
            onClick={() => { setSelectedCountry(""); setSelectedSector(""); setSelectedRisk(""); setSearchQuery(""); }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading projects...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Scale</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cat</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((project) => (
                  <>
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{project.project_name}</p>
                        <p className="text-xs text-gray-400">{project.id}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{project.country}</td>
                      <td className="px-5 py-3 text-gray-600">{project.sector}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{project.project_type}</td>
                      <td className="px-5 py-3 text-gray-600">{formatUSD(project.scale_usd)}</td>
                      <td className="px-5 py-3">
                        <span className={clsx("px-2 py-0.5 rounded text-xs font-bold", getCatBadge(project.environmental_category))}>
                          {project.environmental_category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{project.year}</td>
                      <td className="px-5 py-3">
                        <span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", getRiskBadge(project.risk_level))}>
                          {project.risk_level} ({project.risk_score})
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <svg
                          className={clsx("w-4 h-4 text-gray-400 transition-transform", expandedId === project.id && "rotate-180")}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </td>
                    </tr>
                    {expandedId === project.id && (
                      <tr key={`${project.id}-expanded`} className="bg-blue-50">
                        <td colSpan={9} className="px-5 py-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">PS Scores</p>
                              <div className="grid grid-cols-4 gap-1">
                                {Object.entries(project.ps_scores || {}).map(([key, val]) => (
                                  <div key={key} className="bg-white rounded p-2 text-center">
                                    <p className="text-xs text-gray-400">{key.toUpperCase()}</p>
                                    <p className={clsx("text-sm font-bold", {
                                      "text-green-600": val < 30,
                                      "text-yellow-600": val >= 30 && val < 60,
                                      "text-orange-600": val >= 60 && val < 75,
                                      "text-red-600": val >= 75,
                                    })}>{val}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">ESG Issues</p>
                              <div className="flex flex-wrap gap-1">
                                {(project.esg_issues || []).map((issue) => (
                                  <span key={issue} className="text-xs px-2 py-0.5 bg-white text-gray-700 rounded-full border border-gray-200">
                                    {issue}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Lessons Learned</p>
                              <p className="text-xs text-gray-700">{project.lessons_learned}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-10 text-center text-gray-400">No projects match the selected filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
