import { Lift } from "@/components/features/workout/lift_row";
import { SuperSet } from "@/components/features/workout/super_set_row";
import { supabase } from "@/lib/supabase/client";
import getTodayString from "@/utils/get-today";
import { useCallback, useEffect, useRef, useState } from "react";

type UseRealtimeWorkoutReturn = {
  workout: (Lift | SuperSet)[];
  workoutId: string | number | undefined;
  loading: boolean;
};

type useRealtimeWorkoutProps = {
  workout_date?: Date | string | null;
  loadingFunction?: boolean;
};

export function useRealtimeWorkout({
  workout_date,
  loadingFunction = false,
}: useRealtimeWorkoutProps): UseRealtimeWorkoutReturn {
  console.warn("workout_date:", workout_date);
  const [workout, setWorkout] = useState<(Lift | SuperSet)[]>([]);
  const [workoutId, setWorkoutId] = useState<string | number | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const isInitialLoadRef = useRef(true);
  const currentLiftIdsRef = useRef<Set<number>>(new Set());

  if (loadingFunction) {
    isInitialLoadRef.current = true;
  }

  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize the update function to prevent recreation on every render
  const updateWorkoutData = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual fetch to batch rapid changes
    debounceTimerRef.current = setTimeout(async () => {
      isFetchingRef.current = true;

      // Only set loading state on initial load
      if (isInitialLoadRef.current) {
        setLoading(true);
      }

      try {
        let todayStr: string;
        if (!workout_date) {
          todayStr = getTodayString();
        } else {
          if (typeof workout_date === "string") {
            todayStr = workout_date;
          } else {
            todayStr = `${workout_date.getFullYear()}-${String(
              workout_date.getMonth() + 1,
            ).padStart(2, "0")}-${String(workout_date.getDate()).padStart(
              2,
              "0",
            )}`;
          }
        }

        console.warn("Fetching workout for date:", todayStr);

        const { data, error } = await supabase
          .from("workouts")
          .select("*, workout_lifts(sequence, lift(*, superset(*)))")
          .eq("workout_date", todayStr)
          .order("sequence", {
            foreignTable: "workout_lifts",
            ascending: true,
          });

        if (error) {
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        if (data && data.length > 0) {
          const workoutLifts = data[0].workout_lifts || [];

          setWorkoutId(data[0].id);
          setWorkout(workoutLifts);
        } else {
          // No workout found for today
          setWorkout([]);
          setWorkoutId(undefined);
          currentLiftIdsRef.current = new Set();
        }

        // Mark initial load as complete
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          setLoading(false);
        }
      } catch (error) {
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          setLoading(false);
        }
      } finally {
        isFetchingRef.current = false;
      }
    }, 300);
  }, [workout_date]);

  // Initial data fetch on mount
  useEffect(() => {
    updateWorkoutData();
  }, [updateWorkoutData]);

  useEffect(() => {
    const channel = supabase
      .channel("workout-realtime-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lifts",
        },
        () => {
          updateWorkoutData();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workout_lifts",
        },
        () => {
          updateWorkoutData();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workouts",
        },
        () => {
          updateWorkoutData();
        },
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [supabase, updateWorkoutData, workoutId]);

  return { workout, workoutId, loading };
}
