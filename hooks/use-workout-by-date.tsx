import { Lift } from "@/components/features/workout/lift_row";
import { SuperSet } from "@/components/features/workout/super_set_row";
import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";

type UseWorkoutByDateReturn = {
  workout: (Lift | SuperSet)[];
  workoutId: string | number | undefined;
  loading: boolean;
};

export function useWorkoutByDate(selectedDate: Date): UseWorkoutByDateReturn {
  const [workout, setWorkout] = useState<(Lift | SuperSet)[]>([]);
  const [workoutId, setWorkoutId] = useState<string | number | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
  };

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
      setLoading(true);

      try {
        const dateStr = formatDateString(selectedDate);

        const { data, error } = await supabase
          .from("workouts")
          .select("*, workout_lifts(sequence, lift(*, superset(*)))")
          .eq("workout_date", dateStr)
          .order("sequence", {
            foreignTable: "workout_lifts",
            ascending: true,
          });

        if (error) {
          console.error("Error fetching workout:", error);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        if (data && data.length > 0) {
          const workoutLifts = data[0].workout_lifts || [];
          setWorkoutId(data[0].id);
          setWorkout(workoutLifts);
        } else {
          // No workout found for this date
          setWorkout([]);
          setWorkoutId(undefined);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in updateWorkoutData:", error);
        setLoading(false);
      } finally {
        isFetchingRef.current = false;
      }
    }, 300);
  }, [selectedDate]);

  // Fetch data when selectedDate changes
  useEffect(() => {
    updateWorkoutData();
  }, [updateWorkoutData]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!workoutId) return;

    const channel = supabase
      .channel(`workout-${workoutId}-updates`)
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
