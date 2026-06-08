# DFI ESG Platform

A full-stack web application for Development Finance Institution (DFI) analysts to evaluate ESG risk of new projects using IFC Performance Standards (PS1–PS8).

## Features

- **PDF Upload & Parsing**: Upload project reports to automatically extract metadata (country, sector, scale, environmental category)
- **IFC PS1–PS8 Risk Scoring**: Automated scoring across all 8 IFC Performance Standards
- **Similar Project Matching**: Find comparable past IFC projects by location and sector
- **Risk Visualization**: Radar charts, score cards, and PS breakdown tables
- **Project Database**: Browse and filter 20+ sample IFC projects
- **Continuous Monitoring**: Climate indicators, NDVI tracking, and ESG incident feed (satellite integration coming soon)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Recharts
- **Backend**: FastAPI (Python), pdfplumber, scikit-learn, SQLite

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## IFC Performance Standards

| Standard | Focus Area |
|----------|-----------|
| PS1 | Assessment and Management of E&S Risks |
| PS2 | Labor and Working Conditions |
| PS3 | Resource Efficiency and Pollution Prevention |
| PS4 | Community Health, Safety, and Security |
| PS5 | Land Acquisition and Involuntary Resettlement |
| PS6 | Biodiversity Conservation |
| PS7 | Indigenous Peoples |
| PS8 | Cultural Heritage |

## Risk Scoring

- **Low** (0–29): Green — minimal ESG concerns
- **Medium** (30–59): Yellow — standard ESMS required
- **High** (60–74): Orange — enhanced due diligence needed
- **Very High** (75–100): Red — Category A ESIA required
