"use client";

import { useState, useCallback, useRef } from "react";
import { clsx } from "clsx";
import RiskScoreCard from "../../components/RiskScoreCard";
import RiskRadarChart from "../../components/RiskRadarChart";
import PSBreakdownTable from "../../components/PSBreakdownTable";
import SimilarProjectsTable from "../../components/SimilarProjectsTable";
import { DEMO_ASSESSMENT_RESULT } from "../../lib/mockData";

type AssessmentResult = typeof DEMO_ASSESSMENT_RESULT;

const ANALYSIS_STEPS = [
  { label: "Parsing PDF document…", duration: 900 },
  { label: "Extracting project metadata…", duration: 800 },
  { label: "Identifying ESG keywords & risk signals…", duration: 1000 },
  { label: "Matching similar IFC projects by location & sector…", duration: 1100 },
  { label: "Scoring against IFC Performance Standards PS1–PS8…", duration: 1200 },
  { label: "Generating recommended analyst actions…", duration: 700 },
  { label: "Finalising assessment report…", duration: 500 },
];

function formatUSD(value: number | null) {
  if (!value) return "Unknown";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
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

  const runAnalysis = async () => {
    if (!file) return;
    setAnalysing(true);
    setStepIndex(0);
    setProgress(0);

    const totalDuration = ANALYSIS_STEPS.reduce((s, step) => s + step.duration, 0);
    let elapsed = 0;

    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, ANALYSIS_STEPS[i].duration));
      elapsed += ANALYSIS_STEPS[i].duration;
      setProgress(Math.round((elapsed / totalDuration) * 100));
    }

    setProgress(100);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setResult(DEMO_ASSESSMENT_RESULT);
    setAnalysing(false);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setStepIndex(0);
    setAnalysing(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">ESG Risk Assessment</h1>
          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold border border-amber-200">
            Demo Mode
          </span>
        </div>
        <p className="text-gray-500">
          Upload a project report PDF to evaluate ESG risk across IFC Performance Standards PS1–PS8
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT: Upload + steps */}
        <div className="space-y-5">
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
                <p className="text-gray-400 text-xs mt-3">Supports ESIAs, project appraisal documents, environmental assessments</p>
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
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
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(0)} KB · PDF document</p>
                  </div>
                  {!analysing && !result && (
                    <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Progress */}
                {analysing && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span className="font-medium text-gray-700">{ANALYSIS_STEPS[stepIndex]?.label}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      {ANALYSIS_STEPS.map((step, i) => (
                        <div key={i} className={clsx("flex items-center gap-2 text-xs", i < stepIndex ? "text-emerald-600" : i === stepIndex ? "text-gray-700" : "text-gray-300")}>
                          {i < stepIndex ? (
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : i === stepIndex ? (
                            <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0" />
                          )}
                          {step.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!analysing && !result && (
                  <button
                    onClick={runAnalysis}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
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
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}
          </div>

          {/* Extracted info */}
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
                  { label: "AI Confidence", value: `${result.confidence_score}%` },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                    <p className="font-medium text-gray-900 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">ESG Keywords Detected in Document</p>
                <div className="flex flex-wrap gap-1">
                  {result.extracted_info.esg_keywords_found.map((kw) => (
                    <span key={kw} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommended actions */}
          {result && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Recommended Next Steps for Analyst</h2>
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

        {/* RIGHT: Results */}
        {result ? (
          <div className="space-y-5">
            <RiskScoreCard
              score={result.risk_scores.overall}
              riskLevel={result.risk_level}
              confidenceScore={result.confidence_score}
            />
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">PS1–PS8 Risk Profile</h2>
              <p className="text-xs text-gray-400 mb-4">Higher score = greater ESG risk exposure</p>
              <RiskRadarChart scores={result.risk_scores} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Performance Standards Breakdown</h2>
              <PSBreakdownTable breakdown={result.ps_breakdown} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">
                Comparable IFC Projects
                <span className="ml-2 text-xs font-normal text-gray-400">matched by location & sector</span>
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Drawn from internal database of past IFC-financed projects — lessons inform current assessment
              </p>
              <SimilarProjectsTable projects={result.similar_projects} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">Assessment Results Will Appear Here</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Upload a project PDF and click <strong>Run ESG Assessment</strong> to generate a full risk profile with radar chart, PS1–PS8 breakdown, and comparable past projects.
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2 w-full max-w-xs">
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
