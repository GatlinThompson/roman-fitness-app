import { supabase } from "./client";

/**
 * Fetch all workout dates for a specific month
 * @param year - The year (e.g., 2026)
 * @param month - The month (1-12)
 * @returns Array of date strings (YYYY-MM-DD) that have workouts
 */
const dateFormatter = new Intl.DateTimeFormat("sv-SE");

export async function getWorkoutDatesForMonth(
  year: number,
  month: number,
): Promise<string[]> {
  try {
    const formatDateLocal = (date: Date): string => {
      const parts = dateFormatter.formatToParts(date);
      const y = parts.find((p) => p.type === "year")?.value;
      const m = parts.find((p) => p.type === "month")?.value;
      const d = parts.find((p) => p.type === "day")?.value;
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    };

    // Create start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    const startDateString = formatDateLocal(startDate);
    const endDateString = formatDateLocal(endDate);

    // Query workouts table for dates in this month
    const { data, error } = await supabase
      .from("workouts")
      .select("workout_date")
      .gte("workout_date", startDateString)
      .lte("workout_date", endDateString);

    if (error) {
      console.error("Error fetching workout dates:", error);
      return [];
    }

    // Extract unique dates from results
    const dates = data?.map((workout) => workout.workout_date) || [];
    return [...new Set(dates)]; // Remove duplicates
  } catch (error) {
    console.error("Error in getWorkoutDatesForMonth:", error);
    return [];
  }
}

export const getWorkout = async (date: string) => {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      "id, workout_date, workout_lifts(sequence, lift(id, exercise, reps, tempo, superset(id, exercise, reps, tempo)))",
    )
    .eq("workout_date", date)
    .order("sequence", {
      foreignTable: "workout_lifts",
      ascending: true,
    })
    .single();

  if (error) throw error;
  return data;
};

export const createWorkout = async (lifts: any[], date: string) => {
  try {
    // Validate inputs
    if (!date) {
      throw new Error("Date is required");
    }
    if (!lifts || lifts.length === 0) {
      throw new Error("At least one lift is required");
    }

    // Check if workout for date already exists
    const { data: existingWorkout, error: existingError } = await supabase
      .from("workouts")
      .select("id")
      .eq("workout_date", date);

    if (existingError) {
      throw new Error("Failed to check existing workout");
    }
    if (existingWorkout && existingWorkout.length > 0) {
      throw new Error("Workout for this date already exists");
    }

    // Insert workout
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert({ workout_date: date })
      .select("id")
      .single();

    if (workoutError || !workout) {
      throw new Error("Failed to create workout");
    }

    // Separate lifts into normal and supersets
    const normalLifts = lifts.filter((l) => !l.lift.superSet);
    const supersetMainLifts = lifts.filter((l) => !!l.lift.superSet);

    // Set up to collect workout_lifts entries
    let workoutLiftRows: { workout: number; lift: number; sequence: number }[] =
      [];

    if (normalLifts.length > 0) {
      const { data: insertedNormals, error: normalsError } = await supabase
        .from("lifts")
        .insert(
          normalLifts.map((l) => ({
            exercise: l.lift.exercise,
            reps: l.lift.reps,
            tempo: l.lift.tempo ?? "",
          })),
        )
        .select("id");

      if (normalsError || !insertedNormals) {
        throw new Error("Failed to insert lifts");
      }

      workoutLiftRows.push(
        ...insertedNormals.map((row, i) => ({
          workout: workout.id,
          lift: row.id,
          sequence: normalLifts[i].sequence,
        })),
      );
    }

    // Set up superset lifts
    for (const lift of supersetMainLifts) {
      const ss = lift.lift.superSet!;

      // Insert superset lift first
      const { data: ssRow, error: ssError } = await supabase
        .from("lifts")
        .insert({
          exercise: ss.exercise,
          reps: ss.reps,
          tempo: ss.tempo ?? "",
        })
        .select("id")
        .single();

      if (ssError || !ssRow) {
        throw new Error("Failed to insert superset secondary lift");
      }

      // Insert main lift pointing to superset
      const { data: mainRow, error: mainError } = await supabase
        .from("lifts")
        .insert({
          exercise: lift.lift.exercise,
          reps: lift.lift.reps,
          tempo: lift.lift.tempo ?? "",
          superset: ssRow.id,
        })
        .select("id")
        .single();

      if (mainError || !mainRow) {
        throw new Error("Failed to insert superset main lift");
      }

      workoutLiftRows.push({
        workout: workout.id,
        lift: mainRow.id,
        sequence: lift.sequence,
      });
    }

    const { error: joinError } = await supabase
      .from("workout_lifts")
      .insert(workoutLiftRows);

    if (joinError) {
      throw new Error("Failed to link lifts to workout");
    }

    return {
      message: "Workout created",
      workoutId: workout.id,
    };
  } catch (error) {
    console.error("Error in createWorkout:", error);
    throw error;
  }
};

export const updateWorkout = async (
  workoutId: number,
  lifts: any[],
  date: string,
  removedLiftIds: number[] = [],
) => {
  try {
    // Validate inputs
    if (!workoutId) {
      throw new Error("Workout ID is required");
    }
    if (!date) {
      throw new Error("Date is required");
    }
    if (!lifts || lifts.length === 0) {
      throw new Error("At least one lift is required");
    }

    // Verify workout exists first
    const { data: existingWorkout, error: workoutCheckError } = await supabase
      .from("workouts")
      .select("id")
      .eq("id", workoutId)
      .single();

    if (workoutCheckError || !existingWorkout) {
      throw new Error("Workout not found");
    }

    // Update the workout date
    const { error: updateWorkoutError } = await supabase
      .from("workouts")
      .update({ workout_date: date })
      .eq("id", workoutId);

    if (updateWorkoutError) {
      throw new Error("Failed to update workout");
    }

    // Get existing workout_lifts to find lift IDs to delete
    const { data: oldWorkoutLifts, error: fetchError } = await supabase
      .from("workout_lifts")
      .select("lift")
      .eq("workout", workoutId);

    if (fetchError) {
      throw new Error("Failed to fetch existing lifts");
    }

    const oldLiftIds = (oldWorkoutLifts || []).map((wl: any) => wl.lift);

    // Delete old workout_lifts entries
    const { error: deleteJoinError } = await supabase
      .from("workout_lifts")
      .delete()
      .eq("workout", workoutId);

    if (deleteJoinError) {
      throw new Error("Failed to delete old workout lifts");
    }

    // Delete old lift entries (and their associated supersets)
    if (oldLiftIds.length > 0) {
      // First get superset IDs from old lifts
      const { data: oldLifts } = await supabase
        .from("lifts")
        .select("id, superset")
        .in("id", oldLiftIds);

      const supersetIds = (oldLifts || [])
        .filter((l: any) => l.superset)
        .map((l: any) => l.superset);

      // Delete main lifts
      const { error: deleteLiftsError } = await supabase
        .from("lifts")
        .delete()
        .in("id", oldLiftIds);

      if (deleteLiftsError) {
        console.error("Error deleting lifts:", deleteLiftsError);
      }

      // Delete superset lifts
      if (supersetIds.length > 0) {
        await supabase.from("lifts").delete().in("id", supersetIds);
      }
    }

    // Insert new lifts
    const normalLifts = lifts.filter((l) => !l.lift.superSet);
    const supersetMainLifts = lifts.filter((l) => !!l.lift.superSet);

    let workoutLiftRows: { workout: number; lift: number; sequence: number }[] =
      [];

    if (normalLifts.length > 0) {
      const { data: insertedNormals, error: normalsError } = await supabase
        .from("lifts")
        .insert(
          normalLifts.map((l) => ({
            exercise: l.lift.exercise,
            reps: l.lift.reps,
            tempo: l.lift.tempo ?? "",
          })),
        )
        .select("id");

      if (normalsError || !insertedNormals) {
        throw new Error("Failed to insert lifts");
      }

      workoutLiftRows.push(
        ...insertedNormals.map((row, i) => ({
          workout: workoutId,
          lift: row.id,
          sequence: normalLifts[i].sequence,
        })),
      );
    }

    for (const lift of supersetMainLifts) {
      const ss = lift.lift.superSet!;

      const { data: ssRow, error: ssError } = await supabase
        .from("lifts")
        .insert({
          exercise: ss.exercise,
          reps: ss.reps,
          tempo: ss.tempo ?? "",
        })
        .select("id")
        .single();

      if (ssError || !ssRow) {
        throw new Error("Failed to insert superset secondary lift");
      }

      const { data: mainRow, error: mainError } = await supabase
        .from("lifts")
        .insert({
          exercise: lift.lift.exercise,
          reps: lift.lift.reps,
          tempo: lift.lift.tempo ?? "",
          superset: ssRow.id,
        })
        .select("id")
        .single();

      if (mainError || !mainRow) {
        throw new Error("Failed to insert superset main lift");
      }

      workoutLiftRows.push({
        workout: workoutId,
        lift: mainRow.id,
        sequence: lift.sequence,
      });
    }

    const { error: joinError } = await supabase
      .from("workout_lifts")
      .insert(workoutLiftRows);

    if (joinError) {
      throw new Error("Failed to link lifts to workout");
    }

    return {
      message: "Workout updated",
      workoutId,
    };
  } catch (error) {
    console.error("Error in updateWorkout:", error);
    throw error;
  }
};

export type PhaseEntry = {
  id: string;
  start_date: string;
  end_date: string;
  phase: {
    level: string;
    phase_number: number;
    percentage: number;
  };
};

export const getPhases = async (): Promise<PhaseEntry[]> => {
  const { data, error } = await supabase
    .from("phase_management")
    .select("phase(level, phase_number, percentage), start_date, end_date, id")
    .order("start_date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    ...item,
    phase: Array.isArray(item.phase) ? item.phase[0] : item.phase,
  }));
};

export const extendPhase = async (id: string): Promise<void> => {
  const { data, error } = await supabase
    .from("phase_management")
    .select("id, end_date")
    .eq("id", id);

  if (error || !data || data.length === 0) throw new Error("Phase not found");

  const newEndDate = new Date(data[0].end_date);
  newEndDate.setDate(newEndDate.getDate() + 7);

  const { error: updateError } = await supabase
    .from("phase_management")
    .update({ end_date: newEndDate.toISOString() })
    .eq("id", id);

  if (updateError) throw new Error("Failed to extend phase");

  const { data: otherPhases, error: fetchError } = await supabase
    .from("phase_management")
    .select("id, start_date, end_date")
    .neq("id", id);

  if (fetchError) throw new Error("Failed to fetch other phases");
  if (!otherPhases || otherPhases.length === 0) return;

  await Promise.all(
    otherPhases.map((phase) => {
      const newStart = new Date(phase.start_date);
      newStart.setDate(newStart.getDate() + 7);
      const newEnd = new Date(phase.end_date);
      newEnd.setDate(newEnd.getDate() + 7);
      return supabase
        .from("phase_management")
        .update({
          start_date: newStart.toISOString(),
          end_date: newEnd.toISOString(),
        })
        .eq("id", phase.id);
    }),
  );
};

export const reducePhase = async (id: string): Promise<void> => {
  const { data, error } = await supabase
    .from("phase_management")
    .select("id, start_date, end_date")
    .eq("id", id);

  if (error || !data || data.length === 0) throw new Error("Phase not found");

  const phase = data[0];
  const newEndDate = new Date(phase.end_date);
  newEndDate.setDate(newEndDate.getDate() - 7);

  if (newEndDate <= new Date(phase.start_date)) {
    throw new Error("End date cannot be before or equal to start date");
  }

  const { error: updateError } = await supabase
    .from("phase_management")
    .update({ end_date: newEndDate.toISOString() })
    .eq("id", id);

  if (updateError) throw new Error("Failed to reduce phase");

  const { data: otherPhases, error: fetchError } = await supabase
    .from("phase_management")
    .select("id, start_date, end_date")
    .neq("id", id);

  if (fetchError) throw new Error("Failed to fetch other phases");
  if (!otherPhases || otherPhases.length === 0) return;

  await Promise.all(
    otherPhases.map((other) => {
      const newStart = new Date(other.start_date);
      newStart.setDate(newStart.getDate() - 7);
      const newEnd = new Date(other.end_date);
      newEnd.setDate(newEnd.getDate() - 7);
      return supabase
        .from("phase_management")
        .update({
          start_date: newStart.toISOString(),
          end_date: newEnd.toISOString(),
        })
        .eq("id", other.id);
    }),
  );
};

export const deleteWorkout = async (workoutId: number) => {
  try {
    if (!workoutId) {
      throw new Error("Workout ID is required");
    }

    // Verify workout exists
    const { data: existingWorkout, error: workoutCheckError } = await supabase
      .from("workouts")
      .select("id")
      .eq("id", workoutId)
      .single();

    if (workoutCheckError || !existingWorkout) {
      throw new Error("Workout not found");
    }

    // Get all lifts for this workout
    const { data: existingLifts, error: liftsFetchError } = await supabase
      .from("workout_lifts")
      .select("lift")
      .eq("workout", workoutId);

    if (liftsFetchError) {
      throw new Error("Failed to fetch lifts for workout");
    }

    const liftIds = (existingLifts || []).map((wl: any) => wl.lift);

    if (liftIds.length > 0) {
      // First get superset IDs from lifts
      const { data: liftsData } = await supabase
        .from("lifts")
        .select("id, superset")
        .in("id", liftIds);

      const supersetIds = (liftsData || [])
        .filter((l: any) => l.superset)
        .map((l: any) => l.superset);

      // Delete main lifts
      const { error: deleteLiftsError } = await supabase
        .from("lifts")
        .delete()
        .in("id", liftIds);

      if (deleteLiftsError) {
        throw new Error("Failed to delete lifts");
      }

      // Delete superset lifts
      if (supersetIds.length > 0) {
        const { error: deleteSupersetsError } = await supabase
          .from("lifts")
          .delete()
          .in("id", supersetIds);

        if (deleteSupersetsError) {
          throw new Error("Failed to delete superset lifts");
        }
      }
    }

    // Delete the workout
    const { error: deleteWorkoutError } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (deleteWorkoutError) {
      throw new Error("Failed to delete workout");
    }

    return {
      message: "Workout deleted",
      workoutId,
    };
  } catch (error) {
    console.error("Error in deleteWorkout:", error);
    throw error;
  }
};
