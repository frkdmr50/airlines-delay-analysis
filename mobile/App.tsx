import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

type Summary = {
  total_reviews: number;
  airline_count: number;
  location_count: number;
  average_rating: number;
  average_value: number;
  recommended_rate: number;
};

type AirlineMetric = {
  airline: string;
  review_count: number;
  average_rating: number;
  recommended_rate: number;
};

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [airlines, setAirlines] = useState<AirlineMetric[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryResponse, airlineResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/summary`),
          fetch(`${API_BASE_URL}/analytics/airlines?limit=12`),
        ]);

        if (!summaryResponse.ok || !airlineResponse.ok) {
          throw new Error('API yanıtı başarısız oldu.');
        }

        setSummary(await summaryResponse.json());
        setAirlines(await airlineResponse.json());
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'Beklenmeyen hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const filteredAirlines = useMemo(() => {
    return airlines.filter((item) => item.airline.toLowerCase().includes(query.toLowerCase()));
  }, [airlines, query]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>AirLens Mobil</Text>
        <Text style={styles.title}>Havayolu deneyimi ve gecikme sinyalleri</Text>
        <Text style={styles.subtitle}>Yorum verilerinden özet metrikler, havayolu karşılaştırmaları ve memnuniyet riski.</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#38bdf8" size="large" />
          <Text style={styles.mutedText}>Dashboard yükleniyor...</Text>
        </View>
      ) : error ? (
        <View style={styles.card}>
          <Text style={styles.errorTitle}>API bağlantısı kurulamadı</Text>
          <Text style={styles.mutedText}>{error}</Text>
          <Text style={styles.mutedText}>Backend'i çalıştırın ve EXPO_PUBLIC_API_URL değerini kontrol edin.</Text>
        </View>
      ) : (
        <>
          <View style={styles.metricsGrid}>
            <Metric label="Yorum" value={summary?.total_reviews.toLocaleString('tr-TR') ?? '-'} />
            <Metric label="Havayolu" value={summary?.airline_count.toString() ?? '-'} />
            <Metric label="Ort. Puan" value={summary?.average_rating.toFixed(1) ?? '-'} />
            <Metric label="Öneri" value={`%${summary?.recommended_rate.toFixed(0) ?? '-'}`} />
          </View>

          <TextInput
            style={styles.search}
            placeholder="Havayolu ara..."
            placeholderTextColor="#94a3b8"
            value={query}
            onChangeText={setQuery}
          />

          <FlatList
            data={filteredAirlines}
            keyExtractor={(item) => item.airline}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.airlineCard}>
                <View>
                  <Text style={styles.airlineName}>{item.airline}</Text>
                  <Text style={styles.mutedText}>{item.review_count} yorum</Text>
                </View>
                <View style={styles.scorePill}>
                  <Text style={styles.scoreText}>{item.average_rating.toFixed(1)}</Text>
                  <Text style={styles.scoreSubtext}>%{item.recommended_rate.toFixed(0)} öneri</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 20 },
  header: { paddingTop: 20, paddingBottom: 24 },
  eyebrow: { color: '#38bdf8', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  title: { color: '#f8fafc', fontSize: 30, fontWeight: '800', lineHeight: 36 },
  subtitle: { color: '#cbd5e1', fontSize: 15, lineHeight: 22, marginTop: 10 },
  centered: { alignItems: 'center', gap: 12, justifyContent: 'center', padding: 32 },
  card: { backgroundColor: '#0f172a', borderRadius: 20, padding: 18 },
  errorTitle: { color: '#f87171', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18 },
  metricCard: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: 18, borderWidth: 1, padding: 16, width: '47%' },
  metricValue: { color: '#f8fafc', fontSize: 24, fontWeight: '800' },
  metricLabel: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  search: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: 16, borderWidth: 1, color: '#f8fafc', marginBottom: 14, padding: 14 },
  list: { gap: 12, paddingBottom: 32 },
  airlineCard: { alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  airlineName: { color: '#f8fafc', fontSize: 16, fontWeight: '700', maxWidth: 190 },
  mutedText: { color: '#94a3b8', fontSize: 13, lineHeight: 20 },
  scorePill: { alignItems: 'flex-end', backgroundColor: '#082f49', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  scoreText: { color: '#7dd3fc', fontSize: 18, fontWeight: '800' },
  scoreSubtext: { color: '#bae6fd', fontSize: 11 },
});
