import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CalendarState {
  selectedDate: string; // ISO date string (YYYY-MM-DD)
  workoutDates: string[]; // Array of dates with scheduled workouts
  currentMonth: string;
  prevMonth: string;
  nextMonth: string;
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

const initialState: CalendarState = {
  selectedDate: getTodayString(),
  workoutDates: [],
  currentMonth: getCurrentMonth(),
  prevMonth: getPreviousMonth(),
  nextMonth: getNextMonth(),
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setCurrentMonth: (state, action: PayloadAction<string>) => {
      state.currentMonth = action.payload;
    },
    setWorkoutDates: (state, action: PayloadAction<string[]>) => {
      state.workoutDates = action.payload;
    },
    setPrevMonth: (state) => {
      const [year, month] = state.currentMonth.split("-").map(Number);
      const current = new Date(year, month - 1, 1);

      const newCurrentMonth = new Date(
        current.getFullYear(),
        current.getMonth() - 1,
        1,
      );
      const newPrevMonth = new Date(
        current.getFullYear(),
        current.getMonth() - 2,
        1,
      );
      const newNextMonth = current;

      state.currentMonth = newCurrentMonth.toISOString().slice(0, 10);
      state.prevMonth = newPrevMonth.toISOString().slice(0, 10);
      state.nextMonth = newNextMonth.toISOString().slice(0, 10);

      state.selectedDate = newCurrentMonth.toISOString().slice(0, 10);

      const today = new Date();
      const isTodayInNewMonth =
        today.getMonth() === newCurrentMonth.getMonth() &&
        today.getFullYear() === newCurrentMonth.getFullYear();
      if (isTodayInNewMonth) {
        state.selectedDate = getTodayString();
      }
    },
    setNextMonth: (state) => {
      const [year, month] = state.currentMonth.split("-").map(Number);
      const current = new Date(year, month - 1, 1);

      const newCurrentMonth = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        1,
      );
      const newPrevMonth = current;
      const newNextMonth = new Date(
        current.getFullYear(),
        current.getMonth() + 2,
        1,
      );

      state.currentMonth = newCurrentMonth.toISOString().slice(0, 10);
      state.prevMonth = newPrevMonth.toISOString().slice(0, 10);
      state.nextMonth = newNextMonth.toISOString().slice(0, 10);

      state.selectedDate = newCurrentMonth.toISOString().slice(0, 10);

      const today = new Date();
      const isTodayInNewMonth =
        today.getMonth() === newCurrentMonth.getMonth() &&
        today.getFullYear() === newCurrentMonth.getFullYear();
      if (isTodayInNewMonth) {
        state.selectedDate = getTodayString();
      }
    },
  },
});

export const {
  setSelectedDate,
  setCurrentMonth,
  setPrevMonth,
  setNextMonth,
  setWorkoutDates,
} = calendarSlice.actions;

export default calendarSlice.reducer;
