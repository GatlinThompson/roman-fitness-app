import React from "react";
import { StyleSheet, View } from "react-native";
import LiftComponent from "./lift_component";

export type Lift = {
  id: number;
  exercise: string;
  reps: string;
  tempo: string;
};

export default function LiftRow({ lift, last }: { lift: Lift; last: boolean }) {
  return (
    <View style={styles.container}>
      <View style={styles.badge} />
      <LiftComponent lift={lift} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 8,
    height: "100%",
    backgroundColor: "#a72b2b",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
