import { color } from "@/styles/color";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
  console.log("Rendering superset:", { superset });
  return (
    <View style={styles.container}>
      <Text style={styles.supersetBadge}>SS</Text>

      <View
        style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}
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
  supersetBadge: {
    color: color.primary.color,
    fontWeight: "bold",
    fontSize: 18,
  },
});
