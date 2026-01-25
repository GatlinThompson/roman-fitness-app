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
    backgroundColor: "#1c1c1c33",
    borderRadius: 4,
    padding: 8,
    boxShadow: "inset 0 -2px 4px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgb(18, 18, 18)",
    borderBottomColor: "rgb(37, 36, 36)",
  },
});
