# AirLens - Uçak Rötar Analizi

## Proje Hakkında
AirLens, hava yolu verilerini kullanarak uçakların iniş ve kalkış durumlarını analiz eden bir veri bilimi projesidir. Bu proje ile:
- Rötarların hangi şehirler, hava yolları ve nedenlerden kaynaklandığını,
- Uçakların geç veya zamanında iniş yapma olasılıklarını,
- Geleceğe yönelik basit tahmin modellerini

belirlemeyi amaçlamaktadır.

Bu repo artık mobil uygulama geliştirme için de başlangıç iskeleti içerir:
- `backend/`: FastAPI tabanlı veri ve analiz API'si
- `mobile/`: Expo/React Native tabanlı AirLens mobil dashboard'u

## Veri Seti
- Veri Kaynağı: [airlens.csv](link-to-your-dataset)  
- Veri Özellikleri:
  - `FlightNumber`: Uçuş numarası
  - `Airline`: Hava yolu şirketi
  - `Origin`: Kalkış şehri
  - `Destination`: Varış şehri
  - `ScheduledDeparture`: Planlanan kalkış saati
  - `ActualDeparture`: Gerçek kalkış saati
  - `ScheduledArrival`: Planlanan varış saati
  - `ActualArrival`: Gerçek varış saati
  - `Delay`: Rötar süresi (dakika)
  - `Reason`: Rötar nedeni (Hava, Teknik, Operasyonel vb.)

> Not: Repodaki mevcut `data` dosyası havayolu yorumları içerdiği için backend ilk sürümde yorum, puan ve öneri metrikleri üzerinden çalışır. Gerçek rötar verisi eklendiğinde API aynı mobil iskelete yeni gecikme endpoint'leriyle genişletilebilir.

## Kurulum

Projeyi yerel bilgisayarınızda çalıştırmak için:

```bash
# Repo klonlama
git clone https://github.com/frkdmr50/airlens.git
cd airlens

# Sanal ortam oluşturma (opsiyonel)
python -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows

# Gerekli kütüphaneleri yükleme
pip install -r requirements.txt
```

## Backend API'yi Çalıştırma

```bash
uvicorn backend.app.main:app --reload
```

Kullanışlı endpoint'ler:
- `GET /health`
- `GET /summary`
- `GET /reviews`
- `GET /analytics/airlines`
- `GET /analytics/locations`
- `POST /predict-satisfaction`

## Mobil Uygulamayı Çalıştırma

```bash
cd mobile
npm install
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000 npm start
```

Fiziksel telefonla test ederken `127.0.0.1` yerine backend'in çalıştığı bilgisayarın yerel ağ IP adresini kullanın.
