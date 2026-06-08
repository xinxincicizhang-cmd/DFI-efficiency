from typing import List, Dict, Any
from services.database import get_all_projects


def compute_similarity(project_a: Dict[str, Any], project_b: Dict[str, Any]) -> float:
    """
    Compute similarity score between two projects.
    Weights:
      - Country match: 0.3
      - Region match:  0.2
      - Sector match:  0.3
      - Project type:  0.2
    Returns a float 0.0 - 1.0
    """
    score = 0.0

    if project_a.get("country") and project_b.get("country"):
        if project_a["country"].lower() == project_b["country"].lower():
            score += 0.3

    if project_a.get("region") and project_b.get("region"):
        if project_a["region"].lower() == project_b["region"].lower():
            score += 0.2

    if project_a.get("sector") and project_b.get("sector"):
        if project_a["sector"].lower() == project_b["sector"].lower():
            score += 0.3

    if project_a.get("project_type") and project_b.get("project_type"):
        if project_a["project_type"].lower() == project_b["project_type"].lower():
            score += 0.2

    return round(score, 4)


def find_similar_projects(
    new_project: Dict[str, Any],
    top_n: int = 5,
) -> List[Dict[str, Any]]:
    """
    Find the top N most similar projects from the database.
    Returns list of project dicts with an added 'similarity_score' field (0-100).
    """
    all_projects = get_all_projects()
    scored = []

    for stored_project in all_projects:
        sim = compute_similarity(new_project, stored_project)
        project_copy = dict(stored_project)
        project_copy["similarity_score"] = round(sim * 100, 1)
        scored.append(project_copy)

    # Sort by similarity descending
    scored.sort(key=lambda x: x["similarity_score"], reverse=True)

    # Return top N, but only those with some similarity
    results = [p for p in scored if p["similarity_score"] > 0]
    if not results:
        results = scored  # return all if none match

    return results[:top_n]
