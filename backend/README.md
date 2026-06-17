# AirLens Backend

FastAPI tabanlı backend, `data` dosyasındaki havayolu yorum verisini okuyarak mobil uygulama için özet, listeleme, analiz ve basit memnuniyet tahmini endpoint'leri sunar.

## Çalıştırma

```bash
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Varsayılan API adresi: `http://127.0.0.1:8000`

## Endpoint'ler

- `GET /health`
- `GET /summary`
- `GET /reviews?limit=25&airline=Delta`
- `GET /analytics/airlines`
- `GET /analytics/locations`
- `POST /predict-satisfaction`
