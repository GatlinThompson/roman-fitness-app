import { Lift } from "@/components/features/workout/lift_row";
import { SuperSet } from "@/components/features/workout/super_set_row";
import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";

type UseRealtimeWorkoutReturn = {
  workout: (Lift | SuperSet)[];
  workoutId: string | number | undefined;
  loading: boolean;
};

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
};

export function useRealtimeWorkout(): UseRealtimeWorkoutReturn {
  const [workout, setWorkout] = useState<(Lift | SuperSet)[]>([]);
  const [workoutId, setWorkoutId] = useState<string | number | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const isInitialLoadRef = useRef(true);
  const currentLiftIdsRef = useRef<Set<number>>(new Set());

  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize the update function to prevent recreation on every render
  const updateWorkoutData = useCallback(async () => {
    console.log("updateWorkoutData called");
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
        // Get today's date in YYYY-MM-DD format (client timezone)
        const todayStr = getTodayString();

        const { data, error } = await supabase
          .from("workouts")
          .select("*, workout_lifts(sequence, lift(*, superset(*)))")
          .eq("workout_date", todayStr)
          .order("sequence", {
            foreignTable: "workout_lifts",
            ascending: true,
          });

        console.warn("Fetched workouts:", data);
        if (error) {
          console.error("Error fetching workouts:", error);
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
  }, [supabase]);

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
          filter: `workout=eq.${workoutId}`,
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
          filter: `id=eq.${workoutId}`,
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
