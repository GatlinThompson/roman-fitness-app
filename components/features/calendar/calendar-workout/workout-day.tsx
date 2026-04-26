import BottomSpace from "@/components/layout/bottom-space";
import { color } from "@/styles/color";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Lift } from "./calendar-lift-row";
import { SuperSet } from "./calendar-superset-row";
import CalendarWorkout from "./calendar-workout";
import CalendarWorkoutButton from "./calendar-workout-button";
import SelectedDate from "./workout-list-selected-date";

type WorkoutDayProps = {
  date: string;
  workout: { workout: (Lift | SuperSet)[]; id?: number } | undefined;
  loading?: boolean;
};

/**
 * WorkoutDay - Memoized workout day component
 * Only re-renders when the date prop actually changes
 * This prevents unnecessary re-renders during carousel animations
 */
function WorkoutDay({ date, workout, loading }: WorkoutDayProps) {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <SelectedDate date={date} />
        <CalendarWorkoutButton
          editMode={!!workout?.id}
          date={date}
          id={workout?.id}
        />
      </View>
      <CalendarWorkout
        workout={workout?.workout ?? []}
        loading={loading}
        dateKey={date}
      />
      <BottomSpace />
    </View>
  );
}

// Memoize with custom comparison for optimal performance
export default React.memo(WorkoutDay, (prevProps, nextProps) => {
  return (
    prevProps.date === nextProps.date &&
    prevProps.workout === nextProps.workout &&
    prevProps.loading === nextProps.loading
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  text: {
    fontSize: 38,
    fontWeight: "bold",

    color: color.foreground.color,
  },
});
