import { font } from "@/styles/fonts";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
  onDataChange?: (data: LiftInputValue, sequence: number) => void;
};

function LiftInput({ sequence, initialData, onDataChange }: Props) {
  const [liftObject, setLiftObject] = useState<LiftInputValue>(() => {
    if (initialData?.lift) {
      // Handle both superSet (camelCase) and superset (snake_case) from database
      const liftData = initialData.lift as any;
      const supersetData = liftData.superSet || liftData.superset;
      return {
        exercise: liftData.exercise || "",
        reps: liftData.reps || "",
        tempo: liftData.tempo || "",
        superSet: supersetData
          ? {
              exercise: supersetData.exercise || "",
              reps: supersetData.reps || "",
              tempo: supersetData.tempo || "",
            }
          : null,
      };
    }
    return {
      ...emptyLift,
      superSet: null,
    };
  });

  const hasSuperSet = useMemo(
    () => !!liftObject.superSet,
    [liftObject.superSet],
  );

  const [superSetEnabled, setSuperSetEnabled] = useState(
    !!(
      (initialData?.lift as any)?.superSet ||
      (initialData?.lift as any)?.superset
    ),
  );

  useEffect(() => {
    setLiftObject((prev) => ({
      ...prev,
      superSet: superSetEnabled ? prev.superSet || { ...emptyLift } : null,
    }));
  }, [superSetEnabled]);

  useEffect(() => {
    // Debounce to prevent infinite update loops (200ms for better performance)
    const timeoutId = setTimeout(() => {
      onDataChange?.(liftObject, sequence);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [liftObject, sequence, onDataChange]);

  const updateMain = useCallback((key: keyof LiftFields, value: string) => {
    setLiftObject((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateSuper = useCallback((key: keyof LiftFields, value: string) => {
    setLiftObject((prev) => ({
      ...prev,
      superSet: prev.superSet
        ? { ...prev.superSet, [key]: value }
        : prev.superSet,
    }));
  }, []);

  return (
    <View style={styles.container}>
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
        <View style={[styles.inputGroup, { flex: 2 }]}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={liftObject.reps}
            onChangeText={(value) => updateMain("reps", value)}
            placeholder="Reps"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="numbers-and-punctuation"
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
            false: "#622d2d",
            true: "#E01C1C",
          }}
          style={{ height: 40, width: 70, transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
          thumbColor={superSetEnabled ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"}
        />
      </View>

      {/* Superset fields */}
      {superSetEnabled && hasSuperSet && liftObject.superSet && (
        <View style={styles.supersetContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Superset Exercise</Text>
            <TextInput
              style={styles.input}
              value={liftObject.superSet!.exercise}
              onChangeText={(value) => updateSuper("exercise", value)}
              placeholder="Superset Exercise Name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.label}>Reps</Text>
              <TextInput
                style={styles.input}
                value={liftObject.superSet!.reps}
                onChangeText={(value) => updateSuper("reps", value)}
                placeholder="Reps"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Tempo</Text>
              <TextInput
                style={styles.input}
                value={liftObject.superSet!.tempo}
                onChangeText={(value) => updateSuper("tempo", value)}
                placeholder="Tempo"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default memo(LiftInput);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    fontSize: 18,
    marginBottom: 4,
    fontFamily: font.montserratRegular.fontFamily,
    fontWeight: font.montserratRegular.fontWeight,
  },
  input: {
    backgroundColor: "#262525",
    borderWidth: 1,
    borderColor: "#454444",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
    fontWeight: font.montserratRegular.fontWeight,
    fontFamily: font.montserratRegular.fontFamily,
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
  supersetBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(100, 150, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(100, 150, 255, 0.5)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 12,
  },
  supersetBadgeText: {
    color: "rgba(150, 180, 255, 1)",
    fontSize: 11,
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
  },
});
