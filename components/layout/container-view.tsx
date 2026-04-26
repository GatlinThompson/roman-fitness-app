import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSpace from "./bottom-space";

type ContainerViewProps = {
  children?: React.ReactNode;
  bottomSpace?: boolean;
};

export default function ContainerView({
  children,
  bottomSpace = true,
}: ContainerViewProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  return (
    <LinearGradient
      colors={["#09080F", "#1D1013"]}
      style={{ ...styles.background }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.65 }}
      locations={[0.2, 1]}
    >
      <SafeAreaView style={styles.background} edges={["left", "right"]}>
        {children}
        {bottomSpace && <BottomSpace />}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: "100%",
    width: "100%",

    backdropFilter: "blur(20px)",
  },
});
