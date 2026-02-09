import Spinner from "@/components/ui/spinner";
import { color } from "@/styles/color";
import React, { useEffect, useMemo, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { Lift } from "../../workout/lift_row";
import type { SuperSet } from "../../workout/super_set_row";
import { isSuperSet } from "../../workout/workout";
import CalendarLiftRow from "./calendar-lift-row";
import CalendarSuperSetRow from "./calendar-superset-row";

type WorkoutLift = {
  workout: (Lift | SuperSet)[];
  loading?: boolean;
  dateKey?: string;
};

/**
 * CalendarWorkout - Optimized workout display component
 * Features:
 * - Direct workout rendering without artificial delays
 * - Memoized workout items for optimal performance
 * - Efficient re-rendering on date changes only
 */
function CalendarWorkout({ workout, loading = false, dateKey }: WorkoutLift) {
  const scrollRef = useRef<ScrollView | null>(null);
  /**
   * Memoized workout items to prevent re-renders
   * Only recalculates when workout data changes
   */
  const workoutItems = useMemo(() => {
    if (!workout || workout.length === 0) return null;

    return workout.map((lift: any, index: number) => {
      if (isSuperSet(lift.lift)) {
        return (
          <View key={index}>
            <CalendarSuperSetRow
              superset={lift.lift.superset}
              lift={lift.lift}
            />
          </View>
        );
      }

      return (
        <View key={index}>
          <CalendarLiftRow lift={lift.lift} />
        </View>
      );
    });
  }, [workout]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ y: 0, animated: false });
  }, [workout, dateKey]);

  // Loading state
  if (loading && (!workout || workout.length === 0)) {
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
      ref={scrollRef}
      style={styles.container}
      scrollEnabled={true}
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
