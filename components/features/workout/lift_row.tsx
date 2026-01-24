import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type Lift = {
  id: number;
  exercise: string;
  reps: string;
  tempo: string;
};

export default function LiftRow({ lift, last }: { lift: Lift; last: boolean }) {
  return (
    <View>
      <Text style={styles.text}>{lift.exercise}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
  },
});
