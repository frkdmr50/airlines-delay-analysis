
# Airlines Delay Analysis / Havayolu Rötar Analizi

Bu repo, **airlens.csv** veri setiyle uçuş rötarlarının keşifsel analizi, zaman serisi incelemesi ve basit sınıflandırma modellerini içerir.

## İçerik
- `airlines_delay_analysis.ipynb`: Veri yükleme → ön işleme → EDA → zaman serisi → sınıflandırma
- `processed_sample.csv`: Örnek çıktı (ilk 1.000 satır, opsiyonel)
- `requirements.txt`: Gerekli Python paketleri
- (Opsiyonel) `data/airlens.csv`: Veri dosyanızı `data/` klasörüne koyabilirsiniz

## Kurulum
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
jupyter lab  # veya jupyter notebook
```

## Kullanım
1) `airlens.csv` dosyasını proje dizinine veya `data/` klasörüne kopyalayın
2) `airlines_delay_analysis.ipynb` dosyasını açın ve hücreleri sırayla çalıştırın
3) Son bölümde model çıktıları ve metrikleri göreceksiniz

## Lisans
MIT
