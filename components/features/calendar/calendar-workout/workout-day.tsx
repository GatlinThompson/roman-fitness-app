import React from "react";
import { StyleSheet, View } from "react-native";
import CalendarWorkout from "./calendar-workout";
import SelectedDate from "./workout-list-selected-date";

type WorkoutDayProps = {
  date: string;
};

/**
 * WorkoutDay - Memoized workout day component
 * Only re-renders when the date prop actually changes
 * This prevents unnecessary re-renders during carousel animations
 */
function WorkoutDay({ date }: WorkoutDayProps) {
  return (
    <View style={styles.container}>
      <SelectedDate date={date} />
      <CalendarWorkout date={date} />
    </View>
  );
}

// Memoize with custom comparison for optimal performance
export default React.memo(WorkoutDay, (prevProps, nextProps) => {
  return prevProps.date === nextProps.date;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
});
