import { color } from "@/styles/color";
import React from "react";
import { StyleSheet, View } from "react-native";
import LiftComponent from "./lift_component";
import { Lift } from "./lift_row";

export type SuperSet = {
  id: number;
  lift: Lift;
  superset: Lift;
};

export default function SuperSetRow({
  lift,
  superset,
  last,
}: {
  lift: Lift;
  superset: Lift;
  last: boolean;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.badge} />

      <View
        style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}
      >
        <LiftComponent lift={lift} />
        <LiftComponent lift={superset} superset={true} />
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
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badge: {
    width: 8,
    height: "100%",
    backgroundColor: "#a72b2b",
  },
  supersetBadge: {
    color: color.primary.color,
    fontWeight: "bold",
    fontSize: 18,
  },
});
