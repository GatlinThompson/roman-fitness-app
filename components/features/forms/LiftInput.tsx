import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

type LiftFields = {
  exercise: string;
  reps: string;
  tempo: string;
};

type LiftInputValue = LiftFields & {
  superSet: LiftFields | null;
};

const emptyLift: LiftFields = { exercise: "", reps: "", tempo: "" };

type Props = {
  sequence: number;
  initialData?: {
    lift: LiftInputValue;
  };
  onDataChange?: (data: LiftInputValue) => void;
};

export default function LiftInput({
  sequence,
  initialData,
  onDataChange,
}: Props) {
  const [liftObject, setLiftObject] = useState<LiftInputValue>(() => {
    if (initialData?.lift) {
      return {
        exercise: initialData.lift.exercise || "",
        reps: initialData.lift.reps || "",
        tempo: initialData.lift.tempo || "",
        superSet: initialData.lift.superSet
          ? {
              exercise: initialData.lift.superSet.exercise || "",
              reps: initialData.lift.superSet.reps || "",
              tempo: initialData.lift.superSet.tempo || "",
            }
          : null,
      };
    }
    return {
      ...emptyLift,
      superSet: null,
    };
  });

  const [superSetEnabled, setSuperSetEnabled] = useState(
    !!initialData?.lift?.superSet,
  );

  useEffect(() => {
    setLiftObject((prev) => ({
      ...prev,
      superSet: superSetEnabled ? prev.superSet || { ...emptyLift } : null,
    }));
  }, [superSetEnabled]);

  useEffect(() => {
    // Debounce to prevent infinite update loops
    const timeoutId = setTimeout(() => {
      onDataChange?.(liftObject);
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [liftObject]);

  const updateMain = (key: keyof LiftFields, value: string) => {
    setLiftObject((prev) => ({ ...prev, [key]: value }));
  };

  const updateSuper = (key: keyof LiftFields, value: string) => {
    setLiftObject((prev) => ({
      ...prev,
      superSet: prev.superSet
        ? { ...prev.superSet, [key]: value }
        : prev.superSet,
    }));
  };

  return (
    <View>
      {/* TextInput fields for main lift */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Exercise</Text>
        <TextInput
          style={styles.input}
          value={liftObject.exercise}
          onChangeText={(value) => updateMain("exercise", value)}
          placeholder="Exercise Name"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={liftObject.reps}
            onChangeText={(value) => updateMain("reps", value)}
            placeholder="Reps"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="number-pad"
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Tempo</Text>
          <TextInput
            style={styles.input}
            value={liftObject.tempo}
            onChangeText={(value) => updateMain("tempo", value)}
            placeholder="Tempo"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>
      </View>

      {/* Superset toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Superset</Text>
        <Switch
          value={superSetEnabled}
          onValueChange={setSuperSetEnabled}
          trackColor={{
            false: "rgba(255, 255, 255, 0.2)",
            true: "rgba(100, 150, 255, 0.5)",
          }}
          thumbColor={superSetEnabled ? "#64B5FF" : "rgba(255, 255, 255, 0.5)"}
        />
      </View>

      {/* Superset fields */}
      {superSetEnabled && liftObject.superSet && (
        <View style={styles.supersetContainer}>
          <Text style={styles.supersetTitle}>Superset Lift</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Superset Exercise</Text>
            <TextInput
              style={styles.input}
              value={liftObject.superSet.exercise}
              onChangeText={(value) => updateSuper("exercise", value)}
              placeholder="Exercise Name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Superset Reps</Text>
              <TextInput
                style={styles.input}
                value={liftObject.superSet.reps}
                onChangeText={(value) => updateSuper("reps", value)}
                placeholder="Superset Reps"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Superset Tempo</Text>
              <TextInput
                style={styles.input}
                value={liftObject.superSet.tempo}
                onChangeText={(value) => updateSuper("tempo", value)}
                placeholder="Superset Tempo"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  supersetContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  supersetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
});
