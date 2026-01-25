import { color } from "@/styles/color";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Lift = {
  id: number;
  exercise: string;
  reps: string;
  tempo: string;
};

const styles = StyleSheet.create({
  text: {
    color: color.foreground.color,
    fontSize: 18,
    fontWeight: "bold",
  },
  textSuperset: {
    color: color.secondary.color,
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: color.darkForeground.color,
    fontSize: 18,
  },
});

export default function LiftComponent({
  lift,
  superset = false,
}: {
  lift: Lift;
  superset?: boolean;
}) {
  const textStyle = superset ? styles.textSuperset : styles.text;

  return (
    <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Text style={textStyle}>{lift.exercise}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
        }}
      >
        <Text style={styles.description}>
          Reps: <Text style={textStyle}>{lift.reps}</Text>
        </Text>
        <Text style={styles.description}>
          Tempo:
          <Text style={textStyle}> {lift.tempo ? lift.tempo : "-"}</Text>
        </Text>
      </View>
    </View>
  );
}
