import Divider from "@/components/ui/divider";
import Spinner from "@/components/ui/spinner";
import { useRealtimeWorkout } from "@/hooks/use-real-time-workout";
import { color } from "@/styles/color";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LiftRow from "../../workout/lift_row";
import SuperSetRow from "../../workout/super_set_row";
import { isSuperSet } from "../../workout/workout";

type WorkoutLift = {
  date: string;
};

export default function CalendarWorkout({ date }: WorkoutLift) {
  const [showLoading, setShowLoading] = useState(true);
  const { workout, loading } = useRealtimeWorkout({
    workout_date: date,
  });

  useEffect(() => {
    setShowLoading(true);
    const timer = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(timer);
  }, [date]);

  if (showLoading || loading) {
    return (
      <View style={styles.emptyContainer}>
        <Spinner />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!workout || workout.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No workouts scheduled for this date
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
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
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "500",
    color: color.darkForeground.color,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
    color: color.darkForeground.color,
  },
});
