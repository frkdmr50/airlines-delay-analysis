from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT_DIR / "data"


@lru_cache(maxsize=1)
def load_airline_reviews() -> pd.DataFrame:
    """Load the bundled semicolon-delimited airline review data."""
    df = pd.read_csv(DATA_PATH, sep=";", skiprows=1)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df["recommended"] = df["recommended"].fillna("UNKNOWN").str.upper()
    return df


def _records(frame: pd.DataFrame) -> list[dict[str, Any]]:
    return frame.where(pd.notnull(frame), None).to_dict(orient="records")


def list_reviews(limit: int = 25, airline: str | None = None, location: str | None = None) -> list[dict[str, Any]]:
    df = load_airline_reviews()
    if airline:
        df = df[df["airline"].str.contains(airline, case=False, na=False)]
    if location:
        df = df[df["location"].str.contains(location, case=False, na=False)]
    return _records(df.sort_values("date", ascending=False).head(limit))


def get_summary() -> dict[str, Any]:
    df = load_airline_reviews()
    recommended_rate = float((df["recommended"] == "YES").mean() * 100) if len(df) else 0.0
    return {
        "total_reviews": int(len(df)),
        "airline_count": int(df["airline"].nunique()),
        "location_count": int(df["location"].nunique()),
        "average_rating": round(float(df["rating"].mean()), 2),
        "average_value": round(float(df["value"].mean()), 2),
        "recommended_rate": round(recommended_rate, 2),
    }


def airline_analytics(limit: int = 10) -> list[dict[str, Any]]:
    df = load_airline_reviews()
    grouped = (
        df.groupby("airline", dropna=True)
        .agg(review_count=("id", "count"), average_rating=("rating", "mean"), recommended_rate=("recommended", lambda values: (values == "YES").mean() * 100))
        .reset_index()
        .sort_values(["review_count", "average_rating"], ascending=[False, False])
        .head(limit)
    )
    grouped["average_rating"] = grouped["average_rating"].round(2)
    grouped["recommended_rate"] = grouped["recommended_rate"].round(2)
    return _records(grouped)


def location_analytics(limit: int = 10) -> list[dict[str, Any]]:
    df = load_airline_reviews()
    grouped = (
        df.groupby("location", dropna=True)
        .agg(review_count=("id", "count"), average_rating=("rating", "mean"))
        .reset_index()
        .sort_values("review_count", ascending=False)
        .head(limit)
    )
    grouped["average_rating"] = grouped["average_rating"].round(2)
    return _records(grouped)


def predict_satisfaction(airline: str, location: str | None = None, rating: float | None = None) -> dict[str, Any]:
    df = load_airline_reviews()
    subset = df[df["airline"].str.contains(airline, case=False, na=False)]
    if location:
        location_subset = subset[subset["location"].str.contains(location, case=False, na=False)]
        if len(location_subset) >= 3:
            subset = location_subset

    baseline = df["recommended"].eq("YES").mean()
    airline_rate = subset["recommended"].eq("YES").mean() if len(subset) else baseline
    rating_signal = ((rating or float(df["rating"].mean())) / 10) if rating else float(df["rating"].mean() / 10)
    score = max(0.0, min(1.0, (airline_rate * 0.7) + (rating_signal * 0.3)))

    return {
        "airline": airline,
        "location": location,
        "sample_size": int(len(subset)),
        "satisfaction_probability": float(round(score * 100, 2)),
        "risk_level": "low" if score >= 0.7 else "medium" if score >= 0.45 else "high",
    }
