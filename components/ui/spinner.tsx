import { color } from "@/styles/color";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function Spinner({ size = 40 }: { size?: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 10,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    borderColor: "transparent",
    borderTopColor: color.foreground.color,
    borderRightColor: color.foreground.color,
    borderBottomColor: color.foreground.color,
    borderStyle: "solid",
  },
});
