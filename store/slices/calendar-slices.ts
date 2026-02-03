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
}

const getTodayString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const getCurrentMonth = (): string => {
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return currentMonth.toISOString().slice(0, 10);
};

const getPreviousMonth = (): string => {
  const today = new Date();
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return prevMonth.toISOString().slice(0, 10);
};
const getNextMonth = (): string => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return nextMonth.toISOString().slice(0, 10);
};

const getPrevDateString = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00Z");
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  return prevDay.toISOString().slice(0, 10);
};

const getNextDateString = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00Z");
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay.toISOString().slice(0, 10);
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
  transitionMonth: "",
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      const newDate = new Date(action.payload + "T00:00:00Z");
      const currentMonthDate = new Date(state.currentMonth + "T00:00:00Z");

      state.selectedDate = newDate.toISOString().slice(0, 10);
      state.prevDate = getPrevDateString(newDate.toISOString().slice(0, 10));
      state.nextDate = getNextDateString(newDate.toISOString().slice(0, 10));

      // Update currentMonth if selected date is in a different month
      if (
        newDate.getUTCMonth() !== currentMonthDate.getUTCMonth() ||
        newDate.getUTCFullYear() !== currentMonthDate.getUTCFullYear()
      ) {
        const newMonth = new Date(
          Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), 1),
        );
        const newPrevMonth = new Date(
          Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth() - 1, 1),
        );
        const newNextMonth = new Date(
          Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, 1),
        );

        state.currentMonth = newMonth.toISOString().slice(0, 10);
        state.prevMonth = newPrevMonth.toISOString().slice(0, 10);
        state.nextMonth = newNextMonth.toISOString().slice(0, 10);
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
      const newCurrentMonth = new Date(state.currentMonth + "T00:00:00Z");
      state.selectedDate = newCurrentMonth.toISOString().slice(0, 10);

      const today = new Date();
      const isTodayInNewMonth =
        today.getUTCMonth() === newCurrentMonth.getUTCMonth() &&
        today.getUTCFullYear() === newCurrentMonth.getUTCFullYear();
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
      const newCurrentMonth = new Date(state.currentMonth + "T00:00:00Z");
      state.selectedDate = newCurrentMonth.toISOString().slice(0, 10);

      const today = new Date();
      const isTodayInNewMonth =
        today.getUTCMonth() === newCurrentMonth.getUTCMonth() &&
        today.getUTCFullYear() === newCurrentMonth.getUTCFullYear();
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
      state.currentMonth = currentMonth.toISOString().slice(0, 10);
      state.prevMonth = newPrevMonth.toISOString().slice(0, 10);
      state.nextMonth = newNextMonth.toISOString().slice(0, 10);

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
      state.currentMonth = currentMonth.toISOString().slice(0, 10);
      state.prevMonth = newPrevMonth.toISOString().slice(0, 10);
      state.nextMonth = newNextMonth.toISOString().slice(0, 10);

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
    setPrevDate: (state) => {
      const current = new Date(state.selectedDate + "T00:00:00Z");
      const prevDay = new Date(current);
      prevDay.setUTCDate(current.getUTCDate() - 1);
      state.selectedDate = prevDay.toISOString().slice(0, 10);
      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);
      // Update month if crossing month boundary
      if (
        prevDay.getUTCMonth() !== current.getUTCMonth() ||
        prevDay.getUTCFullYear() !== current.getUTCFullYear()
      ) {
        const newMonth = new Date(
          Date.UTC(prevDay.getUTCFullYear(), prevDay.getUTCMonth(), 1),
        );
        const newPrevMonth = new Date(
          Date.UTC(prevDay.getUTCFullYear(), prevDay.getUTCMonth() - 1, 1),
        );
        const newNextMonth = new Date(
          Date.UTC(prevDay.getUTCFullYear(), prevDay.getUTCMonth() + 1, 1),
        );
        state.currentMonth = newMonth.toISOString().slice(0, 10);
        state.prevMonth = newPrevMonth.toISOString().slice(0, 10);
        state.nextMonth = newNextMonth.toISOString().slice(0, 10);
      }
    },
    setNextDate: (state) => {
      const current = new Date(state.selectedDate + "T00:00:00Z");
      const nextDay = new Date(current);
      nextDay.setUTCDate(current.getUTCDate() + 1);
      state.selectedDate = nextDay.toISOString().slice(0, 10);
      state.prevDate = getPrevDateString(state.selectedDate);
      state.nextDate = getNextDateString(state.selectedDate);

      // Update month if crossing month boundary
      if (
        nextDay.getUTCMonth() !== current.getUTCMonth() ||
        nextDay.getUTCFullYear() !== current.getUTCFullYear()
      ) {
        const newMonth = new Date(
          Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth(), 1),
        );
        const newPrevMonth = new Date(
          Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth() - 1, 1),
        );
        const newNextMonth = new Date(
          Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth() + 1, 1),
        );

        state.currentMonth = newMonth.toISOString().slice(0, 10);
        state.prevMonth = newPrevMonth.toISOString().slice(0, 10);
        state.nextMonth = newNextMonth.toISOString().slice(0, 10);
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
} = calendarSlice.actions;

export default calendarSlice.reducer;
