import { getWorkoutDatesForMonth } from "@/lib/supabase/queries";
import { setWorkoutDates } from "@/store/slices/calendar-slices";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Custom hook to fetch and update workout dates for three months (prev, current, next)
 * Automatically fetches when the current month changes
 */
export function useWorkoutDates() {
  const dispatch = useDispatch();
  const currentMonth = useSelector((state: any) => state.calendar.currentMonth);
  const prevMonth = useSelector((state: any) => state.calendar.prevMonth);
  const nextMonth = useSelector((state: any) => state.calendar.nextMonth);
  const workoutDates = useSelector((state: any) => state.calendar.workoutDates);

  useEffect(() => {
    async function fetchWorkoutDates() {
      if (!currentMonth || !prevMonth || !nextMonth) return;

      // Parse all three months
      const [currentYear, currentMonthNum] = currentMonth
        .split("-")
        .map(Number);
      const [prevYear, prevMonthNum] = prevMonth.split("-").map(Number);
      const [nextYear, nextMonthNum] = nextMonth.split("-").map(Number);

      // Fetch workout dates for all three months in parallel
      const [prevDates, currentDates, nextDates] = await Promise.all([
        getWorkoutDatesForMonth(prevYear, prevMonthNum),
        getWorkoutDatesForMonth(currentYear, currentMonthNum),
        getWorkoutDatesForMonth(nextYear, nextMonthNum),
      ]);

      // Combine all dates from the three months
      const allDates = [...prevDates, ...currentDates, ...nextDates];
      dispatch(setWorkoutDates(allDates));
    }

    fetchWorkoutDates();
  }, [currentMonth, prevMonth, nextMonth, dispatch]);

  return workoutDates;
}
