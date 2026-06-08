import random
import math
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from services.database import get_project_by_id

router = APIRouter()


def _generate_time_series(
    base_value: float,
    variance: float,
    periods: int,
    trend: float = 0.0,
    start_date: datetime = None,
) -> List[Dict[str, Any]]:
    """Generate mock time series data."""
    if start_date is None:
        start_date = datetime.now() - timedelta(days=periods * 30)
    data = []
    value = base_value
    for i in range(periods):
        date = start_date + timedelta(days=i * 30)
        noise = random.gauss(0, variance)
        value = base_value + trend * i + noise
        data.append({
            "date": date.strftime("%Y-%m"),
            "value": round(value, 2),
        })
    return data


def _generate_incidents() -> List[Dict[str, Any]]:
    incident_types = [
        ("Community complaint", "Low", "Noise levels during night construction reported by residents."),
        ("Environmental observation", "Medium", "Turbid water observed downstream from construction site."),
        ("Labor incident", "Low", "Minor injury reported - worker treated on-site."),
        ("Environmental alert", "High", "Elevated dust levels detected near school during dry season."),
        ("Community", "Low", "Stakeholder meeting requested by village leader regarding land boundaries."),
        ("Safety", "Medium", "Near-miss incident: equipment malfunction during peak operations."),
    ]
    incidents = []
    for i, (itype, severity, description) in enumerate(incident_types):
        date = datetime.now() - timedelta(days=random.randint(5, 180))
        incidents.append({
            "id": f"INC-{i+1:04d}",
            "date": date.strftime("%Y-%m-%d"),
            "type": itype,
            "severity": severity,
            "description": description,
            "status": random.choice(["Open", "In Progress", "Resolved"]),
        })
    incidents.sort(key=lambda x: x["date"], reverse=True)
    return incidents


@router.get("/{project_id}")
async def get_monitoring_data(project_id: str) -> Dict[str, Any]:
    """
    Return monitoring data for a project.
    Currently returns mock satellite/climate data as a stub.
    """
    project = get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    random.seed(hash(project_id) % 10000)

    # Mock temperature data (monthly averages over 24 months)
    base_temp = random.uniform(18, 32)
    temperature_series = _generate_time_series(
        base_value=base_temp,
        variance=2.0,
        periods=24,
        trend=0.05,
    )

    # Mock precipitation data
    base_precip = random.uniform(40, 200)
    precipitation_series = _generate_time_series(
        base_value=base_precip,
        variance=30,
        periods=24,
        trend=-0.3,
    )

    # Mock NDVI (vegetation index) - relevant for biodiversity monitoring
    base_ndvi = random.uniform(0.3, 0.7)
    ndvi_series = _generate_time_series(
        base_value=base_ndvi,
        variance=0.05,
        periods=24,
        trend=-0.003,
    )
    # Clamp NDVI to 0-1
    for entry in ndvi_series:
        entry["value"] = round(max(0.0, min(1.0, entry["value"])), 3)

    # Mock air quality index
    base_aqi = random.uniform(30, 80)
    aqi_series = _generate_time_series(
        base_value=base_aqi,
        variance=10,
        periods=24,
        trend=0.2,
    )
    for entry in aqi_series:
        entry["value"] = max(0, round(entry["value"], 1))

    incidents = _generate_incidents()

    # Satellite imagery placeholder
    satellite_info = {
        "available": False,
        "message": "Satellite imagery integration coming soon. This will display Planet/Sentinel-2 imagery for vegetation change detection.",
        "last_image_date": None,
        "coverage_area_km2": None,
    }

    # Climate risk indicators
    climate_risk = {
        "flood_risk": random.choice(["Low", "Medium", "High"]),
        "drought_risk": random.choice(["Low", "Medium", "High"]),
        "extreme_heat_days_per_year": random.randint(5, 60),
        "sea_level_rise_exposure": random.choice(["None", "Low", "Medium"]),
        "cyclone_risk": random.choice(["Low", "Medium", "High"]),
    }

    return {
        "project_id": project_id,
        "project_name": project["project_name"],
        "country": project["country"],
        "sector": project["sector"],
        "monitoring_status": "Active",
        "last_updated": datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "satellite_info": satellite_info,
        "climate_data": {
            "temperature_monthly": temperature_series,
            "precipitation_monthly": precipitation_series,
            "ndvi_monthly": ndvi_series,
            "aqi_monthly": aqi_series,
        },
        "climate_risk": climate_risk,
        "esg_incidents": incidents,
        "alerts": [
            {
                "id": "ALT-001",
                "type": "Climate",
                "severity": "Medium",
                "message": "Above-average temperature forecast for next 3 months. Monitor heat stress protocols.",
                "created_at": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
            }
        ],
    }
