import { setNextDate, setPrevDate } from "@/store/slices/calendar-slices";
import { useRef } from "react";
import { Dimensions, PanResponder } from "react-native";
import { useDispatch } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export function useWorkoutSwipe() {
  const dispatch = useDispatch();
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
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimating.current) return;

        const { dx, vx } = gestureState;

        // Swipe left -> next day
        if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
          isAnimating.current = true;
          dispatch(setNextDate());
          setTimeout(() => {
            isAnimating.current = false;
          }, 300);
        }
        // Swipe right -> previous day
        else if (dx > SWIPE_THRESHOLD || vx > 0.5) {
          isAnimating.current = true;
          dispatch(setPrevDate());
          setTimeout(() => {
            isAnimating.current = false;
          }, 300);
        }
      },
    }),
  ).current;

  return {
    panResponder,
  };
}
