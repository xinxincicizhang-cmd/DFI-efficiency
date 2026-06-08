import json
import uuid
from fastapi import APIRouter, Query, UploadFile, File, HTTPException
from typing import Optional, List, Dict, Any

from services.database import get_all_projects, get_project_by_id, insert_project

router = APIRouter()


@router.get("")
async def list_projects(
    country: Optional[str] = Query(None),
    sector: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
) -> List[Dict[str, Any]]:
    """Return all IFC projects with optional filtering."""
    return get_all_projects(country=country, sector=sector, risk_level=risk_level)


@router.get("/filters")
async def get_filter_options() -> Dict[str, List[str]]:
    """Return distinct filter values."""
    all_projects = get_all_projects()
    countries = sorted(set(p["country"] for p in all_projects if p.get("country")))
    sectors = sorted(set(p["sector"] for p in all_projects if p.get("sector")))
    risk_levels = ["Low", "Medium", "High", "Very High"]
    return {"countries": countries, "sectors": sectors, "risk_levels": risk_levels}


@router.get("/{project_id}")
async def get_project(project_id: str) -> Dict[str, Any]:
    """Return a single project by ID."""
    project = get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/import")
async def import_projects(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Import projects from a JSON file."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()
    try:
        projects = json.loads(content)
        if not isinstance(projects, list):
            raise ValueError("Expected a JSON array")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON: {str(e)}")

    imported = 0
    failed = 0
    for p in projects:
        if not p.get("id"):
            p["id"] = f"IMP-{str(uuid.uuid4())[:8].upper()}"
        success = insert_project(p)
        if success:
            imported += 1
        else:
            failed += 1

    return {"imported": imported, "failed": failed, "total": len(projects)}
