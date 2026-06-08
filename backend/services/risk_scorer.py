from typing import Dict, Any, List, Tuple


# Base risk by sector for each PS
SECTOR_BASE_RISK = {
    "Mining": {
        "ps1": 80, "ps2": 70, "ps3": 85, "ps4": 75,
        "ps5": 80, "ps6": 85, "ps7": 75, "ps8": 65
    },
    "Energy": {
        "ps1": 55, "ps2": 45, "ps3": 45, "ps4": 55,
        "ps5": 65, "ps6": 60, "ps7": 50, "ps8": 40
    },
    "Infrastructure": {
        "ps1": 65, "ps2": 55, "ps3": 55, "ps4": 65,
        "ps5": 75, "ps6": 60, "ps7": 45, "ps8": 55
    },
    "Agriculture": {
        "ps1": 50, "ps2": 55, "ps3": 60, "ps4": 48,
        "ps5": 55, "ps6": 60, "ps7": 45, "ps8": 25
    },
    "Manufacturing": {
        "ps1": 60, "ps2": 70, "ps3": 75, "ps4": 58,
        "ps5": 35, "ps6": 30, "ps7": 20, "ps8": 25
    },
    "Financial Services": {
        "ps1": 20, "ps2": 25, "ps3": 10, "ps4": 18,
        "ps5": 10, "ps6": 5, "ps7": 5, "ps8": 5
    },
    "Healthcare": {
        "ps1": 28, "ps2": 32, "ps3": 38, "ps4": 25,
        "ps5": 15, "ps6": 10, "ps7": 10, "ps8": 15
    },
    "Water & Sanitation": {
        "ps1": 42, "ps2": 35, "ps3": 50, "ps4": 40,
        "ps5": 38, "ps6": 48, "ps7": 20, "ps8": 22
    },
    "Real Estate": {
        "ps1": 40, "ps2": 35, "ps3": 30, "ps4": 38,
        "ps5": 50, "ps6": 25, "ps7": 20, "ps8": 30
    },
}

DEFAULT_SECTOR_RISK = {
    "ps1": 50, "ps2": 45, "ps3": 45, "ps4": 45,
    "ps5": 40, "ps6": 40, "ps7": 30, "ps8": 30
}

# Project type modifiers
PROJECT_TYPE_MODIFIERS = {
    "Greenfield": 1.1,
    "Expansion": 1.0,
    "Rehabilitation": 0.85,
    "Acquisition": 0.9,
}

# Environmental category multipliers
ENV_CATEGORY_MULTIPLIER = {
    "A": 1.25,
    "B": 1.0,
    "C": 0.5,
}

# Keyword risk boosters per PS
KEYWORD_BOOSTERS = {
    "ps1": ["resettlement", "displacement", "community", "grievance", "consultation", "gender"],
    "ps2": ["labor rights", "child labor", "forced labor", "occupational health", "worker safety", "union"],
    "ps3": ["pollution", "contamination", "emissions", "wastewater", "hazardous waste", "toxic", "effluent", "acid drainage"],
    "ps4": ["community health", "malaria", "hiv", "disease", "infrastructure safety", "security"],
    "ps5": ["land acquisition", "resettlement", "displacement", "land rights", "eminent domain"],
    "ps6": ["deforestation", "biodiversity", "endangered species", "habitat", "protected area", "wetland", "peat", "coral"],
    "ps7": ["indigenous", "tribal", "fpic", "traditional community", "native"],
    "ps8": ["cultural heritage", "archaeological", "historic site", "sacred", "tangible heritage"],
}

PS_DESCRIPTIONS = {
    "ps1": "Assessment and Management of Environmental and Social Risks and Impacts",
    "ps2": "Labor and Working Conditions",
    "ps3": "Resource Efficiency and Pollution Prevention",
    "ps4": "Community Health, Safety, and Security",
    "ps5": "Land Acquisition and Involuntary Resettlement",
    "ps6": "Biodiversity Conservation and Sustainable Management of Living Natural Resources",
    "ps7": "Indigenous Peoples",
    "ps8": "Cultural Heritage",
}

PS_WEIGHTS = {
    "ps1": 0.20,
    "ps2": 0.12,
    "ps3": 0.15,
    "ps4": 0.12,
    "ps5": 0.15,
    "ps6": 0.12,
    "ps7": 0.08,
    "ps8": 0.06,
}


def _clamp(value: float, min_val: float = 0, max_val: float = 100) -> float:
    return max(min_val, min(max_val, value))


def score_ps(
    ps_key: str,
    base_score: float,
    esg_keywords: List[str],
    env_category: str,
    project_type: str,
) -> float:
    score = base_score

    # Apply project type modifier
    type_mod = PROJECT_TYPE_MODIFIERS.get(project_type, 1.0)
    score *= type_mod

    # Apply keyword boosters
    booster_keywords = KEYWORD_BOOSTERS.get(ps_key, [])
    keyword_hits = sum(1 for kw in booster_keywords if any(kw in ek.lower() for ek in esg_keywords))
    score += keyword_hits * 5

    # Apply environmental category
    env_mult = ENV_CATEGORY_MULTIPLIER.get(env_category, 1.0)
    score *= env_mult

    return _clamp(score)


def compute_risk_scores(
    sector: str,
    project_type: str,
    env_category: str,
    esg_keywords: List[str],
    similar_projects: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Compute PS1-PS8 scores and overall risk score."""

    base_risks = SECTOR_BASE_RISK.get(sector, DEFAULT_SECTOR_RISK)

    # If we have similar projects, blend their historical scores in
    if similar_projects:
        blended_base = {}
        total_weight = 0.0
        for sp in similar_projects:
            sim = sp.get("similarity_score", 0) / 100.0
            if sim > 0 and "ps_scores" in sp and sp["ps_scores"]:
                ps = sp["ps_scores"]
                for key in ["ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8"]:
                    blended_base[key] = blended_base.get(key, 0) + ps.get(key, base_risks[key]) * sim
                total_weight += sim
        if total_weight > 0:
            for key in blended_base:
                blended_base[key] /= total_weight
            # Blend 50% historical, 50% sector default
            for key in ["ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8"]:
                base_risks[key] = 0.5 * base_risks[key] + 0.5 * blended_base.get(key, base_risks[key])

    ps_scores = {}
    for ps_key in ["ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8"]:
        ps_scores[ps_key] = round(score_ps(
            ps_key,
            base_risks[ps_key],
            esg_keywords,
            env_category,
            project_type,
        ), 1)

    # Compute weighted overall score
    overall = sum(ps_scores[k] * PS_WEIGHTS[k] for k in PS_WEIGHTS)
    overall = round(_clamp(overall), 1)

    # Determine risk level
    if overall < 30:
        risk_level = "Low"
    elif overall < 60:
        risk_level = "Medium"
    elif overall < 75:
        risk_level = "High"
    else:
        risk_level = "Very High"

    return {
        "overall": overall,
        "ps1_social": ps_scores["ps1"],
        "ps2_labor": ps_scores["ps2"],
        "ps3_pollution": ps_scores["ps3"],
        "ps4_community": ps_scores["ps4"],
        "ps5_land": ps_scores["ps5"],
        "ps6_biodiversity": ps_scores["ps6"],
        "ps7_indigenous": ps_scores["ps7"],
        "ps8_cultural": ps_scores["ps8"],
        "risk_level": risk_level,
    }


def generate_recommended_actions(
    risk_scores: Dict[str, Any],
    sector: str,
    esg_keywords: List[str],
    similar_projects: List[Dict[str, Any]],
) -> List[str]:
    actions = []
    risk_level = risk_scores.get("risk_level", "Medium")

    if risk_level in ("High", "Very High"):
        actions.append("Commission a full Environmental and Social Impact Assessment (ESIA) prior to financial close.")

    if risk_scores.get("ps1_social", 0) > 60:
        actions.append("Develop a comprehensive Environmental and Social Management Plan (ESMP) with clear KPIs and timelines.")
    else:
        actions.append("Prepare an Environmental and Social Management Plan (ESMP) proportional to identified risks.")

    if risk_scores.get("ps5_land", 0) > 50:
        actions.append("Prepare a Resettlement Action Plan (RAP) compliant with IFC PS5 before any land clearing.")

    if risk_scores.get("ps7_indigenous", 0) > 40:
        actions.append("Initiate Free, Prior and Informed Consent (FPIC) process with affected indigenous communities.")

    if risk_scores.get("ps6_biodiversity", 0) > 55:
        actions.append("Conduct a Biodiversity Assessment including High Conservation Value (HCV) and High Carbon Stock (HCS) screening.")

    if risk_scores.get("ps3_pollution", 0) > 60:
        actions.append("Prepare a Pollution Prevention and Abatement Plan aligned with IFC EHS Guidelines for the sector.")

    if risk_scores.get("ps2_labor", 0) > 55:
        actions.append("Establish a Labour Management Procedure covering contractor and supply chain workers.")

    if risk_scores.get("ps4_community", 0) > 55:
        actions.append("Develop a Community Health, Safety and Security (CHSS) Plan.")

    if risk_scores.get("ps8_cultural", 0) > 40:
        actions.append("Commission a Physical Cultural Resources (PCR) survey and establish a Chance Find Procedure.")

    if "indigenous" in esg_keywords or "tribal" in esg_keywords:
        actions.append("Engage qualified social specialist with experience in indigenous peoples consultation.")

    # General actions based on sector
    if sector == "Mining":
        actions.append("Prepare a Mine Closure Plan and financial assurance mechanism (e.g., closure bond).")
    elif sector == "Energy" and "hydro" in str(esg_keywords).lower():
        actions.append("Engage an Independent Panel of Experts (IPoE) for dam safety and social/environmental review.")
    elif sector == "Agriculture":
        actions.append("Implement No Deforestation, No Peat, No Exploitation (NDPE) policy for supply chain.")

    # Add lessons from similar projects
    if similar_projects:
        top_sim = similar_projects[0]
        if top_sim.get("lessons_learned"):
            actions.append(f"Key lesson from similar project ({top_sim['project_name']}): {top_sim['lessons_learned']}")

    # Always include grievance mechanism
    actions.append("Establish a project-level Grievance Redress Mechanism (GRM) accessible to all affected communities.")

    return actions[:8]  # cap at 8 actions


def get_ps_descriptions() -> Dict[str, str]:
    return PS_DESCRIPTIONS
