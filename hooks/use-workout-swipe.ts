import { setNextDate, setPrevDate } from "@/store/slices/calendar-slices";
import { useRef } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";
import { useDispatch } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export function useWorkoutSwipe() {
  const dispatch = useDispatch();
  const isAnimating = useRef(false);
  const pan = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          !isAnimating.current &&
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

        // Swipe left -> next day
        if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
          isAnimating.current = true;

          Animated.parallel([
            Animated.timing(pan, {
              toValue: -SCREEN_WIDTH,
              duration: 280,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            dispatch(setNextDate());
          });
        }
        // Swipe right -> previous day
        else if (dx > SWIPE_THRESHOLD || vx > 0.5) {
          isAnimating.current = true;

          Animated.parallel([
            Animated.timing(pan, {
              toValue: SCREEN_WIDTH,
              duration: 280,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            dispatch(setPrevDate());
          });
        }
        // Snap back if threshold not met
        else {
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

  const resetAnimating = () => {
    isAnimating.current = false;
  };

  return {
    panResponder,
    pan,
    fadeAnim,
    resetAnimating,
  };
}
