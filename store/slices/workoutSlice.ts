import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Lift {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  notes?: string;
  sequence: number;
  superset?: string | null;
}

export interface WorkoutData {
  id: string;
  date: string;
  phase: string;
  week: number;
  day: number;
  lifts: Lift[];
}

interface WorkoutState {
  currentWorkout: WorkoutData | null;
  workoutsByDate: Record<string, WorkoutData>; // Keyed by date string (YYYY-MM-DD)
  isLoading: boolean;
  error: string | null;
  selectedLiftId: string | null;
}

const initialState: WorkoutState = {
  currentWorkout: null,
  workoutsByDate: {},
  isLoading: false,
  error: null,
  selectedLiftId: null,
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setCurrentWorkout: (state, action: PayloadAction<WorkoutData | null>) => {
      state.currentWorkout = action.payload;
      state.error = null;
    },
    setWorkoutByDate: (
      state,
      action: PayloadAction<{ date: string; workout: WorkoutData }>,
    ) => {
      state.workoutsByDate[action.payload.date] = action.payload.workout;
    },
    setWorkoutsByDate: (
      state,
      action: PayloadAction<Record<string, WorkoutData>>,
    ) => {
      state.workoutsByDate = action.payload;
    },
    clearCurrentWorkout: (state) => {
      state.currentWorkout = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateLift: (
      state,
      action: PayloadAction<{ liftId: string; updates: Partial<Lift> }>,
    ) => {
      if (state.currentWorkout) {
        const liftIndex = state.currentWorkout.lifts.findIndex(
          (lift) => lift.id === action.payload.liftId,
        );
        if (liftIndex !== -1) {
          state.currentWorkout.lifts[liftIndex] = {
            ...state.currentWorkout.lifts[liftIndex],
            ...action.payload.updates,
          };
        }
      }
    },
    setSelectedLiftId: (state, action: PayloadAction<string | null>) => {
      state.selectedLiftId = action.payload;
    },
    completeLift: (state, action: PayloadAction<string>) => {
      // Mark a lift as completed - you can extend this with completion tracking
      state.selectedLiftId = action.payload;
    },
  },
});

export const {
  setCurrentWorkout,
  setWorkoutByDate,
  setWorkoutsByDate,
  clearCurrentWorkout,
  setLoading,
  setError,
  updateLift,
  setSelectedLiftId,
  completeLift,
} = workoutSlice.actions;

export default workoutSlice.reducer;
