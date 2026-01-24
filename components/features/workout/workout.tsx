import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Lift } from "./lift_row";
import LiftRow from "./lift_row";
import type { SuperSet } from "./super_set_row";
import SuperSetRow from "./super_set_row";

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
};

type WorkoutLift = {
  sequence: number;
  lifts: (Lift | SuperSet)[];
};

export const isSuperSet = (lift: Lift | SuperSet): lift is SuperSet => {
  return lift && (lift as SuperSet).superset !== null;
};

export default function Workout() {
  const [workout, setWorkout] = useState<WorkoutLift[]>([]);

  const GetWorkout = useCallback(async () => {
    const todayStr = getTodayString();
    const { data, error } = await supabase
      .from("workouts")
      .select("*, workout_lifts(sequence, lift(*, superset(*)))")
      .eq("workout_date", todayStr)
      .order("sequence", {
        foreignTable: "workout_lifts",
        ascending: true,
      });
    if (error) {
      console.error("Error fetching workouts:", error);
    } else {
      console.log("Fetched workouts:", data);
      setWorkout(data[0]?.workout_lifts || []);
    }
  }, []);

  useEffect(() => {
    GetWorkout();
  }, [GetWorkout]);

  return (
    <View style={styles.container}>
      {workout.map((lift: any, index: number) => {
        if (isSuperSet(lift.lift)) {
          return (
            <SuperSetRow
              key={lift.id}
              superset={lift.lift.superset}
              lift={lift.lift}
              last={index === workout.length - 1}
            />
          );
        } else {
          return (
            <LiftRow
              key={lift.id}
              lift={lift.lift}
              last={index === workout.length - 1}
            />
          );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  workoutItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sequence: {
    color: "#dedbdb",
    fontSize: 14,
    fontWeight: "bold",
  },
  liftName: {
    color: "#dedbdb",
    fontSize: 16,
  },
});
