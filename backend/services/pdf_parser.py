import re
import io
from typing import Dict, Any, List, Optional

try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False


SECTOR_KEYWORDS = {
    "Energy": ["power plant", "solar", "wind", "hydro", "hydropower", "electricity", "energy", "renewable", "fossil fuel", "thermal", "gas plant", "coal", "turbine", "substation", "transmission"],
    "Agriculture": ["farm", "agriculture", "crop", "livestock", "fishery", "irrigation", "plantation", "palm oil", "coffee", "cocoa", "sugar", "aquaculture", "agribusiness"],
    "Infrastructure": ["road", "highway", "bridge", "port", "airport", "railway", "transport", "infrastructure", "dam", "water supply", "pipeline", "telecom", "fiber"],
    "Manufacturing": ["factory", "plant", "manufacturing", "cement", "steel", "textile", "chemical", "processing", "industrial", "production", "assembly"],
    "Mining": ["mine", "mining", "mineral", "extraction", "quarry", "copper", "gold", "iron ore", "coal mine", "bauxite", "lithium"],
    "Financial Services": ["bank", "finance", "microfinance", "insurance", "fintech", "credit", "lending", "financial services", "investment fund"],
    "Healthcare": ["hospital", "clinic", "health", "medical", "pharmaceutical", "healthcare"],
    "Water & Sanitation": ["water", "sanitation", "sewage", "wastewater", "desalination", "water treatment", "drainage"],
    "Real Estate": ["real estate", "housing", "residential", "commercial property", "construction", "building"],
}

PROJECT_TYPE_KEYWORDS = {
    "Greenfield": ["greenfield", "new construction", "new project", "new facility", "newly constructed", "to be built", "new development"],
    "Expansion": ["expansion", "scale-up", "extending", "additional capacity", "increase capacity", "expand"],
    "Rehabilitation": ["rehabilitation", "upgrade", "modernization", "refurbishment", "renovation", "retrofit", "improvement", "remediation"],
    "Acquisition": ["acquisition", "purchase", "takeover", "buy", "merger"],
}

ENV_CATEGORY_KEYWORDS = {
    "A": ["category a", "significant adverse", "large-scale", "irreversible impact", "eia required", "environmental impact assessment"],
    "B": ["category b", "limited adverse", "site-specific", "reversible impacts", "iee"],
    "C": ["category c", "minimal", "negligible", "no significant", "low risk"],
}

COUNTRY_PATTERNS = [
    r'\bin\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b',
    r'\bcountry[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
    r'\blocation[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
]

KNOWN_COUNTRIES = [
    "Nigeria", "Kenya", "Ghana", "Ethiopia", "Tanzania", "Uganda", "South Africa",
    "Egypt", "Morocco", "India", "Bangladesh", "Pakistan", "Vietnam", "Indonesia",
    "Philippines", "Colombia", "Brazil", "Peru", "Mexico", "Turkey", "Mozambique",
    "Zambia", "Zimbabwe", "Senegal", "Cameroon", "Myanmar", "Cambodia", "Nepal",
    "Sri Lanka", "Georgia", "Armenia", "Azerbaijan", "Kazakhstan", "Kyrgyzstan"
]

REGION_MAP = {
    "Nigeria": "Sub-Saharan Africa", "Kenya": "Sub-Saharan Africa", "Ghana": "Sub-Saharan Africa",
    "Ethiopia": "Sub-Saharan Africa", "Tanzania": "Sub-Saharan Africa", "Uganda": "Sub-Saharan Africa",
    "South Africa": "Sub-Saharan Africa", "Mozambique": "Sub-Saharan Africa", "Zambia": "Sub-Saharan Africa",
    "Zimbabwe": "Sub-Saharan Africa", "Senegal": "Sub-Saharan Africa", "Cameroon": "Sub-Saharan Africa",
    "Egypt": "Middle East & North Africa", "Morocco": "Middle East & North Africa",
    "India": "South Asia", "Bangladesh": "South Asia", "Pakistan": "South Asia",
    "Nepal": "South Asia", "Sri Lanka": "South Asia",
    "Vietnam": "East Asia", "Indonesia": "East Asia", "Philippines": "East Asia",
    "Myanmar": "East Asia", "Cambodia": "East Asia",
    "Colombia": "Latin America", "Brazil": "Latin America", "Peru": "Latin America",
    "Mexico": "Latin America",
    "Turkey": "Europe & Central Asia", "Georgia": "Europe & Central Asia",
    "Armenia": "Europe & Central Asia", "Azerbaijan": "Europe & Central Asia",
    "Kazakhstan": "Europe & Central Asia", "Kyrgyzstan": "Europe & Central Asia",
}


def extract_text_from_pdf(file_bytes: bytes) -> str:
    if not PDF_AVAILABLE:
        return ""
    try:
        text = ""
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages[:20]:  # limit to first 20 pages
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception:
        return ""


def detect_sector(text: str) -> str:
    text_lower = text.lower()
    scores = {}
    for sector, keywords in SECTOR_KEYWORDS.items():
        count = sum(1 for kw in keywords if kw in text_lower)
        if count > 0:
            scores[sector] = count
    if scores:
        return max(scores, key=scores.get)
    return "Infrastructure"


def detect_project_type(text: str) -> str:
    text_lower = text.lower()
    for ptype, keywords in PROJECT_TYPE_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return ptype
    return "Greenfield"


def detect_country(text: str) -> Optional[str]:
    for country in KNOWN_COUNTRIES:
        if country in text:
            return country
    text_lower = text.lower()
    for country in KNOWN_COUNTRIES:
        if country.lower() in text_lower:
            return country
    return None


def detect_env_category(text: str) -> str:
    text_lower = text.lower()
    for cat, keywords in ENV_CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return cat
    return "B"


def extract_project_scale(text: str) -> Optional[float]:
    patterns = [
        r'\$\s*([\d,]+(?:\.\d+)?)\s*(?:million|mn|m)\b',
        r'USD\s*([\d,]+(?:\.\d+)?)\s*(?:million|mn|m)\b',
        r'US\$\s*([\d,]+(?:\.\d+)?)\s*(?:million|mn|m)\b',
        r'([\d,]+(?:\.\d+)?)\s*(?:million|mn)\s*(?:USD|US\$|\$)',
        r'\$\s*([\d,]+(?:\.\d+)?)\s*(?:billion|bn|b)\b',
        r'USD\s*([\d,]+(?:\.\d+)?)\s*(?:billion|bn|b)\b',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            val_str = matches[0].replace(",", "")
            try:
                val = float(val_str)
                if "billion" in pattern or "bn" in pattern or "\\bb\\b" in pattern:
                    val *= 1000
                return val * 1_000_000
            except ValueError:
                continue
    return None


def extract_project_name(text: str) -> Optional[str]:
    patterns = [
        r'project\s+name\s*[:\-]\s*(.+?)(?:\n|$)',
        r'project\s+title\s*[:\-]\s*(.+?)(?:\n|$)',
        r'(?:proposed|the)\s+(.+?)\s+project\b',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            if len(name) > 5 and len(name) < 100:
                return name
    # Try first meaningful line
    lines = [l.strip() for l in text.split("\n") if l.strip() and len(l.strip()) > 10]
    if lines:
        return lines[0][:80]
    return None


def extract_esg_keywords(text: str) -> List[str]:
    esg_terms = [
        "deforestation", "resettlement", "displacement", "indigenous", "biodiversity",
        "pollution", "contamination", "wastewater", "emissions", "greenhouse gas",
        "climate", "labor rights", "child labor", "forced labor", "occupational health",
        "community grievance", "land acquisition", "cultural heritage", "protected area",
        "endangered species", "water scarcity", "gender", "hiv", "malaria",
        "hazardous waste", "toxic", "tailings", "acid drainage", "peat",
    ]
    text_lower = text.lower()
    found = [term for term in esg_terms if term in text_lower]
    return found


def parse_pdf(file_bytes: bytes, filename: str = "") -> Dict[str, Any]:
    """Main entry point: parse PDF bytes and return structured project info."""
    text = extract_text_from_pdf(file_bytes)
    confidence = 100

    if not text or len(text) < 100:
        # Fallback: use filename heuristics
        confidence = 20
        return _fallback_parse(filename, confidence)

    project_name = extract_project_name(text) or filename.replace(".pdf", "").replace("_", " ").title()
    country = detect_country(text)
    sector = detect_sector(text)
    project_type = detect_project_type(text)
    scale_usd = extract_project_scale(text)
    env_category = detect_env_category(text)
    esg_keywords = extract_esg_keywords(text)
    region = REGION_MAP.get(country, "Unknown") if country else "Unknown"

    if not country:
        confidence -= 20
    if not scale_usd:
        confidence -= 15
    if not env_category:
        confidence -= 10

    confidence = max(25, confidence)

    return {
        "project_name": project_name,
        "location": country or "Unknown",
        "country": country or "Unknown",
        "region": region,
        "sector": sector,
        "project_type": project_type,
        "scale_usd": scale_usd,
        "environmental_category": env_category,
        "esg_keywords": esg_keywords,
        "raw_text_length": len(text),
        "confidence": confidence,
    }


def _fallback_parse(filename: str, confidence: int) -> Dict[str, Any]:
    return {
        "project_name": filename.replace(".pdf", "").replace("_", " ").title() or "Unknown Project",
        "location": "Unknown",
        "country": "Unknown",
        "region": "Unknown",
        "sector": "Infrastructure",
        "project_type": "Greenfield",
        "scale_usd": None,
        "environmental_category": "B",
        "esg_keywords": [],
        "raw_text_length": 0,
        "confidence": confidence,
    }
