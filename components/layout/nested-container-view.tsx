import { color } from "@/styles/color";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NestedContainerViewProps = {
  children?: React.ReactNode;
};

export default function NestedContainerView({
  children,
}: NestedContainerViewProps) {
  return (
    <SafeAreaView style={styles.background} edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: color.nested.color,
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
