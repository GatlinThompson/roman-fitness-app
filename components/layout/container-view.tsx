import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ContainerViewProps = {
  children?: React.ReactNode;
};

export default function ContainerView({ children }: ContainerViewProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  return (
    <LinearGradient
      colors={["#140505", "#0d0b10", "#280f0f"]}
      style={{ ...styles.background }}
      start={{ x: 0, y: 0.25 }}
      end={{ x: 1, y: 1 }}
      locations={[0.0, 0.45, 1]}
    >
      <SafeAreaView style={styles.background} edges={["top", "left", "right"]}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: "100%",
    width: "100%",
    paddingTop: 4,
  },
});
