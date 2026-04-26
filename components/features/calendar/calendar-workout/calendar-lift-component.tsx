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
  description: {
    color: color.darkForeground.color,
    fontFamily: font.montserratRegular.fontFamily,
    fontWeight: font.montserratRegular.fontWeight,
    fontSize: 12,
  },
  exercise: {
    fontSize: 16,
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
  },
});

export default function CalendarLiftComponent({
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
