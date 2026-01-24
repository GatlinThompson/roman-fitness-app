import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
    <View>
      <Text style={styles.text}>{lift.exercise}</Text>
      <Text style={styles.text}>Superset with: {superset.exercise}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
});
