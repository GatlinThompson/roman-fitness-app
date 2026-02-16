import { getWorkout } from "@/lib/supabase/queries";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import LiftForm from "../../forms/LiftForm";

function EditWorkout({ date, id }: { date: string; id: number }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["workout", id, date],
    queryFn: () => getWorkout(date),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#64B5FF" />
        <Text style={styles.loadingText}>Loading workout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load workout</Text>
        <Text style={styles.errorDetail}>
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiftForm
        initialDate={date}
        initialLifts={data?.workout_lifts || []}
        workoutId={id}
      />
    </View>
  );
}

export default memo(EditWorkout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorDetail: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textAlign: "center",
  },
});
