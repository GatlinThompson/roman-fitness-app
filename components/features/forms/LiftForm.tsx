import Spinner from "@/components/ui/spinner";
import { createWorkout, updateWorkout } from "@/lib/supabase/queries";
import { color } from "@/styles/color";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
        // Invalidate the query to refetch updated data
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
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <LiftDateInput initialDate={initialDate} onDateChange={setDate} />

        <LiftInputGroup
          initialLifts={initialLifts}
          onLiftsChange={setLifts}
          onRemovedLiftsChange={setRemovedLifts}
        />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    gap: 24,
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: color.primary.color,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
