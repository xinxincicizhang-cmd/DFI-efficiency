"use client";

import { clsx } from "clsx";

interface SimilarProject {
  id: string;
  project_name: string;
  country: string;
  sector: string;
  project_type: string;
  risk_level: string;
  risk_score: number;
  similarity_score: number;
  lessons_learned: string;
  year: number;
}

interface SimilarProjectsTableProps {
  projects: SimilarProject[];
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

function SimilarityBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-blue-700">{score}%</span>
    </div>
  );
}

export default function SimilarProjectsTable({ projects }: SimilarProjectsTableProps) {
  if (!projects || projects.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-6">
        No similar projects found in database.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Match</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Lesson</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{p.project_name}</p>
                  <p className="text-xs text-gray-400">{p.year} · {p.project_type}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{p.country}</td>
              <td className="px-4 py-3 text-gray-600">{p.sector}</td>
              <td className="px-4 py-3">
                <span className={clsx("px-2 py-0.5 rounded-full text-xs font-semibold", getRiskBadge(p.risk_level))}>
                  {p.risk_level}
                </span>
              </td>
              <td className="px-4 py-3">
                <SimilarityBar score={p.similarity_score} />
              </td>
              <td className="px-4 py-3">
                <p className="text-xs text-gray-600 line-clamp-2">{p.lessons_learned}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
