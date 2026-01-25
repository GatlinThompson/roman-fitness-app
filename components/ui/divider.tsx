import React from "react";
import { View, ViewStyle } from "react-native";

type DividerProps = {
  style?: ViewStyle;
};
export default function Divider({ style }: DividerProps) {
  return (
    <View
      style={{
        height: 2,
        backgroundColor: "#100f0f",
        marginHorizontal: "auto",
        boxShadow: "0 1px 1px rgb(45, 45, 45)",
        width: "95%",
        ...style,
      }}
    />
  );
}
