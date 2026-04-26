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
    <SafeAreaView style={styles.background} edges={["left", "right"]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#161616",
    flex: 1,
    height: "100%",
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 8,
  },
});
