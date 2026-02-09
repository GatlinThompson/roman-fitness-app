import { color } from "@/styles/color";
import React from "react";
import { View } from "react-native";
import CalendarLiftComponent from "./calendar-lift-component";

export type Lift = {
  id: number;
  exercise: string;
  reps: string;
  tempo: string;
};

export default function CalendarLiftRow({ lift }: { lift: Lift }) {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        gap: 12,
      }}
    >
      <View
        style={{
          backgroundColor: color.foreground.color,
          height: "100%",
          width: 4,
        }}
      />
      <CalendarLiftComponent lift={lift} />
    </View>
  );
}

const styles = {
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 12,
  },
};
