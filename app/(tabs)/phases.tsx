import {
  extendPhase,
  getPhases,
  PhaseEntry,
  reducePhase,
} from "@/lib/supabase/queries";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ContainerView from "@/components/layout/container-view";
import { font } from "@/styles/fonts";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function durationIsMoreThanAWeek(startIso: string, endIso: string) {
  const diff = new Date(endIso).getTime() - new Date(startIso).getTime();
  return diff / (1000 * 3600 * 24) > 7;
}

function PhaseCard({
  item,
  index,
  onExtend,
  onReduce,
  extendingId,
  reducingId,
}: {
  item: PhaseEntry;
  index: number;
  onExtend: (id: string) => void;
  onReduce: (id: string) => void;
  extendingId: string | null;
  reducingId: string | null;
}) {
  const isFirstPhase = index === 0;
  const canReduce = durationIsMoreThanAWeek(item.start_date, item.end_date);
  const isExtending = extendingId === item.id;
  const isReducing = reducingId === item.id;
  const isBusy = isExtending || isReducing;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.phaseLabel}>
          Phase {item.phase.phase_number} — {item.phase.level}
        </Text>
        <Text style={styles.percentage}>{item.phase.percentage}%</Text>
      </View>
      <Text style={styles.dates}>
        {formatDate(item.start_date)} — {formatDate(item.end_date)}
      </Text>
      {isFirstPhase && (
        <View style={styles.actions}>
          {canReduce && (
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnOutline,
                isBusy && styles.btnDisabled,
              ]}
              onPress={() => onReduce(item.id)}
              disabled={isBusy}
            >
              {isReducing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnTextOutline}>-1 Week</Text>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.btn,
              styles.btnPrimary,
              isBusy && styles.btnDisabled,
            ]}
            onPress={() => onExtend(item.id)}
            disabled={isBusy}
          >
            {isExtending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>+1 Week</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function Phases() {
  const [phases, setPhases] = useState<PhaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extendingId, setExtendingId] = useState<string | null>(null);
  const [reducingId, setReducingId] = useState<string | null>(null);

  const fetchPhases = useCallback(async () => {
    try {
      setError(null);
      const data = await getPhases();
      setPhases(data);
    } catch {
      setError("Failed to load phases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhases();
  }, [fetchPhases]);

  const handleExtend = async (id: string) => {
    setExtendingId(id);
    try {
      await extendPhase(id);
      await fetchPhases();
    } catch (e: any) {
      setError(e?.message ?? "Failed to extend phase.");
    } finally {
      setExtendingId(null);
    }
  };

  const handleReduce = async (id: string) => {
    setReducingId(id);
    try {
      await reducePhase(id);
      await fetchPhases();
    } catch (e: any) {
      setError(e?.message ?? "Failed to reduce phase.");
    } finally {
      setReducingId(null);
    }
  };

  return (
    <ContainerView>
      <View style={styles.header}>
        <Text style={styles.title}>Phase Management</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={phases}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <PhaseCard
              item={item}
              index={index}
              onExtend={handleExtend}
              onReduce={handleReduce}
              extendingId={extendingId}
              reducingId={reducingId}
            />
          )}
        />
      )}
    </ContainerView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 8,
    marginBottom: 16,
    paddingTop: 52,
  },
  title: {
    color: "white",
    fontSize: 28,
    textAlign: "center",
    fontWeight: font.montserratBold.fontWeight,
    fontFamily: font.montserratBold.fontFamily,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    color: "#f87171",
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    backgroundColor: "#262525",
    borderRadius: 8,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#454444",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  phaseLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: font.montserratBold.fontWeight,
    fontFamily: font.montserratBold.fontFamily,
  },
  percentage: {
    color: "#a3a3a3",
    fontSize: 14,
  },
  dates: {
    color: "#949191",
    fontSize: 16,
    fontFamily: font.montserratRegular.fontFamily,
    fontWeight: font.montserratRegular.fontWeight,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    justifyContent: "flex-end",
  },
  btn: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 90,
  },
  btnPrimary: {
    backgroundColor: "#c21b1b",
  },
  btnOutline: {
    backgroundColor: "#0F0E0E",
    borderWidth: 1,
    borderColor: "#aeaeae",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
  },
  btnTextOutline: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
  },
});
