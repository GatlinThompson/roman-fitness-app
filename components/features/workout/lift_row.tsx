import React from "react";
import { View } from "react-native";
import LiftComponent from "./lift_component";

export type Lift = {
  id: number;
  exercise: string;
  reps: string;
  tempo: string;
};

export default function LiftRow({ lift, last }: { lift: Lift; last: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <LiftComponent lift={lift} />
    </View>
  );
}
