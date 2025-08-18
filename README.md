# AirLens - Uçak Rötar Analizi

## Proje Hakkında
AirLens, hava yolu verilerini kullanarak uçakların iniş ve kalkış durumlarını analiz eden bir veri bilimi projesidir. Bu proje ile:
- Rötarların hangi şehirler, hava yolları ve nedenlerden kaynaklandığını,
- Uçakların geç veya zamanında iniş yapma olasılıklarını,
- Geleceğe yönelik basit tahmin modellerini

belirlemeyi amaçlamaktadır.

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
