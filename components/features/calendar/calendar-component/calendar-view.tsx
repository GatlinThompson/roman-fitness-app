import { useRef } from "react";
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

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function CalendarNew() {
  const prevMonth = useSelector((state: any) => state.calendar.prevMonth);
  const currentMonth = useSelector((state: any) => state.calendar.currentMonth);
  const nextMonth = useSelector((state: any) => state.calendar.nextMonth);

  const pan = useRef(new Animated.Value(0)).current;

  const isAnimating = useRef(false);

  // ✅ NEW: temporarily disable swipe input
  const swipeDisabled = useRef(false);
  const disableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerSession = 250;
  const dispatch = useDispatch();

  useWorkoutDates();

  const disableSwipeFor = (ms: number) => {
    swipeDisabled.current = true;
    if (disableTimerRef.current) clearTimeout(disableTimerRef.current);

    disableTimerRef.current = setTimeout(() => {
      swipeDisabled.current = false;
      disableTimerRef.current = null;
    }, ms);
  };

  const seeMonths = () => {
    console.log("Prev Month:", prevMonth);
    console.log("Current Month:", currentMonth);
    console.log("Next Month:", nextMonth);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (swipeDisabled.current || isAnimating.current) return false;

        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },

      onPanResponderMove: (_, gestureState) => {
        if (swipeDisabled.current || isAnimating.current) return;
        pan.setValue(gestureState.dx);
      },

      onPanResponderRelease: (_, gestureState) => {
        if (swipeDisabled.current || isAnimating.current) return;

        const { dx, vx } = gestureState;

        // Swipe left -> next month
        if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
          isAnimating.current = true;

          Animated.timing(pan, {
            toValue: -SCREEN_WIDTH,
            duration: timerSession,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (!finished) return;

            dispatch(setTransitionNextMonth());
            isAnimating.current = false;

            disableSwipeFor(timerSession / 10);
            setTimeout(() => {
              pan.setValue(0);
              dispatch(setNextMonth());
              seeMonths();
            }, timerSession);
          });
        }
        // Swipe right -> prev month
        else if (dx > SWIPE_THRESHOLD || vx > 0.5) {
          isAnimating.current = true;

          Animated.timing(pan, {
            toValue: SCREEN_WIDTH,
            duration: timerSession,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (!finished) return;

            dispatch(setTransitionPrevMonth());
            isAnimating.current = false;

            disableSwipeFor(timerSession / 10);
            setTimeout(() => {
              pan.setValue(0);
              dispatch(setPrevMonth());
              seeMonths();
            }, timerSession);
          });
        }
        // Snap back
        else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 8,
          }).start(() => {
            // optional: brief lock even on snap-back
            // disableSwipeFor(250);
          });
        }
      },
    }),
  ).current;

  const translateX = pan.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [-SCREEN_WIDTH * 2, -SCREEN_WIDTH, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <CalendarMonth month={currentMonth} />
      <CalendarWeek />

      <View style={styles.carouselWrapper} {...panResponder.panHandlers}>
        <Animated.View
          style={[styles.carouselContainer, { transform: [{ translateX }] }]}
        >
          <View style={styles.monthContainer}>
            <Calendar month={prevMonth} />
          </View>
          <View style={styles.monthContainer}>
            <Calendar month={currentMonth} />
          </View>
          <View style={styles.monthContainer}>
            <Calendar month={nextMonth} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
