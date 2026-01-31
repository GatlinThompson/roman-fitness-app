import Divider from "@/components/ui/divider";
import Spinner from "@/components/ui/spinner";
import { useRealtimeWorkout } from "@/hooks/use-real-time-workout";
import { color } from "@/styles/color";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import LiftRow from "../../workout/lift_row";
import SuperSetRow from "../../workout/super_set_row";
import { isSuperSet } from "../../workout/workout";

export default function CalendarWorkout() {
  const selectedDate = useSelector((state: any) => state.calendar.selectedDate);

  console.log("Selected Date in CalendarWorkout:", selectedDate);

  const { workout, loading, workoutId } = useRealtimeWorkout({
    workout_date: selectedDate,
  });

  console.log("Workout Data in CalendarWorkout:", workout);

  if (loading) {
    return (
      <View style={styles.pesudoContainer}>
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
      <View style={styles.pesudoContainer}>
        <Text style={styles.pesudoText}>
          No workouts scheduled for this date.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
  container: {
    flex: 1,
  },
  pesudoText: {
    fontSize: 20,
    fontWeight: "500",
    color: color.darkForeground.color,
  },
  pesudoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    color: color.foreground.color,
  },
});
