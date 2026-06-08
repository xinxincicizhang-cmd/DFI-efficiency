"use client";

import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { clsx } from "clsx";
import RiskScoreCard from "../../components/RiskScoreCard";
import RiskRadarChart from "../../components/RiskRadarChart";
import PSBreakdownTable from "../../components/PSBreakdownTable";
import SimilarProjectsTable from "../../components/SimilarProjectsTable";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AssessmentResult {
  assessment_id: string;
  filename: string;
  extracted_info: {
    project_name: string;
    location: string;
    country: string;
    region: string;
    sector: string;
    project_type: string;
    scale_usd: number | null;
    environmental_category: string;
    esg_keywords_found: string[];
  };
  risk_scores: {
    overall: number;
    ps1_social: number;
    ps2_labor: number;
    ps3_pollution: number;
    ps4_community: number;
    ps5_land: number;
    ps6_biodiversity: number;
    ps7_indigenous: number;
    ps8_cultural: number;
  };
  risk_level: string;
  ps_breakdown: Array<{
    standard: string;
    name: string;
    score: number;
    key_factors: string[];
  }>;
  similar_projects: Array<{
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
  }>;
  recommended_actions: string[];
  confidence_score: number;
}

function formatUSD(value: number | null) {
  if (!value) return "Unknown";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setError(null);
    } else {
      setError("Please upload a PDF file.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<AssessmentResult>(
        `${API_BASE}/api/assessment/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            if (evt.total) {
              setProgress(Math.round((evt.loaded / evt.total) * 50));
            }
          },
        }
      );
      setProgress(100);
      setResult(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Assessment failed. Please try again.");
      } else {
        setError("Assessment failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ESG Risk Assessment</h1>
        <p className="text-gray-500 mt-1">
          Upload a project report PDF to evaluate ESG risk across IFC Performance Standards PS1–PS8
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT PANEL: Upload */}
        <div className="space-y-5">
          {/* Upload Zone */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Upload Project Report</h2>

            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                  "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all",
                  isDragging
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-gray-300 hover:border-emerald-300 hover:bg-gray-50"
                )}
              >
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 font-medium">Drag & drop your PDF here</p>
                <p className="text-gray-400 text-sm mt-1">or click to browse files</p>
                <p className="text-gray-400 text-xs mt-3">Supports PDF project reports, ESIAs, environmental assessments</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {uploading && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Analyzing document...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {!uploading && !result && (
                  <button
                    onClick={handleUpload}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Run ESG Assessment
                  </button>
                )}

                {result && (
                  <button
                    onClick={handleReset}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Upload New Document
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Extracted Project Info */}
          {result && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Extracted Project Information</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Project Name", value: result.extracted_info.project_name },
                  { label: "Country", value: result.extracted_info.country },
                  { label: "Region", value: result.extracted_info.region },
                  { label: "Sector", value: result.extracted_info.sector },
                  { label: "Project Type", value: result.extracted_info.project_type },
                  { label: "Project Scale", value: formatUSD(result.extracted_info.scale_usd) },
                  { label: "Env. Category", value: result.extracted_info.environmental_category },
                  { label: "Confidence", value: `${result.confidence_score}%` },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                    <p className="font-medium text-gray-900 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
              {result.extracted_info.esg_keywords_found.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">ESG Keywords Detected</p>
                  <div className="flex flex-wrap gap-1">
                    {result.extracted_info.esg_keywords_found.map((kw) => (
                      <span key={kw} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommended Actions */}
          {result && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Recommended Next Steps</h2>
              <ol className="space-y-3">
                {result.recommended_actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-700">{action}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Results */}
        {result ? (
          <div className="space-y-5">
            {/* Risk Score Card */}
            <RiskScoreCard
              score={result.risk_scores.overall}
              riskLevel={result.risk_level}
              confidenceScore={result.confidence_score}
            />

            {/* Radar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-2">PS1–PS8 Risk Profile</h2>
              <p className="text-xs text-gray-400 mb-4">Higher scores indicate greater ESG risk</p>
              <RiskRadarChart scores={result.risk_scores} />
            </div>

            {/* PS Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Performance Standards Breakdown</h2>
              <PSBreakdownTable breakdown={result.ps_breakdown} />
            </div>

            {/* Similar Projects */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Comparable IFC Projects
                <span className="ml-2 text-xs font-normal text-gray-400">by location & sector</span>
              </h2>
              <SimilarProjectsTable projects={result.similar_projects} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">Assessment Results Will Appear Here</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Upload a project PDF on the left to generate an ESG risk assessment with radar chart, PS breakdown, and comparable projects.
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2">
              {["PS1", "PS2", "PS3", "PS4", "PS5", "PS6", "PS7", "PS8"].map((ps) => (
                <div key={ps} className="bg-gray-50 rounded-lg px-2 py-2 text-center">
                  <p className="text-xs font-semibold text-gray-400">{ps}</p>
                  <p className="text-lg font-bold text-gray-200">—</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
