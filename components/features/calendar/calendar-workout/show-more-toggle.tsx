import { useRef } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

type ShowMoreToggleProps = {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
};

const SWIPE_THRESHOLD = 20;

export default function ShowMoreToggle({
  onSwipeUp,
  onSwipeDown,
}: ShowMoreToggleProps) {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy, dx }) =>
        Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5,
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -SWIPE_THRESHOLD) onSwipeUp?.();
        else if (dy > SWIPE_THRESHOLD) onSwipeDown?.();
      },
    }),
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.handle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
  },
  handle: {
    height: 9,
    width: 104,
    backgroundColor: "#E0E0E0",
    borderBottomRightRadius: 122,
    borderBottomLeftRadius: 122,
    alignSelf: "center",
  },
});
