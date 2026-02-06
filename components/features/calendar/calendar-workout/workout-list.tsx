import {
  clearWorkoutAnimation,
  setTransitionNextDay,
  setTransitonPrevDay,
  updateBufferDates,
} from "@/store/slices/calendar-slices";
import { color } from "@/styles/color";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import WorkoutDay from "./workout-day";

// Constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY_THRESHOLD = 0.5;
const ANIMATION_DURATION = 250;
const SPRING_CONFIG = { tension: 65, friction: 8 };

// Types
interface CalendarState {
  selectedDate: string;
  prevDate: string;
  nextDate: string;
  shouldAnimateWorkout: boolean;
  workoutAnimationDirection: "left" | "right" | null;
}

type SwipeDirection = "next" | "prev";

/**
 * WorkoutList - Elite carousel component for workout navigation
 * Features:
 * - Memoized workout day components for optimal rendering
 * - Gesture-based navigation with proper animation sequencing
 * - Seamless state updates using Animated.sequence
 * - Optimized PanResponder with animation locks
 */
export default function WorkoutList() {
  // Redux selectors with proper typing
  const {
    selectedDate,
    prevDate,
    nextDate,
    shouldAnimateWorkout,
    workoutAnimationDirection,
  } = useSelector((state: { calendar: CalendarState }) => state.calendar);

  // Refs for animation state
  const pan = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const dispatch = useDispatch();

  /**
   * Calendar-triggered animation handler
   * Updates state before resetting to prevent flash
   */
  useEffect(() => {
    if (
      !shouldAnimateWorkout ||
      !workoutAnimationDirection ||
      isAnimating.current
    ) {
      return;
    }

    isAnimating.current = true;
    const targetValue =
      workoutAnimationDirection === "left" ? -SCREEN_WIDTH : SCREEN_WIDTH;

    // Slide to target position
    Animated.timing(pan, {
      toValue: targetValue,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      // Reset position after animation completes
      requestAnimationFrame(() => {
        pan.setValue(0);
        isAnimating.current = false;
        dispatch(clearWorkoutAnimation());
      });
    });
  }, [shouldAnimateWorkout, workoutAnimationDirection, pan, dispatch]);

  /**
   * Executes swipe animation and state update atomically
   * Buffer dates update after animation completes to prevent flashing
   */
  const executeSwipe = useCallback(
    (direction: SwipeDirection) => {
      isAnimating.current = true;
      const targetValue = direction === "next" ? -SCREEN_WIDTH : SCREEN_WIDTH;
      const transitionAction =
        direction === "next" ? setTransitionNextDay() : setTransitonPrevDay();

      // Slide to target position
      Animated.timing(pan, {
        toValue: targetValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        // Update selectedDate (while still off-screen)
        dispatch(transitionAction);

        // Reset position and update buffer dates after state completes
        requestAnimationFrame(() => {
          pan.setValue(0);
          // Update buffer dates after pan reset
          dispatch(updateBufferDates());
          isAnimating.current = false;
        });
      });
    },
    [dispatch, pan],
  );

  /**
   * Optimized PanResponder with proper gesture detection
   * Memoized to prevent recreation on every render
   */
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (isAnimating.current) return false;
          // Detect horizontal swipe with minimum threshold
          return (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.dx) > 10
          );
        },
        onPanResponderMove: (_, gestureState) => {
          if (isAnimating.current) return;
          pan.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (isAnimating.current) return;

          const { dx, vx } = gestureState;

          // Swipe left -> next date
          if (dx < -SWIPE_THRESHOLD || vx < -SWIPE_VELOCITY_THRESHOLD) {
            executeSwipe("next");
          }
          // Swipe right -> previous date
          else if (dx > SWIPE_THRESHOLD || vx > SWIPE_VELOCITY_THRESHOLD) {
            executeSwipe("prev");
          }
          // Snap back if threshold not met
          else {
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: true,
              ...SPRING_CONFIG,
            }).start();
          }
        },
      }),
    [executeSwipe, pan],
  );

  /**
   * Memoized transform interpolation
   * Prevents recreation on every render
   */
  const translateX = useMemo(
    () =>
      pan.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [-SCREEN_WIDTH * 2, -SCREEN_WIDTH, 0],
        extrapolate: "clamp",
      }),
    [pan],
  );

  /**
   * Memoized workout days for optimal performance
   * Only re-render when dates actually change
   */
  const memoizedPrevDay = useMemo(
    () => <WorkoutDay date={prevDate} />,
    [prevDate],
  );
  const memoizedSelectedDay = useMemo(
    () => <WorkoutDay date={selectedDate} />,
    [selectedDate],
  );
  const memoizedNextDay = useMemo(
    () => <WorkoutDay date={nextDate} />,
    [nextDate],
  );

  return (
    <View style={styles.container}>
      <View style={styles.carouselWrapper} {...panResponder.panHandlers}>
        <Animated.View
          style={[styles.carouselContainer, { transform: [{ translateX }] }]}
        >
          <View style={styles.dateContainer}>{memoizedPrevDay}</View>
          <View style={styles.dateContainer}>{memoizedSelectedDay}</View>
          <View style={styles.dateContainer}>{memoizedNextDay}</View>
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
