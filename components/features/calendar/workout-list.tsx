import GlassContainer from "@/components/ui/glass-container";
import Spinner from "@/components/ui/spinner";
import { color } from "@/styles/color";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { Lift } from "../workout/lift_row";
import LiftRow from "../workout/lift_row";

type SuperSet = {
  superset: Lift[];
};

type WorkoutListProps = {
  workout: (Lift | SuperSet)[];
  loading: boolean;
  selectedDate: Date;
};

export default function WorkoutList({
  workout,
  loading,
  selectedDate,
}: WorkoutListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Spinner />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </View>
    );
  }

  if (!workout || workout.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No workout scheduled</Text>
          <Text style={styles.emptySubtext}>
            Rest day or no workout assigned for this date
          </Text>
        </View>
      </View>
    );
  }

  // Group lifts by sequence (for supersets)
  const groupedLifts: { sequence: number; lifts: (Lift | SuperSet)[] }[] = [];
  let currentSequence: { sequence: number; lifts: (Lift | SuperSet)[] } | null =
    null;

  workout.forEach((liftData: any) => {
    const sequence = liftData.sequence;
    const lift = liftData.lift;

    if (!currentSequence || currentSequence.sequence !== sequence) {
      currentSequence = { sequence, lifts: [] };
      groupedLifts.push(currentSequence);
    }

    currentSequence.lifts.push(lift);
  });

  return (
    <View style={styles.container}>
      {/* Date Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <Text style={styles.workoutCount}>
          {groupedLifts.length}{" "}
          {groupedLifts.length === 1 ? "exercise" : "exercises"}
        </Text>
      </View>

      {/* Workout List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {groupedLifts.map((group, index) => {
          const isLastGroup = index === groupedLifts.length - 1;

          if (group.lifts.length > 1) {
            // SuperSet
            const superSetData: SuperSet = {
              superset: group.lifts.map((lift: any) => ({
                id: lift.id,
                exercise: lift.exercise,
                reps: lift.reps,
                tempo: lift.tempo,
              })),
            };

            return (
              <View key={`group-${group.sequence}-${index}`}>
                <GlassContainer>a</GlassContainer>
                {!isLastGroup && <View style={styles.exerciseGap} />}
              </View>
            );
          } else {
            // Single Lift
            const lift = group.lifts[0] as Lift;
            return (
              <View key={`group-${group.sequence}-${index}`}>
                <GlassContainer>
                  <LiftRow lift={lift} last={isLastGroup} />
                </GlassContainer>
                {!isLastGroup && <View style={styles.exerciseGap} />}
              </View>
            );
          }
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 16,
  },
  dateText: {
    color: color.darkForeground.color,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  workoutCount: {
    color: color.darkForeground.color,
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  exerciseGap: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: color.darkForeground.color,
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 60,
  },
  emptyText: {
    color: color.darkForeground.color,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: color.darkForeground.color,
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
});
