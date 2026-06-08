"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Project {
  id: string;
  project_name: string;
  country: string;
  sector: string;
  risk_level: string;
  risk_score: number;
  year: number;
  status: string;
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

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/projects`)
      .then((res) => setProjects(res.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: projects.length,
    highRisk: projects.filter((p) => p.risk_level === "High" || p.risk_level === "Very High").length,
    sectors: new Set(projects.map((p) => p.sector)).size,
    countries: new Set(projects.map((p) => p.country)).size,
  };

  const recentProjects = projects.slice(0, 8);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ESG Risk Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Development Finance Institution — IFC Performance Standards Evaluation Platform
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Evaluate ESG Risk with IFC Standards</h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Upload a project report PDF to automatically extract project metadata, score risk across
              all 8 IFC Performance Standards, and find comparable past projects from our database.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Start New Assessment
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "PS1 Social", score: 72 },
                { label: "PS3 Pollution", score: 45 },
                { label: "PS6 Biodiversity", score: 88 },
                { label: "PS7 Indigenous", score: 31 },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-slate-300">{item.label}</p>
                  <p className="text-lg font-bold">{item.score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Projects in Database", value: stats.total, icon: "🗂️", color: "text-blue-600" },
          { label: "High / Very High Risk", value: stats.highRisk, icon: "⚠️", color: "text-red-600" },
          { label: "Sectors Covered", value: stats.sectors, icon: "🏭", color: "text-purple-600" },
          { label: "Countries", value: stats.countries, icon: "🌍", color: "text-emerald-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={clsx("text-3xl font-black", stat.color)}>
                {loading ? "—" : stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Link
          href="/upload"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">New Assessment</h3>
          <p className="text-sm text-gray-500">Upload a project PDF and get instant ESG risk scoring across PS1-PS8</p>
        </Link>

        <Link
          href="/projects"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4-8 4m16 0c0 2.21-3.582 4-8 4" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Browse Projects</h3>
          <p className="text-sm text-gray-500">Search and explore the IFC project database with filters by country, sector, and risk</p>
        </Link>

        <Link
          href="/monitor"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">View Monitoring</h3>
          <p className="text-sm text-gray-500">Track active projects with climate data, satellite imagery, and incident feeds</p>
        </Link>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">IFC Project Database</h2>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading projects...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="font-medium text-gray-900">{project.project_name}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{project.country}</td>
                    <td className="px-6 py-3 text-gray-600">{project.sector}</td>
                    <td className="px-6 py-3 text-gray-500">{project.year}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
                        <span className="text-gray-700 font-medium">{project.risk_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", getRiskBadge(project.risk_level))}>
                        {project.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
