import { Lift } from "@/components/features/workout/lift_row";
import { color } from "@/styles/color";
import React from "react";
import { StyleSheet, View } from "react-native";
import CalendarLiftComponent from "./calendar-lift-component";

export type SuperSet = {
  id: number;
  lift: Lift;
  superset: Lift;
};

export default function CalendarSuperSetRow({
  lift,
  superset,
}: {
  lift: Lift;
  superset: Lift;
}) {
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: color.secondary.color,
          height: "100%",
          width: 4,
        }}
      />
      <View
        style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}
      >
        <CalendarLiftComponent lift={lift} superset={true} />
        <CalendarLiftComponent lift={superset} superset={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: color.foreground.color,
    fontSize: 18,
    fontWeight: "500",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  supersetBadge: {
    color: color.primary.color,
    fontWeight: "bold",
    fontSize: 18,
  },
});
