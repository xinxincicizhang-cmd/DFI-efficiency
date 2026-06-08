"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { SAMPLE_PROJECTS } from "../lib/mockData";

function getRiskBadge(level: string) {
  const map: Record<string, string> = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    "Very High": "bg-red-100 text-red-800",
  };
  return map[level] || "bg-gray-100 text-gray-800";
}

const stats = {
  total: SAMPLE_PROJECTS.length,
  highRisk: SAMPLE_PROJECTS.filter((p) => p.risk_level === "High" || p.risk_level === "Very High").length,
  sectors: new Set(SAMPLE_PROJECTS.map((p) => p.sector)).size,
  countries: new Set(SAMPLE_PROJECTS.map((p) => p.country)).size,
};

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ESG Risk Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Development Finance Institution — IFC Performance Standards Evaluation Platform
        </p>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-xl font-bold mb-3">AI-Powered ESG Evaluation for DFI Analysts</h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed mb-2">
              Upload a project report PDF. The platform extracts metadata, matches it against a database of past IFC-financed
              projects with similar locations and sectors, and scores risk across all 8 IFC Performance Standards —
              giving analysts a structured starting point for due diligence.
            </p>
            <p className="text-slate-400 text-xs max-w-xl mb-5">
              In the future, active projects will be continuously monitored using satellite imagery, vegetation indices,
              climate data, and incident feeds — creating a live ESG risk signal throughout the project lifecycle.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Try Demo Assessment
            </Link>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { label: "PS5 Land & Resettlement", score: 88, color: "text-red-400" },
              { label: "PS6 Biodiversity", score: 78, color: "text-orange-400" },
              { label: "PS7 Indigenous Peoples", score: 72, color: "text-orange-400" },
              { label: "PS2 Labor & Working Cond.", score: 62, color: "text-yellow-400" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-lg px-3 py-2 text-center w-36">
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className={clsx("text-2xl font-black", item.color)}>{item.score}</p>
                <p className="text-xs text-slate-500">/ 100</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
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
              <span className={clsx("text-3xl font-black", stat.color)}>{stat.value}</span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Link href="/upload" className="bg-white rounded-xl border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">New Assessment</h3>
          <p className="text-sm text-gray-500">Upload a project PDF and get instant ESG risk scoring across PS1–PS8 with comparable projects</p>
        </Link>

        <Link href="/projects" className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Project Database</h3>
          <p className="text-sm text-gray-500">Browse 20 past IFC-financed projects — filter by country, sector, and risk level</p>
        </Link>

        <Link href="/monitor" className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Continuous Monitoring</h3>
          <p className="text-sm text-gray-500">Track active projects with climate trends, vegetation indices, and ESG incident feeds</p>
        </Link>
      </div>

      {/* Project table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">IFC Project Reference Database</h2>
            <p className="text-xs text-gray-400 mt-0.5">Sample dataset — 20 representative past projects across sectors and regions</p>
          </div>
          <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
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
              {SAMPLE_PROJECTS.slice(0, 10).map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{project.project_name}</td>
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
      </div>
    </div>
  );
}
