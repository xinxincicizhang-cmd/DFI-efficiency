"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RiskScores {
  ps1_social: number;
  ps2_labor: number;
  ps3_pollution: number;
  ps4_community: number;
  ps5_land: number;
  ps6_biodiversity: number;
  ps7_indigenous: number;
  ps8_cultural: number;
}

interface RiskRadarChartProps {
  scores: RiskScores;
}

export default function RiskRadarChart({ scores }: RiskRadarChartProps) {
  const data = [
    { subject: "PS1 Social", score: scores.ps1_social, fullMark: 100 },
    { subject: "PS2 Labor", score: scores.ps2_labor, fullMark: 100 },
    { subject: "PS3 Pollution", score: scores.ps3_pollution, fullMark: 100 },
    { subject: "PS4 Community", score: scores.ps4_community, fullMark: 100 },
    { subject: "PS5 Land", score: scores.ps5_land, fullMark: 100 },
    { subject: "PS6 Biodiversity", score: scores.ps6_biodiversity, fullMark: 100 },
    { subject: "PS7 Indigenous", score: scores.ps7_indigenous, fullMark: 100 },
    { subject: "PS8 Cultural", score: scores.ps8_cultural, fullMark: 100 },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <Radar
            name="Risk Score"
            dataKey="score"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value: number) => [`${value}`, "Risk Score"]}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
