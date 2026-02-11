import { supabase } from "@/lib/supabase/client";
import {
  clearWorkoutAnimation,
  setTransitionNextDay,
  setTransitonPrevDay,
  updateBufferDates,
} from "@/store/slices/calendar-slices";
import { color } from "@/styles/color";
import { getDateString } from "@/utils/get-today";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ShowMoreToggle from "./show-more-toggle";
import WorkoutDay from "./workout-day";

// Constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY_THRESHOLD = 0.5;
const ANIMATION_DURATION = 250;
const SPRING_CONFIG = { tension: 65, friction: 8 };
const TOGGLE_EXPANDED_HEIGHT = 180;

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
  const baseHeight = useRef(new Animated.Value(0)).current;
  const toggleHeight = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const [layoutHeight, setLayoutHeight] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [prevWorkout, setPrevWorkout] = useState<
    { workout: any[]; id?: number } | undefined
  >(undefined);
  const [prevLoading, setPrevLoading] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<
    { workout: any[]; id?: number } | undefined
  >(undefined);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [nextWorkout, setNextWorkout] = useState<
    { workout: any[]; id?: number } | undefined
  >(undefined);
  const [nextLoading, setNextLoading] = useState(false);
  const workoutCacheRef = useRef<
    Record<string, { workout: any[]; id?: number }>
  >({});
  const fetchTokenRef = useRef(0);

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
      const transitionDate = direction === "next" ? nextDate : prevDate;
      const normalizedTransitionDate = getDateString(transitionDate);
      const transitionWorkout =
        workoutCacheRef.current[normalizedTransitionDate] ??
        (direction === "next" ? nextWorkout : prevWorkout) ??
        selectedWorkout;
      // Slide to target position
      Animated.timing(pan, {
        toValue: targetValue,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        // Update selectedDate (while still off-screen)
        dispatch(transitionAction);
        setSelectedWorkout(transitionWorkout);

        // Reset position and update buffer dates after state completes
        requestAnimationFrame(() => {
          pan.setValue(0);
          // Update buffer dates after pan reset
          dispatch(updateBufferDates());
          isAnimating.current = false;
        });
      });
    },
    [
      dispatch,
      nextDate,
      nextWorkout,
      pan,
      prevDate,
      prevWorkout,
      selectedWorkout,
    ],
  );

  /**
   * Optimized PanResponder with proper gesture detection
   * Memoized to prevent recreation on every render
   */
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          if (isAnimating.current) return false;
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

  const getWorkoutForDate = async (date: string) => {
    // No need for artificial delay, rely on real-time data fetching
    const normalizedDate = getDateString(date);
    console.log("DATE STRING:", normalizedDate);
    console.warn("Fetching workout for date:", normalizedDate);

    const { data, error } = await supabase
      .from("workouts")
      .select("*, workout_lifts(sequence, lift(*, superset(*)))")
      .eq("workout_date", normalizedDate)
      .order("sequence", {
        foreignTable: "workout_lifts",
        ascending: true,
      });

    if (error) {
      return;
    }

    console.warn("Fetched workout data for date:", normalizedDate, data);

    const workoutLifts = data?.[0]?.workout_lifts || [];

    if (data && data.length > 0) {
    }
    return { workout: workoutLifts, id: data?.[0]?.id };
  };

  useEffect(() => {
    const normalizedPrevDate = getDateString(prevDate);
    const normalizedSelectedDate = getDateString(selectedDate);
    const normalizedNextDate = getDateString(nextDate);
    const cachedPrev = workoutCacheRef.current[normalizedPrevDate];
    const cachedSelected = workoutCacheRef.current[normalizedSelectedDate];
    const cachedNext = workoutCacheRef.current[normalizedNextDate];

    // Show cached workouts immediately while fetching fresh data.
    setPrevWorkout(cachedPrev);
    setSelectedWorkout(cachedSelected);
    setNextWorkout(cachedNext);
    setPrevLoading(!cachedPrev);
    setSelectedLoading(!cachedSelected);
    setNextLoading(!cachedNext);

    const fetchToken = (fetchTokenRef.current += 1);

    const loadWorkouts = async () => {
      const [prev, selected, next] = await Promise.all([
        getWorkoutForDate(prevDate),
        getWorkoutForDate(selectedDate),
        getWorkoutForDate(nextDate),
      ]);

      if (fetchTokenRef.current !== fetchToken) return;

      setPrevWorkout(prev);
      setSelectedWorkout(selected);
      setNextWorkout(next);
      setPrevLoading(false);
      setSelectedLoading(false);
      setNextLoading(false);

      if (prev) workoutCacheRef.current[normalizedPrevDate] = prev;
      if (selected) workoutCacheRef.current[normalizedSelectedDate] = selected;
      if (next) workoutCacheRef.current[normalizedNextDate] = next;
    };

    loadWorkouts();
  }, [prevDate, selectedDate, nextDate]);

  /**
   * Memoized workout days for optimal performance
   * Only re-render when dates actually change
   */
  const memoizedPrevDay = useMemo(
    () => (
      <>
        <WorkoutDay
          date={prevDate}
          workout={prevWorkout}
          loading={prevLoading}
        />
      </>
    ),
    [prevDate, prevWorkout, prevLoading],
  );
  const memoizedSelectedDay = useMemo(
    () => (
      <>
        <WorkoutDay
          date={selectedDate}
          workout={selectedWorkout}
          loading={selectedLoading}
        />
      </>
    ),
    [selectedDate, selectedWorkout, selectedLoading],
  );
  const memoizedNextDay = useMemo(
    () => (
      <>
        <WorkoutDay
          date={nextDate}
          workout={nextWorkout}
          loading={nextLoading}
        />
      </>
    ),
    [nextDate, nextWorkout, nextLoading],
  );

  return (
    <Animated.View style={[styles.container]}>
      <ShowMoreToggle />
      <View style={styles.carouselWrapper} {...panResponder.panHandlers}>
        <Animated.View
          style={[styles.carouselContainer, { transform: [{ translateX }] }]}
        >
          <View style={styles.dateContainer}>{memoizedPrevDay}</View>
          <View style={styles.dateContainer}>{memoizedSelectedDay}</View>
          <View style={styles.dateContainer}>{memoizedNextDay}</View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 7,
    backgroundColor: color.blackBackground.backgroundColor,
    marginHorizontal: -8,
    borderWidth: 2,
    borderTopColor: color.blackBackground.borderColor,
    paddingHorizontal: 8,
  },
  carouselWrapper: {
    flex: 1,
    overflow: "hidden",
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
