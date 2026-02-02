import { useWorkoutSwipe } from "@/hooks/use-workout-swipe";
import { color } from "@/styles/color";
import { useLayoutEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import WorkoutDay from "./workout-day";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function WorkoutList() {
  const selectedDate = useSelector((state: any) => state.calendar.selectedDate);
  const prevDate = useSelector((state: any) => state.calendar.prevDate);
  const nextDate = useSelector((state: any) => state.calendar.nextDate);
  const { panResponder, pan, fadeAnim, resetAnimating } = useWorkoutSwipe();
  const previousDateRef = useRef<string>(selectedDate);

  // Reset pan after date changes to recenter the carousel
  useLayoutEffect(() => {
    const dateChanged = previousDateRef.current !== selectedDate;

    if (dateChanged) {
      // Reset position and ensure visibility
      pan.setValue(0);
      fadeAnim.setValue(1);
      resetAnimating();

      previousDateRef.current = selectedDate;
    }
  }, [selectedDate, pan, fadeAnim, resetAnimating]);

  const translateX = pan.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [-SCREEN_WIDTH * 2, -SCREEN_WIDTH, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <View style={styles.carouselWrapper} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.carouselContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={[styles.dateContainer, { opacity: 0 }]}>
            <WorkoutDay date={prevDate} />
          </View>
          <Animated.View style={[styles.dateContainer, { opacity: 1 }]}>
            <WorkoutDay date={selectedDate} />
          </Animated.View>
          <View style={[styles.dateContainer, { opacity: 0 }]}>
            <WorkoutDay date={nextDate} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.blackBackground.backgroundColor,
    height: "100%",
    marginHorizontal: -8,
    borderWidth: 2,
    borderTopColor: color.blackBackground.borderColor,
  },
  carouselWrapper: {
    flex: 1,
    overflow: "hidden",
    paddingTop: 25,
  },
  carouselContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 3,
    height: "100%",
  },
  dateContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
  },
});
