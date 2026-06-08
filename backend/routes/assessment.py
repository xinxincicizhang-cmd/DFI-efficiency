import io
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any

from services.pdf_parser import parse_pdf
from services.similarity_engine import find_similar_projects
from services.risk_scorer import compute_risk_scores, generate_recommended_actions, get_ps_descriptions

router = APIRouter()


@router.post("/upload")
async def upload_assessment(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Accept a PDF file upload and return a full ESG assessment result.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    # Step 1: Parse PDF to extract project metadata
    extracted = parse_pdf(file_bytes, file.filename)

    # Step 2: Find similar IFC projects
    similar_projects = find_similar_projects(
        {
            "country": extracted["country"],
            "region": extracted["region"],
            "sector": extracted["sector"],
            "project_type": extracted["project_type"],
        },
        top_n=5,
    )

    # Step 3: Score ESG risk
    risk_scores = compute_risk_scores(
        sector=extracted["sector"],
        project_type=extracted["project_type"],
        env_category=extracted["environmental_category"],
        esg_keywords=extracted.get("esg_keywords", []),
        similar_projects=similar_projects,
    )

    # Step 4: Generate recommended actions
    recommended_actions = generate_recommended_actions(
        risk_scores=risk_scores,
        sector=extracted["sector"],
        esg_keywords=extracted.get("esg_keywords", []),
        similar_projects=similar_projects,
    )

    ps_descriptions = get_ps_descriptions()

    # Build PS breakdown
    ps_breakdown = []
    ps_map = [
        ("ps1", "ps1_social", "PS1"),
        ("ps2", "ps2_labor", "PS2"),
        ("ps3", "ps3_pollution", "PS3"),
        ("ps4", "ps4_community", "PS4"),
        ("ps5", "ps5_land", "PS5"),
        ("ps6", "ps6_biodiversity", "PS6"),
        ("ps7", "ps7_indigenous", "PS7"),
        ("ps8", "ps8_cultural", "PS8"),
    ]
    for ps_key, score_key, label in ps_map:
        ps_breakdown.append({
            "standard": label,
            "name": ps_descriptions.get(ps_key, ""),
            "score": risk_scores.get(score_key, 0),
            "key_factors": _get_key_factors(ps_key, extracted.get("esg_keywords", []), extracted["sector"]),
        })

    # Compile similar projects for response
    similar_projects_response = []
    for sp in similar_projects:
        similar_projects_response.append({
            "id": sp.get("id"),
            "project_name": sp.get("project_name"),
            "country": sp.get("country"),
            "sector": sp.get("sector"),
            "project_type": sp.get("project_type"),
            "risk_level": sp.get("risk_level"),
            "risk_score": sp.get("risk_score"),
            "similarity_score": sp.get("similarity_score"),
            "lessons_learned": sp.get("lessons_learned"),
            "year": sp.get("year"),
        })

    return {
        "assessment_id": str(uuid.uuid4()),
        "filename": file.filename,
        "extracted_info": {
            "project_name": extracted["project_name"],
            "location": extracted["location"],
            "country": extracted["country"],
            "region": extracted["region"],
            "sector": extracted["sector"],
            "project_type": extracted["project_type"],
            "scale_usd": extracted.get("scale_usd"),
            "environmental_category": extracted["environmental_category"],
            "esg_keywords_found": extracted.get("esg_keywords", []),
        },
        "risk_scores": {
            "overall": risk_scores["overall"],
            "ps1_social": risk_scores["ps1_social"],
            "ps2_labor": risk_scores["ps2_labor"],
            "ps3_pollution": risk_scores["ps3_pollution"],
            "ps4_community": risk_scores["ps4_community"],
            "ps5_land": risk_scores["ps5_land"],
            "ps6_biodiversity": risk_scores["ps6_biodiversity"],
            "ps7_indigenous": risk_scores["ps7_indigenous"],
            "ps8_cultural": risk_scores["ps8_cultural"],
        },
        "risk_level": risk_scores["risk_level"],
        "ps_breakdown": ps_breakdown,
        "similar_projects": similar_projects_response,
        "recommended_actions": recommended_actions,
        "confidence_score": extracted.get("confidence", 50),
    }


def _get_key_factors(ps_key: str, esg_keywords: list, sector: str) -> list:
    from services.risk_scorer import KEYWORD_BOOSTERS
    boosters = KEYWORD_BOOSTERS.get(ps_key, [])
    matched = [kw for kw in boosters if any(kw in ek.lower() for ek in esg_keywords)]
    if not matched:
        # Return sector-specific default factors
        sector_defaults = {
            "ps1": [f"{sector} sector: standard ESMS required"],
            "ps2": ["Standard labor protections apply"],
            "ps3": ["Sector pollution profile assessed"],
            "ps4": ["Community proximity analysis needed"],
            "ps5": ["Land access requirements to be confirmed"],
            "ps6": ["Biodiversity baseline required"],
            "ps7": ["Indigenous peoples screening needed"],
            "ps8": ["Cultural heritage screening needed"],
        }
        return sector_defaults.get(ps_key, ["Review required"])
    return matched
