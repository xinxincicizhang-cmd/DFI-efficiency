"use client";

import { clsx } from "clsx";

interface RiskScoreCardProps {
  score: number;
  riskLevel: string;
  confidenceScore?: number;
}

function getRiskColor(score: number) {
  if (score < 30) return { ring: "border-green-500", text: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-800" };
  if (score < 60) return { ring: "border-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-800" };
  if (score < 75) return { ring: "border-orange-500", text: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-800" };
  return { ring: "border-red-500", text: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-800" };
}

export default function RiskScoreCard({ score, riskLevel, confidenceScore }: RiskScoreCardProps) {
  const colors = getRiskColor(score);

  return (
    <div className={clsx("rounded-xl border-2 p-6 text-center", colors.ring, colors.bg)}>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Overall ESG Risk Score
      </p>
      <div className={clsx("text-7xl font-black mb-3", colors.text)}>
        {score}
      </div>
      <div className="text-lg text-gray-500 mb-4">/ 100</div>
      <span className={clsx("inline-block px-4 py-1.5 rounded-full text-sm font-bold", colors.badge)}>
        {riskLevel} Risk
      </span>
      {confidenceScore !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">Assessment Confidence</p>
          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{confidenceScore}%</p>
        </div>
      )}
    </div>
  );
}
