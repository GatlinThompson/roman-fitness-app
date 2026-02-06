import Divider from "@/components/ui/divider";
import Spinner from "@/components/ui/spinner";
import { useRealtimeWorkout } from "@/hooks/use-real-time-workout";
import { color } from "@/styles/color";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LiftRow from "../../workout/lift_row";
import SuperSetRow from "../../workout/super_set_row";
import { isSuperSet } from "../../workout/workout";

type WorkoutLift = {
  date: string;
};

/**
 * CalendarWorkout - Optimized workout display component
 * Features:
 * - Direct workout rendering without artificial delays
 * - Memoized workout items for optimal performance
 * - Efficient re-rendering on date changes only
 */
function CalendarWorkout({ date }: WorkoutLift) {
  const { workout, loading } = useRealtimeWorkout({
    workout_date: date,
  });

  /**
   * Memoized workout items to prevent re-renders
   * Only recalculates when workout data changes
   */
  const workoutItems = useMemo(() => {
    if (!workout || workout.length === 0) return null;

    return workout.map((lift: any, index: number) => {
      const isLast = index === workout.length - 1;
      const showDivider = !isLast;

      if (isSuperSet(lift.lift)) {
        return (
          <View key={`${date}-${index}`}>
            <SuperSetRow
              superset={lift.lift.superset}
              lift={lift.lift}
              last={isLast}
            />
            {showDivider && <Divider style={styles.dividerLarge} />}
          </View>
        );
      }

      return (
        <View key={`${date}-${index}`}>
          <LiftRow lift={lift.lift} last={isLast} />
          {showDivider && <Divider style={styles.dividerSmall} />}
        </View>
      );
    });
  }, [workout, date]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Spinner />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Empty state
  if (!workout || workout.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No workouts scheduled for this date
        </Text>
      </View>
    );
  }

  // Workout display
  return (
    <ScrollView
      style={styles.container}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      {workoutItems}
    </ScrollView>
  );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(CalendarWorkout);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  dividerLarge: {
    marginVertical: 8,
  },
  dividerSmall: {
    marginVertical: 4,
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
