import sqlite3
import json
import os
from typing import List, Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "projects.db")
SAMPLE_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "sample_projects.json")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            project_name TEXT NOT NULL,
            country TEXT,
            region TEXT,
            sector TEXT,
            project_type TEXT,
            scale_usd REAL,
            environmental_category TEXT,
            risk_level TEXT,
            risk_score REAL,
            ps_scores TEXT,
            year INTEGER,
            status TEXT,
            esg_issues TEXT,
            lessons_learned TEXT
        )
    """)
    conn.commit()

    # Seed with sample data if empty
    cursor.execute("SELECT COUNT(*) FROM projects")
    count = cursor.fetchone()[0]
    if count == 0:
        with open(SAMPLE_DATA_PATH, "r") as f:
            projects = json.load(f)
        for p in projects:
            cursor.execute("""
                INSERT OR IGNORE INTO projects VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                p["id"], p["project_name"], p["country"], p["region"],
                p["sector"], p["project_type"], p["scale_usd"],
                p["environmental_category"], p["risk_level"], p["risk_score"],
                json.dumps(p["ps_scores"]), p["year"], p["status"],
                json.dumps(p["esg_issues"]), p["lessons_learned"]
            ))
        conn.commit()
    conn.close()


def get_all_projects(country: Optional[str] = None, sector: Optional[str] = None,
                     risk_level: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT * FROM projects WHERE 1=1"
    params = []
    if country:
        query += " AND country = ?"
        params.append(country)
    if sector:
        query += " AND sector = ?"
        params.append(sector)
    if risk_level:
        query += " AND risk_level = ?"
        params.append(risk_level)
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [_row_to_dict(row) for row in rows]


def get_project_by_id(project_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_dict(row) if row else None


def insert_project(project: Dict[str, Any]) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT OR REPLACE INTO projects VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            project["id"], project["project_name"], project.get("country"),
            project.get("region"), project.get("sector"), project.get("project_type"),
            project.get("scale_usd"), project.get("environmental_category"),
            project.get("risk_level"), project.get("risk_score"),
            json.dumps(project.get("ps_scores", {})), project.get("year"),
            project.get("status"), json.dumps(project.get("esg_issues", [])),
            project.get("lessons_learned")
        ))
        conn.commit()
        return True
    except Exception:
        return False
    finally:
        conn.close()


def _row_to_dict(row) -> Dict[str, Any]:
    d = dict(row)
    if isinstance(d.get("ps_scores"), str):
        d["ps_scores"] = json.loads(d["ps_scores"])
    if isinstance(d.get("esg_issues"), str):
        d["esg_issues"] = json.loads(d["esg_issues"])
    return d
