from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.assessment import router as assessment_router
from routes.projects import router as projects_router
from routes.monitoring import router as monitoring_router
from services.database import init_db

app = FastAPI(
    title="DFI ESG Platform API",
    description="API for evaluating ESG risk of development finance projects using IFC Performance Standards",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment_router, prefix="/api/assessment", tags=["Assessment"])
app.include_router(projects_router, prefix="/api/projects", tags=["Projects"])
app.include_router(monitoring_router, prefix="/api/monitoring", tags=["Monitoring"])


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/")
async def root():
    return {
        "service": "DFI ESG Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
