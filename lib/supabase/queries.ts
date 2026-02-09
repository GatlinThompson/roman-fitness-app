import { supabase } from "./client";

/**
 * Fetch all workout dates for a specific month
 * @param year - The year (e.g., 2026)
 * @param month - The month (1-12)
 * @returns Array of date strings (YYYY-MM-DD) that have workouts
 */
export async function getWorkoutDatesForMonth(
  year: number,
  month: number,
): Promise<string[]> {
  try {
    const formatDateLocal = (date: Date): string => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate(),
      ).padStart(2, "0")}`;
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
