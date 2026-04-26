import { color } from "@/styles/color";
import { font } from "@/styles/fonts";
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
  },
  textSuperset: {
    color: color.secondary.color,
  },
  exercise: {
    fontSize: 24,
    fontFamily: font.montserratBold.fontFamily,
    fontWeight: font.montserratBold.fontWeight,
    marginBottom: 6,
  },
  description: {
    color: color.darkForeground.color,
    fontSize: 16,
    fontFamily: font.montserratSemiBold.fontFamily,
    fontWeight: font.montserratSemiBold.fontWeight,
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
      <Text style={[textStyle, styles.exercise]}>{lift.exercise}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 28,
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
