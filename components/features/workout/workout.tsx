import Divider from "@/components/ui/divider";
import GlassContainer from "@/components/ui/glass-container";
import Spinner from "@/components/ui/spinner";
import { useRealtimeWorkout } from "@/hooks/use-real-time-workout";
import { color } from "@/styles/color";
import { StyleSheet, Text, View } from "react-native";
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
  const { workout, loading } = useRealtimeWorkout();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
          gap: 8,
        }}
      >
        <Spinner />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "500",
            color: color.darkForeground.color,
          }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  if (workout.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          minHeight: "100%",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            color: color.darkForeground.color,
            textAlign: "center",
          }}
        >
          No workout scheduled for today.
        </Text>
      </View>
    );
  }

  return (
    <GlassContainer>
      <View style={styles.container}>
        {workout.map((lift: any, index: number) => {
          if (isSuperSet(lift.lift)) {
            return (
              <View key={index}>
                <SuperSetRow
                  superset={lift.lift.superset}
                  lift={lift.lift}
                  last={index === workout.length - 1}
                />
                {index !== workout.length - 1 && (
                  <Divider style={{ marginVertical: 8 }} />
                )}
              </View>
            );
          } else {
            return (
              <View key={index}>
                <LiftRow lift={lift.lift} last={index === workout.length - 1} />
                {index !== workout.length - 1 && (
                  <Divider style={{ marginVertical: 4 }} />
                )}
              </View>
            );
          }
        })}
      </View>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingBottom: 16,
  },
});
