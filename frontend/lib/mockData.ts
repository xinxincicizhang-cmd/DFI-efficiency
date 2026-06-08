// All demo data lives here. No backend needed.

export const SAMPLE_PROJECTS = [
  {
    id: "IFC-001",
    project_name: "Lagos Lekki Port Development",
    country: "Nigeria",
    region: "Sub-Saharan Africa",
    sector: "Infrastructure",
    project_type: "Greenfield",
    scale_usd: 750000000,
    environmental_category: "A",
    risk_level: "High",
    risk_score: 78,
    ps_scores: { ps1: 80, ps2: 65, ps3: 75, ps4: 82, ps5: 90, ps6: 72, ps7: 55, ps8: 60 },
    year: 2019,
    status: "Active",
    esg_issues: [
      "Large-scale land acquisition affecting fishing communities",
      "Mangrove ecosystem destruction",
      "Resettlement of 2,400 households",
      "Air and noise pollution during construction",
    ],
    lessons_learned:
      "Early and sustained community engagement reduced resettlement disputes by 40%. Biodiversity offset plan essential for mangrove areas.",
  },
  {
    id: "IFC-002",
    project_name: "Vietnam Wind Power Complex",
    country: "Vietnam",
    region: "East Asia and Pacific",
    sector: "Energy",
    project_type: "Greenfield",
    scale_usd: 320000000,
    environmental_category: "B",
    risk_level: "Medium",
    risk_score: 52,
    ps_scores: { ps1: 55, ps2: 48, ps3: 50, ps4: 58, ps5: 62, ps6: 65, ps7: 30, ps8: 40 },
    year: 2021,
    status: "Active",
    esg_issues: [
      "Bird and bat mortality risk",
      "Visual impact on coastal landscape",
      "Noise pollution in nearby villages",
      "Seasonal fishing restrictions",
    ],
    lessons_learned:
      "Avian impact studies should begin 2 years before construction. Local content requirement of 30% achieved through pre-training programs.",
  },
  {
    id: "IFC-003",
    project_name: "Kenya Smallholder Agriculture Finance",
    country: "Kenya",
    region: "Sub-Saharan Africa",
    sector: "Agriculture",
    project_type: "Expansion",
    scale_usd: 45000000,
    environmental_category: "B",
    risk_level: "Medium",
    risk_score: 44,
    ps_scores: { ps1: 45, ps2: 40, ps3: 55, ps4: 42, ps5: 35, ps6: 50, ps7: 30, ps8: 25 },
    year: 2020,
    status: "Completed",
    esg_issues: [
      "Pesticide use and water contamination risk",
      "Child labor in seasonal harvest",
      "Gender disparity in land titling",
      "Soil degradation from monoculture",
    ],
    lessons_learned:
      "Gender-lens investing improved loan repayment rates. Integrated pest management training reduced chemical use by 60%.",
  },
  {
    id: "IFC-004",
    project_name: "Bangladesh Ready-Made Garments Modernization",
    country: "Bangladesh",
    region: "South Asia",
    sector: "Manufacturing",
    project_type: "Expansion",
    scale_usd: 85000000,
    environmental_category: "B",
    risk_level: "High",
    risk_score: 72,
    ps_scores: { ps1: 70, ps2: 85, ps3: 78, ps4: 65, ps5: 30, ps6: 40, ps7: 20, ps8: 30 },
    year: 2018,
    status: "Completed",
    esg_issues: [
      "Fire safety and building structural integrity",
      "Excessive overtime and wage theft",
      "Wastewater discharge from dyeing facilities",
      "Freedom of association restrictions",
    ],
    lessons_learned:
      "Third-party labor audits quarterly essential. ETP installation mandatory before disbursement.",
  },
  {
    id: "IFC-005",
    project_name: "Colombia Bogota Metro Line 1",
    country: "Colombia",
    region: "Latin America and Caribbean",
    sector: "Infrastructure",
    project_type: "Greenfield",
    scale_usd: 1200000000,
    environmental_category: "A",
    risk_level: "High",
    risk_score: 76,
    ps_scores: { ps1: 78, ps2: 60, ps3: 70, ps4: 80, ps5: 85, ps6: 55, ps7: 75, ps8: 82 },
    year: 2022,
    status: "Active",
    esg_issues: [
      "Indigenous community land in project corridor",
      "Urban resettlement of informal settlements",
      "Archaeological sites along route",
      "Groundwater contamination risk",
    ],
    lessons_learned:
      "Free, prior, informed consent process with indigenous groups took 18 months but prevented legal delays. Archaeological chance find procedures critical.",
  },
  {
    id: "IFC-006",
    project_name: "Egypt Benban Solar Energy Park",
    country: "Egypt",
    region: "Middle East and North Africa",
    sector: "Energy",
    project_type: "Greenfield",
    scale_usd: 280000000,
    environmental_category: "B",
    risk_level: "Medium",
    risk_score: 48,
    ps_scores: { ps1: 50, ps2: 45, ps3: 42, ps4: 52, ps5: 60, ps6: 55, ps7: 20, ps8: 45 },
    year: 2020,
    status: "Active",
    esg_issues: [
      "Land acquisition in Benban solar zone",
      "Water scarcity for panel cleaning",
      "Desert ecosystem disturbance",
      "Migrant worker accommodation standards",
    ],
    lessons_learned:
      "Dry cleaning technology reduced water use by 90%. Shared worker accommodation hub reduced costs and improved compliance.",
  },
  {
    id: "IFC-007",
    project_name: "Indonesia Palm Oil Certification Program",
    country: "Indonesia",
    region: "East Asia and Pacific",
    sector: "Agriculture",
    project_type: "Rehabilitation",
    scale_usd: 120000000,
    environmental_category: "A",
    risk_level: "Very High",
    risk_score: 88,
    ps_scores: { ps1: 85, ps2: 70, ps3: 88, ps4: 80, ps5: 72, ps6: 95, ps7: 82, ps8: 65 },
    year: 2017,
    status: "Completed",
    esg_issues: [
      "Deforestation and peatland burning",
      "Indigenous land rights violations",
      "Orangutan habitat destruction",
      "Haze pollution affecting neighboring countries",
    ],
    lessons_learned:
      "No-deforestation commitment must be verified via satellite monitoring. Grievance mechanism must be accessible to illiterate communities.",
  },
  {
    id: "IFC-008",
    project_name: "Ghana Tema Container Terminal",
    country: "Ghana",
    region: "Sub-Saharan Africa",
    sector: "Infrastructure",
    project_type: "Expansion",
    scale_usd: 180000000,
    environmental_category: "B",
    risk_level: "Medium",
    risk_score: 55,
    ps_scores: { ps1: 58, ps2: 52, ps3: 60, ps4: 55, ps5: 48, ps6: 62, ps7: 25, ps8: 40 },
    year: 2021,
    status: "Active",
    esg_issues: [
      "Marine ecosystem disturbance from dredging",
      "Displacement of artisanal fishing community",
      "Dust pollution from container handling",
      "Oil spill risk",
    ],
    lessons_learned:
      "Marine ecology baseline survey should precede dredging. Compensation framework for fishers must account for multi-year income loss.",
  },
  {
    id: "IFC-009",
    project_name: "Peru Las Bambas Copper Mining Expansion",
    country: "Peru",
    region: "Latin America and Caribbean",
    sector: "Mining",
    project_type: "Expansion",
    scale_usd: 950000000,
    environmental_category: "A",
    risk_level: "Very High",
    risk_score: 91,
    ps_scores: { ps1: 88, ps2: 75, ps3: 92, ps4: 85, ps5: 82, ps6: 90, ps7: 95, ps8: 78 },
    year: 2016,
    status: "Active",
    esg_issues: [
      "Acid mine drainage contaminating Andean watersheds",
      "Indigenous Quechua community protests",
      "Glacial melt acceleration",
      "Tailings dam failure risk",
    ],
    lessons_learned:
      "Social license requires ongoing benefit-sharing agreements. Independent tailings review board essential. Water trust fund for downstream communities.",
  },
  {
    id: "IFC-010",
    project_name: "Rwanda Coffee Value Chain Development",
    country: "Rwanda",
    region: "Sub-Saharan Africa",
    sector: "Agriculture",
    project_type: "Expansion",
    scale_usd: 15000000,
    environmental_category: "C",
    risk_level: "Low",
    risk_score: 22,
    ps_scores: { ps1: 25, ps2: 20, ps3: 30, ps4: 18, ps5: 15, ps6: 28, ps7: 10, ps8: 15 },
    year: 2022,
    status: "Active",
    esg_issues: [
      "Coffee pulp wastewater management",
      "Women's cooperative governance",
    ],
    lessons_learned:
      "Smallholder cooperatives with gender parity outperform on quality metrics. Pulping station biogas recovery viable above 50 ton/day.",
  },
  {
    id: "IFC-011",
    project_name: "India Affordable Housing Finance",
    country: "India",
    region: "South Asia",
    sector: "Financial Services",
    project_type: "Greenfield",
    scale_usd: 200000000,
    environmental_category: "C",
    risk_level: "Low",
    risk_score: 28,
    ps_scores: { ps1: 30, ps2: 25, ps3: 20, ps4: 32, ps5: 22, ps6: 18, ps7: 15, ps8: 20 },
    year: 2021,
    status: "Active",
    esg_issues: [
      "Responsible lending practices",
      "Over-indebtedness risk for low-income borrowers",
    ],
    lessons_learned:
      "Client protection assessment must precede disbursement. Financial literacy programs improve repayment rates and reduce distress.",
  },
  {
    id: "IFC-012",
    project_name: "Mozambique Rovuma LNG Pipeline",
    country: "Mozambique",
    region: "Sub-Saharan Africa",
    sector: "Energy",
    project_type: "Greenfield",
    scale_usd: 2100000000,
    environmental_category: "A",
    risk_level: "Very High",
    risk_score: 85,
    ps_scores: { ps1: 82, ps2: 70, ps3: 80, ps4: 88, ps5: 92, ps6: 78, ps7: 85, ps8: 70 },
    year: 2019,
    status: "Active",
    esg_issues: [
      "Displacement of coastal fishing communities",
      "Security forces human rights concerns",
      "Marine mammal disruption from seismic surveys",
      "Conflict-affected area operations",
    ],
    lessons_learned:
      "Human rights due diligence for security arrangements critical in conflict-affected areas. Community development agreements must be legally binding.",
  },
  {
    id: "IFC-013",
    project_name: "Philippines Leyte Geothermal Power",
    country: "Philippines",
    region: "East Asia and Pacific",
    sector: "Energy",
    project_type: "Expansion",
    scale_usd: 165000000,
    environmental_category: "B",
    risk_level: "Medium",
    risk_score: 57,
    ps_scores: { ps1: 58, ps2: 50, ps3: 55, ps4: 60, ps5: 52, ps6: 65, ps7: 68, ps8: 55 },
    year: 2020,
    status: "Active",
    esg_issues: [
      "Indigenous IP community lands within project area",
      "Hydrogen sulfide emissions",
      "Seismic activity risk",
      "Watershed protection",
    ],
    lessons_learned:
      "FPIC with IP communities mandatory. H2S monitoring stations in downwind communities required.",
  },
  {
    id: "IFC-014",
    project_name: "Ethiopia Hawassa Industrial Zone",
    country: "Ethiopia",
    region: "Sub-Saharan Africa",
    sector: "Manufacturing",
    project_type: "Greenfield",
    scale_usd: 420000000,
    environmental_category: "A",
    risk_level: "High",
    risk_score: 74,
    ps_scores: { ps1: 75, ps2: 80, ps3: 72, ps4: 70, ps5: 78, ps6: 60, ps7: 45, ps8: 55 },
    year: 2018,
    status: "Active",
    esg_issues: [
      "Mass land acquisition for zone",
      "Labor rights in export processing zone",
      "Industrial wastewater treatment",
      "Forced resettlement concerns",
    ],
    lessons_learned:
      "EPZ labor exemptions create reputational risk. Collective bargaining must be explicitly protected. Centralized ETP reduces compliance costs.",
  },
  {
    id: "IFC-015",
    project_name: "Morocco OCP Phosphate Mining Upgrade",
    country: "Morocco",
    region: "Middle East and North Africa",
    sector: "Mining",
    project_type: "Rehabilitation",
    scale_usd: 380000000,
    environmental_category: "B",
    risk_level: "Medium",
    risk_score: 58,
    ps_scores: { ps1: 60, ps2: 55, ps3: 65, ps4: 58, ps5: 45, ps6: 62, ps7: 30, ps8: 50 },
    year: 2019,
    status: "Active",
    esg_issues: [
      "Fluoride dust from processing",
      "Phosphogypsum waste management",
      "Water scarcity in arid region",
      "Coastal ecosystem impacts from slurry pipeline",
    ],
    lessons_learned:
      "Phosphogypsum stack monitoring essential. Desalination for process water reduces aquifer pressure.",
  },
  {
    id: "IFC-016",
    project_name: "Cambodia PRASAC Microfinance Expansion",
    country: "Cambodia",
    region: "East Asia and Pacific",
    sector: "Financial Services",
    project_type: "Expansion",
    scale_usd: 60000000,
    environmental_category: "C",
    risk_level: "Medium",
    risk_score: 42,
    ps_scores: { ps1: 45, ps2: 38, ps3: 20, ps4: 48, ps5: 30, ps6: 22, ps7: 35, ps8: 25 },
    year: 2020,
    status: "Active",
    esg_issues: [
      "Land-secured lending and over-indebtedness",
      "Aggressive collection practices",
      "Multiple borrowing risk",
      "Consumer data protection",
    ],
    lessons_learned:
      "Land collateral prohibition for small loans essential. Digital credit bureau integration reduces over-indebtedness.",
  },
  {
    id: "IFC-017",
    project_name: "Tanzania Central Corridor Road Rehabilitation",
    country: "Tanzania",
    region: "Sub-Saharan Africa",
    sector: "Infrastructure",
    project_type: "Rehabilitation",
    scale_usd: 95000000,
    environmental_category: "B",
    risk_level: "Medium",
    risk_score: 46,
    ps_scores: { ps1: 48, ps2: 42, ps3: 45, ps4: 50, ps5: 55, ps6: 48, ps7: 38, ps8: 40 },
    year: 2021,
    status: "Active",
    esg_issues: [
      "Road safety and induced traffic fatalities",
      "Strip resettlement along road corridor",
      "Wildlife migration barrier",
      "Increased poaching access",
    ],
    lessons_learned:
      "Road safety audit and speed enforcement plan must accompany road projects. Wildlife crossing structures cost-effective at <2% of project cost.",
  },
  {
    id: "IFC-018",
    project_name: "Brazil AMAGGI Soy Supply Chain Finance",
    country: "Brazil",
    region: "Latin America and Caribbean",
    sector: "Agriculture",
    project_type: "Expansion",
    scale_usd: 500000000,
    environmental_category: "A",
    risk_level: "Very High",
    risk_score: 86,
    ps_scores: { ps1: 82, ps2: 68, ps3: 80, ps4: 75, ps5: 70, ps6: 92, ps7: 88, ps8: 65 },
    year: 2018,
    status: "Completed",
    esg_issues: [
      "Cerrado and Amazon deforestation link",
      "Indigenous land invasion",
      "Slave labor in supply chain",
      "Soy moratorium compliance",
    ],
    lessons_learned:
      "Supply chain traceability to farm level essential. Satellite monitoring of supplier farms must be contractual condition.",
  },
  {
    id: "IFC-019",
    project_name: "Zambia Konkola Copper Smelter Modernization",
    country: "Zambia",
    region: "Sub-Saharan Africa",
    sector: "Mining",
    project_type: "Rehabilitation",
    scale_usd: 240000000,
    environmental_category: "A",
    risk_level: "High",
    risk_score: 79,
    ps_scores: { ps1: 78, ps2: 72, ps3: 88, ps4: 75, ps5: 55, ps6: 68, ps7: 40, ps8: 52 },
    year: 2017,
    status: "Completed",
    esg_issues: [
      "SO2 emissions affecting Copperbelt towns",
      "Lead contamination in community soils",
      "Occupational health in smelting",
      "Slag heap leachate",
    ],
    lessons_learned:
      "Ambient SO2 monitoring network with public disclosure builds trust. Blood lead level surveillance for children within 5km mandatory.",
  },
  {
    id: "IFC-020",
    project_name: "Senegal Dakar-Diamniadio Toll Highway",
    country: "Senegal",
    region: "Sub-Saharan Africa",
    sector: "Infrastructure",
    project_type: "Greenfield",
    scale_usd: 590000000,
    environmental_category: "A",
    risk_level: "High",
    risk_score: 73,
    ps_scores: { ps1: 75, ps2: 60, ps3: 68, ps4: 78, ps5: 82, ps6: 65, ps7: 60, ps8: 70 },
    year: 2019,
    status: "Active",
    esg_issues: [
      "Resettlement of 30,000 peri-urban residents",
      "Sacred grove destruction",
      "Barrier effect dividing communities",
      "Non-motorized transport exclusion",
    ],
    lessons_learned:
      "Resettlement action plan implementation requires dedicated project unit. Cultural heritage screening must include intangible heritage.",
  },
];

// Mock assessment result for the demo upload flow
export const DEMO_ASSESSMENT_RESULT = {
  assessment_id: "ASSESS-2024-0047",
  filename: "uploaded_report.pdf",
  extracted_info: {
    project_name: "Uganda Karuma Hydropower Dam",
    location: "Karuma, Nile River Basin",
    country: "Uganda",
    region: "Sub-Saharan Africa",
    sector: "Energy",
    project_type: "Greenfield",
    scale_usd: 1680000000,
    environmental_category: "A",
    esg_keywords_found: [
      "resettlement", "biodiversity", "indigenous communities", "dam safety",
      "hydropower", "involuntary displacement", "ESIA", "cumulative impact",
      "transboundary water", "fisheries", "cultural heritage",
    ],
  },
  risk_scores: {
    overall: 81,
    ps1_social: 85,
    ps2_labor: 62,
    ps3_pollution: 58,
    ps4_community: 80,
    ps5_land: 88,
    ps6_biodiversity: 78,
    ps7_indigenous: 72,
    ps8_cultural: 75,
  },
  risk_level: "High",
  ps_breakdown: [
    {
      standard: "PS1",
      name: "Assessment & Management of E&S Risks",
      score: 85,
      key_factors: [
        "Category A project — full ESIA mandatory",
        "Transboundary Nile Basin impacts require regional assessment",
        "Cumulative impacts with existing Bujagali Dam not fully addressed",
      ],
    },
    {
      standard: "PS2",
      name: "Labor & Working Conditions",
      score: 62,
      key_factors: [
        "~3,000 construction workers from multiple countries",
        "Chinese EPC contractor — labor standard alignment needed",
        "Occupational health risks in tunneling and blasting",
      ],
    },
    {
      standard: "PS3",
      name: "Resource Efficiency & Pollution Prevention",
      score: 58,
      key_factors: [
        "Construction runoff into Nile requires management plan",
        "Concrete batching plant waste disposal",
        "Downstream water quality impacts from altered flow regime",
      ],
    },
    {
      standard: "PS4",
      name: "Community Health, Safety & Security",
      score: 80,
      key_factors: [
        "Dam break scenario affects 2M+ downstream population",
        "Emergency preparedness plan required",
        "Security force conduct — armed forces deployed on site",
        "Increased disease vectors from reservoir",
      ],
    },
    {
      standard: "PS5",
      name: "Land Acquisition & Involuntary Resettlement",
      score: 88,
      key_factors: [
        "Estimated 3,800 households displaced — primarily subsistence farmers",
        "Reservoir inundation of 700+ km² of agricultural and forest land",
        "Livelihood restoration for fishing communities critical",
        "Resettlement sites lack equivalent agricultural land quality",
      ],
    },
    {
      standard: "PS6",
      name: "Biodiversity Conservation",
      score: 78,
      key_factors: [
        "Nile River endemic fish species (Nile tilapia, Nile perch) affected",
        "Riparian forest along Nile inundated",
        "Fish ladder feasibility questioned by independent experts",
        "Murchison Falls National Park proximity",
      ],
    },
    {
      standard: "PS7",
      name: "Indigenous Peoples",
      score: 72,
      key_factors: [
        "Banyoro indigenous fishing communities along project corridor",
        "FPIC process incomplete at time of assessment",
        "Traditional fishing rights along 200km river stretch affected",
      ],
    },
    {
      standard: "PS8",
      name: "Cultural Heritage",
      score: 75,
      key_factors: [
        "Karuma Falls sacred site to Acholi and Lango communities",
        "Archaeological survey incomplete — Bronze Age sites possible",
        "Chance find procedures need strengthening in EPC contract",
      ],
    },
  ],
  similar_projects: [
    {
      id: "IFC-001",
      project_name: "Lagos Lekki Port Development",
      country: "Nigeria",
      sector: "Infrastructure",
      project_type: "Greenfield",
      risk_level: "High",
      risk_score: 78,
      similarity_score: 74,
      year: 2019,
      lessons_learned:
        "Early and sustained community engagement reduced resettlement disputes by 40%. Biodiversity offset plan essential for mangrove areas.",
    },
    {
      id: "IFC-020",
      project_name: "Senegal Dakar-Diamniadio Toll Highway",
      country: "Senegal",
      sector: "Infrastructure",
      project_type: "Greenfield",
      risk_level: "High",
      risk_score: 73,
      similarity_score: 68,
      year: 2019,
      lessons_learned:
        "Resettlement action plan implementation requires dedicated project unit. Cultural heritage screening must include intangible heritage.",
    },
    {
      id: "IFC-012",
      project_name: "Mozambique Rovuma LNG Pipeline",
      country: "Mozambique",
      sector: "Energy",
      project_type: "Greenfield",
      risk_level: "Very High",
      risk_score: 85,
      similarity_score: 61,
      year: 2019,
      lessons_learned:
        "Human rights due diligence for security arrangements critical in conflict-affected areas. Community development agreements must be legally binding.",
    },
    {
      id: "IFC-005",
      project_name: "Colombia Bogota Metro Line 1",
      country: "Colombia",
      sector: "Infrastructure",
      project_type: "Greenfield",
      risk_level: "High",
      risk_score: 76,
      similarity_score: 55,
      year: 2022,
      lessons_learned:
        "Free, prior, informed consent process with indigenous groups took 18 months but prevented legal delays. Archaeological chance find procedures critical.",
    },
  ],
  recommended_actions: [
    "Commission independent dam safety review per ICOLD guidelines before disbursement",
    "Verify FPIC process completion with Banyoro and Acholi communities — current documentation insufficient",
    "Require independent resettlement monitoring agency with public quarterly reporting",
    "Conduct transboundary Nile Basin impact assessment in coordination with NELSAP",
    "Strengthen EPC contract to include IFC PS labor clauses with quarterly third-party audits",
    "Commission fish passage feasibility study with independent ichthyologist panel",
    "Establish grievance redress mechanism accessible at resettlement sites before construction begins",
  ],
  confidence_score: 78,
};

// Monitoring data per project (keyed by project id)
export function getMonitoringData(projectId: string) {
  const project = SAMPLE_PROJECTS.find((p) => p.id === projectId) || SAMPLE_PROJECTS[0];

  // Generate 24 months of plausible climate data based on country/region
  const isArid = ["Egypt", "Morocco"].includes(project.country);
  const isTropical = ["Nigeria", "Ghana", "Mozambique", "Uganda", "Indonesia", "Philippines", "Vietnam"].includes(project.country);
  const baseTemp = isArid ? 28 : isTropical ? 26 : 20;
  const basePrecip = isArid ? 8 : isTropical ? 140 : 60;
  const baseNdvi = isArid ? 0.12 : isTropical ? 0.72 : 0.48;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const temperature_monthly = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 23 + i, 1);
    const month = d.getMonth();
    const seasonal = Math.sin((month / 12) * Math.PI * 2) * (isTropical ? 3 : 8);
    const trend = i * 0.04; // slight warming trend
    const noise = (Math.random() - 0.5) * 1.5;
    return { date: months[month], value: parseFloat((baseTemp + seasonal + trend + noise).toFixed(1)) };
  });

  const precipitation_monthly = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 23 + i, 1);
    const month = d.getMonth();
    const seasonal = isTropical
      ? Math.max(0, Math.sin(((month - 3) / 12) * Math.PI * 2) * 160)
      : Math.max(0, Math.sin((month / 12) * Math.PI * 2) * 50);
    const noise = Math.random() * 30;
    return { date: months[month], value: parseFloat((basePrecip + seasonal + noise).toFixed(0)) };
  });

  const ndvi_monthly = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 23 + i, 1);
    const month = d.getMonth();
    const seasonal = Math.sin(((month - 2) / 12) * Math.PI * 2) * 0.12;
    // Simulate vegetation stress in later months (construction impact)
    const constructionImpact = i > 18 ? -0.05 : 0;
    const noise = (Math.random() - 0.5) * 0.03;
    return { date: months[month], value: parseFloat(Math.max(0, baseNdvi + seasonal + constructionImpact + noise).toFixed(3)) };
  });

  const aqi_monthly = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 23 + i, 1);
    const month = d.getMonth();
    const base = project.sector === "Mining" ? 95 : project.sector === "Manufacturing" ? 80 : 45;
    const noise = (Math.random() - 0.5) * 20;
    return { date: months[month], value: Math.max(10, parseFloat((base + noise).toFixed(0))) };
  });

  const esg_incidents = [
    {
      id: "INC-001",
      date: "2024-10-14",
      type: "Labor",
      severity: "Medium",
      description: "Worker overtime violation reported at construction camp — 14-hour shifts observed during peak earthworks period.",
      status: "In Progress",
    },
    {
      id: "INC-002",
      date: "2024-08-22",
      type: "Community",
      severity: "High",
      description: "Community protest at project gate over delayed compensation payments for 45 households in Phase 2 resettlement.",
      status: "Open",
    },
    {
      id: "INC-003",
      date: "2024-06-05",
      type: "Environment",
      severity: "Medium",
      description: "Turbid discharge observed in creek adjacent to site — construction runoff management plan not fully implemented.",
      status: "Resolved",
    },
    {
      id: "INC-004",
      date: "2024-03-18",
      type: "Safety",
      severity: "High",
      description: "One worker fatality and two injuries in scaffolding collapse. OSHA-equivalent investigation initiated.",
      status: "Resolved",
    },
    {
      id: "INC-005",
      date: "2023-11-30",
      type: "Land",
      severity: "Low",
      description: "Minor encroachment on project boundary by adjacent landowner — resolved through grievance mechanism.",
      status: "Resolved",
    },
  ];

  const alerts = project.risk_score >= 75 ? [
    {
      id: "ALT-001",
      type: "NDVI Decline",
      severity: "Medium",
      message: "Vegetation index dropped 8.3% over last 3 months — potential deforestation or construction clearing in buffer zone.",
      created_at: new Date().toISOString(),
    },
    {
      id: "ALT-002",
      type: "Community Grievance",
      severity: "High",
      message: "2 unresolved grievances outstanding >30 days — escalation required per project ESMP.",
      created_at: new Date().toISOString(),
    },
  ] : project.risk_score >= 50 ? [
    {
      id: "ALT-001",
      type: "Precipitation Anomaly",
      severity: "Low",
      message: "October precipitation 42% below 10-year average — drought stress risk for project area.",
      created_at: new Date().toISOString(),
    },
  ] : [];

  return {
    project_id: project.id,
    project_name: project.project_name,
    country: project.country,
    sector: project.sector,
    monitoring_status: "Active",
    last_updated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    climate_data: { temperature_monthly, precipitation_monthly, ndvi_monthly, aqi_monthly },
    climate_risk: {
      flood_risk: isTropical ? "High" : isArid ? "Low" : "Medium",
      drought_risk: isArid ? "High" : isTropical ? "Low" : "Medium",
      extreme_heat_days_per_year: isArid ? 62 : isTropical ? 18 : 8,
      sea_level_rise_exposure: ["Nigeria", "Vietnam", "Philippines", "Bangladesh", "Mozambique", "Senegal"].includes(project.country) ? "High" : "None",
      cyclone_risk: ["Philippines", "Vietnam", "Bangladesh", "Mozambique"].includes(project.country) ? "High" : "None",
    },
    esg_incidents,
    alerts,
  };
}
