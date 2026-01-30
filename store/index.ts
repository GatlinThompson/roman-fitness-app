import { configureStore } from "@reduxjs/toolkit";
import calendarSlice from "./slices/calendar-slices";
import workoutSlice from "./slices/workoutSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarSlice,
    workout: workoutSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
