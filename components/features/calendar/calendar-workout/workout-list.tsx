import { useWorkoutSwipe } from "@/hooks/use-workout-swipe";
import { color } from "@/styles/color";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import WorkoutDay from "./workout-day";

const SLIDE_DISTANCE = 300;
const FADE_START_OPACITY = 0.3;
const ANIMATION_CONFIG = {
  spring: { tension: 80, friction: 12 },
  fade: { duration: 200 },
};

export default function WorkoutList() {
  const selectedDate = useSelector((state: any) => state.calendar.selectedDate);
  const { panResponder } = useWorkoutSwipe();
  const previousDateRef = useRef<string>(selectedDate);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (previousDateRef.current === selectedDate) return;

    const prevDate = new Date(previousDateRef.current + "T00:00:00Z");
    const currDate = new Date(selectedDate + "T00:00:00Z");
    const startPos = currDate > prevDate ? SLIDE_DISTANCE : -SLIDE_DISTANCE;

    slideAnim.setValue(startPos);
    fadeAnim.setValue(FADE_START_OPACITY);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        ...ANIMATION_CONFIG.spring,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...ANIMATION_CONFIG.fade,
      }),
    ]).start();

    previousDateRef.current = selectedDate;
  }, [selectedDate, slideAnim, fadeAnim]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }}
      >
        <WorkoutDay date={selectedDate} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.blackBackground.backgroundColor,
    height: "100%",
    marginHorizontal: -8,
    paddingHorizontal: 16,
    paddingTop: 25,
    borderWidth: 2,
    borderTopColor: color.blackBackground.borderColor,
  },
});
