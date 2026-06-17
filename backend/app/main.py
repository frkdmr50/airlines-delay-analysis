from __future__ import annotations

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .data import airline_analytics, get_summary, list_reviews, location_analytics, predict_satisfaction

app = FastAPI(
    title="AirLens API",
    description="Airline review analytics API for the AirLens mobile app.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    airline: str = Field(..., examples=["Delta Air Lines"])
    location: str | None = Field(default=None, examples=["United States"])
    rating: float | None = Field(default=None, ge=0, le=10)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/summary")
def summary() -> dict[str, object]:
    return get_summary()


@app.get("/reviews")
def reviews(
    limit: int = Query(default=25, ge=1, le=100),
    airline: str | None = None,
    location: str | None = None,
) -> list[dict[str, object]]:
    return list_reviews(limit=limit, airline=airline, location=location)


@app.get("/analytics/airlines")
def airlines(limit: int = Query(default=10, ge=1, le=50)) -> list[dict[str, object]]:
    return airline_analytics(limit=limit)


@app.get("/analytics/locations")
def locations(limit: int = Query(default=10, ge=1, le=50)) -> list[dict[str, object]]:
    return location_analytics(limit=limit)


@app.post("/predict-satisfaction")
def prediction(payload: PredictionRequest) -> dict[str, object]:
    return predict_satisfaction(payload.airline, payload.location, payload.rating)
