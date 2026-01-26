import { color } from "@/styles/color";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function GlassContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.glassContainer}>{children}</View>;
}

const styles = StyleSheet.create({
  glassContainer: {
    backgroundColor: color.darkBackground.backgroundColor,
    borderRadius: 4,
    padding: 8,
    boxShadow: color.darkBackground.boxShadow,
    backdropFilter: color.darkBackground.backdropFilter,
    borderWidth: color.darkBackground.borderWidth,
    borderColor: color.darkBackground.borderColor,
    borderBottomColor: color.darkBackground.borderBottomColor,
  },
});
