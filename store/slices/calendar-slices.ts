import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CalendarState {
  selectedDate: string; // ISO date string (YYYY-MM-DD)
  prevDate: string;
  nextDate: string;
  workoutDates: string[]; // Array of dates with scheduled workouts
  currentMonth: string;
  prevMonth: string;
  nextMonth: string;
  transitionMonth: string | null;
  transitionDate: string | null;
  shouldAnimateWorkout: boolean;
  workoutAnimationDirection: "left" | "right" | null;
  nextWorkout: { workout: any[]; id?: number } | undefined;
  prevWorkout: { workout: any[]; id?: number } | undefined;
  currentWorkout: { workout: any[]; id?: number } | undefined;
  transitionWorkout: { workout: any[]; id?: number } | undefined;
}

const formatDateLocal = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

const getTodayString = (): string => {
  return formatDateLocal(new Date());
};

const getCurrentMonth = (): string => {
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return formatDateLocal(currentMonth);
};

const getPreviousMonth = (): string => {
  const today = new Date();
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return formatDateLocal(prevMonth);
};
const getNextMonth = (): string => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return formatDateLocal(nextMonth);
};

const getPrevDateString = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  return formatDateLocal(prevDay);
};

const getNextDateString = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return formatDateLocal(nextDay);
};

const todayString = getTodayString();

const initialState: CalendarState = {
  selectedDate: todayString,
  prevDate: getPrevDateString(todayString),
  nextDate: getNextDateString(todayString),
  workoutDates: [],
  currentMonth: getCurrentMonth(),
  prevMonth: getPreviousMonth(),
  nextMonth: getNextMonth(),
  transitionMonth: getCurrentMonth(),
  transitionDate: todayString,
  shouldAnimateWorkout: false,
  workoutAnimationDirection: null,
  nextWorkout: undefined,
  prevWorkout: undefined,
  currentWorkout: undefined,
  transitionWorkout: undefined,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      const previousDate = new Date(state.selectedDate + "T00:00:00");
      const newDate = new Date(action.payload + "T00:00:00");
      const currentMonthDate = new Date(state.currentMonth + "T00:00:00");

      // Calendar clicks should not trigger the workout slide animation
      state.shouldAnimateWorkout = false;
      state.workoutAnimationDirection = null;

      const newDateString = formatDateLocal(newDate);
      state.selectedDate = newDateString;
      state.prevDate = getPrevDateString(newDateString);
      state.nextDate = getNextDateString(newDateString);

      // Update currentMonth if selected date is in a different month
      if (
        newDate.getMonth() !== currentMonthDate.getMonth() ||
        newDate.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        const newMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        const newPrevMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() - 1,
          1,
        );
        const newNextMonth = new Date(
          newDate.getFullYear(),
          newDate.getMonth() + 1,
          1,
        );

        state.transitionMonth = state.currentMonth;
        state.currentMonth = formatDateLocal(newMonth);
        state.prevMonth = formatDateLocal(newPrevMonth);
        state.nextMonth = formatDateLocal(newNextMonth);
      }
    },
    setCurrentMonth: (state, action: PayloadAction<string>) => {
      state.currentMonth = action.payload;
    },
    setWorkoutDates: (state, action: PayloadAction<string[]>) => {
      state.workoutDates = action.payload;
    },
    setTransitionPrevMonth: (state) => {
      state.transitionMonth = state.currentMonth;
      state.currentMonth = state.prevMonth;

      // Update selectedDate to first of new month (or today if current month)
      const newCurrentMonth = new Date(state.currentMonth + "T00:00:00");
      state.selectedDate = formatDateLocal(newCurrentMonth);

      const today = new Date();
      const isTodayInNewMonth =
        today.getMonth() === newCurrentMonth.getMonth() &&
        today.getFullYear() === newCurrentMonth.getFullYear();
      if (isTodayInNewMonth) {
        state.selectedDate = getTodayString();
      }

      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);
    },
    setTransitionNextMonth: (state) => {
      state.transitionMonth = state.currentMonth;
      state.currentMonth = state.nextMonth;

      // Update selectedDate to first of new month (or today if current month)
      const newCurrentMonth = new Date(state.currentMonth + "T00:00:00");
      state.selectedDate = formatDateLocal(newCurrentMonth);

      const today = new Date();
      const isTodayInNewMonth =
        today.getMonth() === newCurrentMonth.getMonth() &&
        today.getFullYear() === newCurrentMonth.getFullYear();
      if (isTodayInNewMonth) {
        state.selectedDate = getTodayString();
      }

      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);
    },
    setPrevMonth: (state) => {
      const current = state.currentMonth;

      const [year, month] = current.split("-").map(Number);
      const newPrevMonth = new Date(year, month - 2, 1);
      const currentMonth = new Date(year, month - 1, 1);
      const newNextMonth = new Date(year, month, 1);
      state.currentMonth = formatDateLocal(currentMonth);
      state.prevMonth = formatDateLocal(newPrevMonth);
      state.nextMonth = formatDateLocal(newNextMonth);

      const today = new Date();
      const isTodayInNewMonth =
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear();
      if (isTodayInNewMonth) {
        state.selectedDate = getTodayString();
      }
      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);
    },
    setNextMonth: (state) => {
      const current = state.currentMonth;
      const [year, month] = current.split("-").map(Number);
      const newPrevMonth = new Date(year, month - 2, 1);
      const currentMonth = new Date(year, month - 1, 1);
      const newNextMonth = new Date(year, month, 1);
      state.currentMonth = formatDateLocal(currentMonth);
      state.prevMonth = formatDateLocal(newPrevMonth);
      state.nextMonth = formatDateLocal(newNextMonth);

      const today = new Date();
      const isTodayInNewMonth =
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear();
      if (isTodayInNewMonth) {
        state.selectedDate = getTodayString();
      }
      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);
    },
    setTransitonPrevDay: (state) => {
      state.transitionDate = state.selectedDate;
      state.selectedDate = state.prevDate;

      // Update month if crossing month boundary
      const selectedDateObj = new Date(state.selectedDate + "T00:00:00");
      const currentMonthDate = new Date(state.currentMonth + "T00:00:00");
      if (
        selectedDateObj.getMonth() !== currentMonthDate.getMonth() ||
        selectedDateObj.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        const newMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth(),
          1,
        );
        const newPrevMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() - 1,
          1,
        );
        const newNextMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() + 1,
          1,
        );
        state.transitionMonth = state.currentMonth;
        state.currentMonth = formatDateLocal(newMonth);
        state.prevMonth = formatDateLocal(newPrevMonth);
        state.nextMonth = formatDateLocal(newNextMonth);
      }

      state.shouldAnimateWorkout = false;
      state.workoutAnimationDirection = null;
    },
    setTransitionNextDay: (state) => {
      state.transitionDate = state.selectedDate;
      state.selectedDate = state.nextDate;

      // Update month if crossing month boundary
      const selectedDateObj = new Date(state.selectedDate + "T00:00:00");
      const currentMonthDate = new Date(state.currentMonth + "T00:00:00");
      if (
        selectedDateObj.getMonth() !== currentMonthDate.getMonth() ||
        selectedDateObj.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        const newMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth(),
          1,
        );
        const newPrevMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() - 1,
          1,
        );
        const newNextMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() + 1,
          1,
        );
        state.transitionMonth = state.currentMonth;
        state.currentMonth = formatDateLocal(newMonth);
        state.prevMonth = formatDateLocal(newPrevMonth);
        state.nextMonth = formatDateLocal(newNextMonth);
      }

      state.shouldAnimateWorkout = false;
      state.workoutAnimationDirection = null;
    },
    clearWorkoutAnimation: (state) => {
      state.shouldAnimateWorkout = false;
      state.workoutAnimationDirection = null;
    },
    updateBufferDates: (state) => {
      // Update buffer dates based on current selectedDate
      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);
    },
    setPrevDate: (state) => {
      // Only update the buffer dates - selectedDate is already updated by setTransitonPrevDay
      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);

      // Update month if crossing month boundary
      const selectedDateObj = new Date(state.selectedDate + "T00:00:00");
      const currentMonthDate = new Date(state.currentMonth + "T00:00:00");
      if (
        selectedDateObj.getMonth() !== currentMonthDate.getMonth() ||
        selectedDateObj.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        const newMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth(),
          1,
        );
        const newPrevMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() - 1,
          1,
        );
        const newNextMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() + 1,
          1,
        );

        state.transitionMonth = state.currentMonth;
        state.currentMonth = formatDateLocal(newMonth);
        state.prevMonth = formatDateLocal(newPrevMonth);
        state.nextMonth = formatDateLocal(newNextMonth);
      }
    },
    setNextDate: (state) => {
      // Only update the buffer dates - selectedDate is already updated by setTransitionNextDay
      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);

      // Update month if crossing month boundary
      const selectedDateObj = new Date(state.selectedDate + "T00:00:00");
      const currentMonthDate = new Date(state.currentMonth + "T00:00:00");
      if (
        selectedDateObj.getMonth() !== currentMonthDate.getMonth() ||
        selectedDateObj.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        const newMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth(),
          1,
        );
        const newPrevMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() - 1,
          1,
        );
        const newNextMonth = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth() + 1,
          1,
        );

        state.transitionMonth = state.currentMonth;
        state.currentMonth = formatDateLocal(newMonth);
        state.prevMonth = formatDateLocal(newPrevMonth);
        state.nextMonth = formatDateLocal(newNextMonth);
      }
    },
  },
});

export const {
  setSelectedDate,
  setCurrentMonth,
  setPrevMonth,
  setNextMonth,
  setPrevDate,
  setNextDate,
  setWorkoutDates,
  setTransitionPrevMonth,
  setTransitionNextMonth,
  setTransitonPrevDay,
  setTransitionNextDay,
  clearWorkoutAnimation,
  updateBufferDates,
} = calendarSlice.actions;

export default calendarSlice.reducer;
