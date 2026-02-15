import Spinner from "@/components/ui/spinner";
import { color } from "@/styles/color";
import { router } from "expo-router";
import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(initialDate || "");
  const [lifts, setLifts] = useState(initialLifts || []);
  const [removedLifts, setRemovedLifts] = useState<number[]>([]);

  const isEditing = !!workoutId;

  const handleSubmit = async () => {
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
      const url = isEditing ? `/api/lifts/${workoutId}` : "/api/lifts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: JSON.stringify({
          date,
          lifts,
          removed_lifts: removedLifts,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const error = await res.json();
        Alert.alert("Error", error.error || "Failed to save workout");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to save workout");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
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
