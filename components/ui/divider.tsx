import React from "react";
import { View, ViewStyle } from "react-native";

type DividerProps = {
  style?: ViewStyle;
};
export default function Divider({ style }: DividerProps) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "#2C2A2A",
        marginHorizontal: "auto",
        width: "95%",
        ...style,
      }}
    />
  );
}
