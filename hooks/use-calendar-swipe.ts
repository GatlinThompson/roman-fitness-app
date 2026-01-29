import { useRef, useState } from "react";
import { Dimensions, PanResponder } from "react-native";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CALENDAR_WIDTH = SCREEN_WIDTH;

export function useCalendarSwipe(
  currentMonth: Date,
  onMonthChange: (newMonth: Date) => void,
) {
  const translateX = useSharedValue(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentMonthRef = useRef(currentMonth);

  currentMonthRef.current = currentMonth;

  const updateToPrevMonth = () => {
    const newMonth = new Date(
      currentMonthRef.current.getFullYear(),
      currentMonthRef.current.getMonth() - 1,
      1,
    );
    onMonthChange(newMonth);
    setIsAnimating(false);
  };

  const updateToNextMonth = () => {
    const newMonth = new Date(
      currentMonthRef.current.getFullYear(),
      currentMonthRef.current.getMonth() + 1,
      1,
    );
    onMonthChange(newMonth);
    setIsAnimating(false);
  };

  const handlePrevMonth = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    translateX.value = withTiming(
      CALENDAR_WIDTH,
      { duration: 300 },
      (finished) => {
        if (finished) {
          translateX.value = 0;
          runOnJS(updateToPrevMonth)();
        }
      },
    );
  };

  const handleNextMonth = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    translateX.value = withTiming(
      -CALENDAR_WIDTH,
      { duration: 300 },
      (finished) => {
        if (finished) {
          translateX.value = 0;
          runOnJS(updateToNextMonth)();
        }
      },
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (isAnimating) return false;
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isAnimating) {
          translateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const SWIPE_THRESHOLD = 50;
        const SWIPE_VELOCITY = 0.5;

        if (
          gestureState.dx < -SWIPE_THRESHOLD ||
          gestureState.vx < -SWIPE_VELOCITY
        ) {
          handleNextMonth();
        } else if (
          gestureState.dx > SWIPE_THRESHOLD ||
          gestureState.vx > SWIPE_VELOCITY
        ) {
          handlePrevMonth();
        } else {
          translateX.value = withTiming(0, { duration: 200 });
        }
      },
    }),
  ).current;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return {
    panResponder,
    animatedStyle,
    handlePrevMonth,
    handleNextMonth,
  };
}
