import React, { useCallback, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

import { useWorkoutDates } from "@/hooks/use-workout-dates";
import {
  setNextMonth,
  setPrevMonth,
  setTransitionNextMonth,
  setTransitionPrevMonth,
} from "@/store/slices/calendar-slices";
import { color } from "@/styles/color";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "./calendar";
import CalendarMonth from "./calendar-month";
import CalendarWeek from "./calendar-week";

// Constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY_THRESHOLD = 0.5;
const ANIMATION_DURATION = 250;
const SPRING_CONFIG = { tension: 65, friction: 8 };
const EASING = Easing.out(Easing.cubic);

// Types
interface CalendarState {
  prevMonth: string;
  currentMonth: string;
  nextMonth: string;
}

type SwipeDirection = "next" | "prev";

/**
 * CalendarView - Elite carousel component for month navigation
 * Features:
 * - Memoized calendar components for optimal rendering
 * - Gesture-based navigation with proper animation sequencing
 * - Seamless state updates using Animated.sequence
 * - Optimized PanResponder with animation locks
 */
export default function CalendarNew() {
  // Redux selectors with proper typing
  const { prevMonth, currentMonth, nextMonth } = useSelector(
    (state: { calendar: CalendarState }) => state.calendar,
  );

  // Refs for animation state
  const pan = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const dispatch = useDispatch();

  // Load workout dates for calendar highlighting
  useWorkoutDates();

  /**
   * Executes swipe animation and state update atomically
   * Updates state BEFORE resetting position to prevent flash on Android
   */
  const executeSwipe = useCallback(
    (direction: SwipeDirection) => {
      isAnimating.current = true;
      const targetValue = direction === "next" ? -SCREEN_WIDTH : SCREEN_WIDTH;
      const transitionAction =
        direction === "next"
          ? setTransitionNextMonth()
          : setTransitionPrevMonth();
      const updateAction =
        direction === "next" ? setNextMonth() : setPrevMonth();

      // Slide to target position
      Animated.timing(pan, {
        toValue: targetValue,
        duration: ANIMATION_DURATION,
        easing: EASING,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        // Update state FIRST (while still off-screen)
        dispatch(transitionAction);
        dispatch(updateAction);

        // Then reset position after state update completes
        requestAnimationFrame(() => {
          pan.setValue(0);
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

          // Swipe left -> next month
          if (dx < -SWIPE_THRESHOLD || vx < -SWIPE_VELOCITY_THRESHOLD) {
            executeSwipe("next");
          }
          // Swipe right -> previous month
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
   * Memoized calendar months for optimal performance
   * Only re-render when months actually change
   */
  const memoizedPrevCalendar = useMemo(
    () => <Calendar month={prevMonth} />,
    [prevMonth],
  );
  const memoizedCurrentCalendar = useMemo(
    () => <Calendar month={currentMonth} />,
    [currentMonth],
  );
  const memoizedNextCalendar = useMemo(
    () => <Calendar month={nextMonth} />,
    [nextMonth],
  );

  return (
    <View style={styles.container}>
      <CalendarMonth month={currentMonth} />
      <CalendarWeek />

      <View style={styles.carouselWrapper} {...panResponder.panHandlers}>
        <Animated.View
          style={[styles.carouselContainer, { transform: [{ translateX }] }]}
        >
          <View style={styles.monthContainer}>{memoizedPrevCalendar}</View>
          <View style={styles.monthContainer}>{memoizedCurrentCalendar}</View>
          <View style={styles.monthContainer}>{memoizedNextCalendar}</View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    paddingHorizontal: 8,
  },
  carouselWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  carouselContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 3,
  },
  monthContainer: {
    width: SCREEN_WIDTH,
  },
  text: {
    color: color.foreground.color,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
});
