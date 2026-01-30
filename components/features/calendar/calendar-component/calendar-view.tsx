import { setNextMonth, setPrevMonth } from "@/store/slices/calendar-slices";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

import { useWorkoutDates } from "@/hooks/use-workout-dates";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "./calendar";
import CalendarMonth from "./calendar-month";
import CalendarWeek from "./calendar-week";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // 25% of screen width to trigger swipe

export default function CalendarNew() {
  const currentMonth = useSelector((state: any) => state.calendar.currentMonth);
  const nextMonth = useSelector((state: any) => state.calendar.nextMonth);
  const prevMonth = useSelector((state: any) => state.calendar.prevMonth);
  const dispatch = useDispatch();

  // Fetch workout dates for the current month
  useWorkoutDates();

  const pan = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderGrant: () => {
        if (isAnimating.current) return;
      },
      onPanResponderMove: (_, gestureState) => {
        if (isAnimating.current) return;
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimating.current) return;

        const { dx, vx } = gestureState;

        // Swipe left (next month)
        if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
          isAnimating.current = true;
          Animated.timing(pan, {
            toValue: -SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            dispatch(setNextMonth());
            pan.setValue(0);
            isAnimating.current = false;
          });
        }
        // Swipe right (previous month)
        else if (dx > SWIPE_THRESHOLD || vx > 0.5) {
          isAnimating.current = true;
          Animated.timing(pan, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            dispatch(setPrevMonth());
            pan.setValue(0);
            isAnimating.current = false;
          });
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
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
          style={[
            styles.carouselContainer,
            {
              transform: [{ translateX }],
            },
          ]}
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
});
