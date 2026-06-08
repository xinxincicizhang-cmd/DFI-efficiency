"use client";

import { clsx } from "clsx";

interface PSBreakdown {
  standard: string;
  name: string;
  score: number;
  key_factors: string[];
}

interface PSBreakdownTableProps {
  breakdown: PSBreakdown[];
}

function getScoreColor(score: number) {
  if (score < 30) return "text-green-700 bg-green-100";
  if (score < 60) return "text-yellow-700 bg-yellow-100";
  if (score < 75) return "text-orange-700 bg-orange-100";
  return "text-red-700 bg-red-100";
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score < 30
      ? "bg-green-500"
      : score < 60
      ? "bg-yellow-500"
      : score < 75
      ? "bg-orange-500"
      : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={clsx(
          "text-xs font-bold px-2 py-0.5 rounded-full min-w-[3rem] text-center",
          getScoreColor(score)
        )}
      >
        {score}
      </span>
    </div>
  );
}

export default function PSBreakdownTable({ breakdown }: PSBreakdownTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
              PS
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Performance Standard
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
              Risk Score
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Key Risk Factors
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {breakdown.map((row) => (
            <tr key={row.standard} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <span className="font-bold text-slate-700">{row.standard}</span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.name}</td>
              <td className="px-4 py-3">
                <ScoreBar score={row.score} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {row.key_factors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
