import Spinner from "@/components/ui/spinner";
import { createWorkout, updateWorkout } from "@/lib/supabase/queries";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import LiftDateInput from "./LiftDateInput";
import LiftInputGroup from "./LiftInputGroup";

type Props = {
  workoutId?: number;
  initialDate?: string;
  initialLifts?: any[];
};

export default function LiftForm({
  workoutId,
  initialDate,
  initialLifts,
}: Props) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(initialDate || "");
  const [lifts, setLifts] = useState(initialLifts || []);
  const [removedLifts, setRemovedLifts] = useState<number[]>([]);

  const isEditing = useMemo(() => !!workoutId, [workoutId]);
  const canSubmit = useMemo(
    () => !loading && date && lifts.length > 0,
    [loading, date, lifts],
  );

  const handleSubmit = useCallback(async () => {
    if (!date) {
      Alert.alert("Error", "Please select a date");
      return;
    }

    if (lifts.length === 0) {
      Alert.alert("Error", "Please add at least one lift");
      return;
    }

    setLoading(true);

    try {
      if (isEditing && workoutId) {
        await updateWorkout(workoutId, lifts, date, removedLifts);
        queryClient.invalidateQueries({
          queryKey: ["workout", workoutId, date],
        });
      } else {
        await createWorkout(lifts, date);
      }
      router.push("/(tabs)/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save workout";
      Alert.alert("Error", errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isEditing, workoutId, lifts, date, removedLifts, queryClient]);

  return (
    <View style={styles.container}>
      {/* Date picker — fixed above the scrollable list */}
      <View style={styles.dateSection}>
        <LiftDateInput initialDate={initialDate} onDateChange={setDate} />
      </View>

      {/* Scrollable lift list with fade edges */}
      <View style={styles.scrollSection}>
        <LiftInputGroup
          initialLifts={initialLifts}
          onLiftsChange={setLifts}
          onRemovedLiftsChange={setRemovedLifts}
        />
      </View>

      {/* Submit button pinned to the bottom */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? (
            <Spinner size={24} />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? "Update Workout" : "Create Workout"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateSection: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  scrollSection: {
    flex: 1,
    position: "relative",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    // Enough room so the last card isn't hidden behind button + fade
    paddingBottom: 120,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 64,
    left: 8,
    right: 8,
  },
  button: {
    backgroundColor: "#0F0E0E",
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#454444",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
