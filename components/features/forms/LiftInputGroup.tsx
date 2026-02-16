import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import LiftInput from "./LiftInput";

type LiftRow = { id: string; data?: any; liftData?: any; sequence?: number };

const makeId = () => {
  return Math.random().toString(36).substring(2, 11);
};

type Props = {
  initialLifts?: any[];
  onLiftsChange?: (lifts: any[]) => void;
  onRemovedLiftsChange?: (ids: number[]) => void;
};

function LiftInputGroup({
  initialLifts,
  onLiftsChange,
  onRemovedLiftsChange,
}: Props) {
  const [removedLiftIds, setRemovedLiftIds] = useState<number[]>([]);
  const [lifts, setLifts] = useState<LiftRow[]>(() => {
    if (initialLifts && initialLifts.length > 0) {
      return initialLifts.map((lift) => ({ id: lift.lift.id, data: lift }));
    }
    return [{ id: makeId() }];
  });

  const formattedLifts = useMemo(
    () =>
      lifts.map((lift, index) => ({
        lift: lift.liftData || {
          exercise: "",
          reps: "",
          tempo: "",
          superSet: null,
        },
        sequence: lift.sequence || index + 1,
      })),
    [lifts],
  );

  useEffect(() => {
    // Format lifts data for submission with debounce to prevent infinite loops (200ms)
    const timeoutId = setTimeout(() => {
      onLiftsChange?.(formattedLifts);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [formattedLifts, onLiftsChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRemovedLiftsChange?.(removedLiftIds);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [removedLiftIds, onRemovedLiftsChange]);

  const handleLiftDataChange = useCallback(
    (index: number, liftData: any, sequence: number) => {
      setLifts((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], liftData, sequence };
        return updated;
      });
    },
    [],
  );

  const removeLift = (id: string) => {
    if (initialLifts && initialLifts.length > 0) {
      const numId = parseInt(id);
      if (!isNaN(numId)) {
        setRemovedLiftIds((prev) => [...prev, numId]);
      }
    }
    setLifts((prev) => prev.filter((l) => l.id !== id));
  };

  const addLift = () => {
    setLifts((prev) => [...prev, { id: makeId() }]);
  };

  const moveLift = (fromIndex: number, toIndex: number) => {
    setLifts((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <View>
      {lifts.map((lift, index) => (
        <View key={lift.id} style={styles.liftContainer}>
          <View style={styles.liftHeader}>
            <Text style={styles.liftTitle}>Lift {index + 1}</Text>
            {lifts.length > 1 && (
              <Pressable
                style={styles.removeButton}
                onPress={() => removeLift(lift.id)}
              >
                <MaterialIcons name="close" size={28} color="#FF6B6B" />
              </Pressable>
            )}
          </View>

          <View style={styles.controlButtons}>
            {index !== 0 && (
              <Pressable
                style={[
                  styles.moveButton,
                  index === 0 && styles.moveButtonDisabled,
                ]}
                onPress={() => moveLift(index, index - 1)}
                disabled={index === 0}
              >
                <MaterialIcons name="arrow-upward" size={20} color="white" />
                <Text style={styles.moveButtonText}>Up</Text>
              </Pressable>
            )}
            {index !== lifts.length - 1 && (
              <Pressable
                style={[
                  styles.moveButton,
                  index === lifts.length - 1 && styles.moveButtonDisabled,
                ]}
                onPress={() => moveLift(index, index + 1)}
                disabled={index === lifts.length - 1}
              >
                <MaterialIcons name="arrow-downward" size={20} color="white" />
                <Text style={styles.moveButtonText}>Down</Text>
              </Pressable>
            )}
          </View>

          <LiftInput
            sequence={index + 1}
            initialData={lift.data}
            onDataChange={(data, seq) => handleLiftDataChange(index, data, seq)}
          />
        </View>
      ))}

      <Pressable style={styles.addButton} onPress={addLift}>
        <MaterialIcons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Another Lift</Text>
      </Pressable>
    </View>
  );
}

export default memo(LiftInputGroup);

const styles = StyleSheet.create({
  liftContainer: {
    marginBottom: 40,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  liftHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  liftTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
  },
  removeButton: {
    padding: 4,
  },
  controlButtons: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 12,
  },
  moveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(100, 150, 255, 0.6)",
    borderRadius: 6,
    flex: 1,
  },
  moveButtonDisabled: {
    opacity: 0.4,
  },
  moveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(100, 200, 100, 0.6)",
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
