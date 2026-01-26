import { color } from "@/styles/color";
import { StyleSheet, Text } from "react-native";

export default function PhaseWeek({ phaseDate }: { phaseDate: string | null }) {
  function calculateWeekAndDay(startDate: string): {
    week: number;
    day: number;
  } {
    const start = new Date(startDate + "T00:00:00Z");
    const today = new Date();
    // Use local date, not UTC
    const todayLocal = new Date(
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0,
      ),
    );

    // Count only non-Sunday days between start and today
    let workingDays = 0;
    const currentDay = new Date(start);

    while (currentDay < todayLocal) {
      const dayOfWeek = currentDay.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      if (dayOfWeek !== 0) {
        // Exclude Sundays
        workingDays++;
      }
      currentDay.setUTCDate(currentDay.getUTCDate() + 1);
    }

    // Include today if it's not Sunday
    const todayDayOfWeek = todayLocal.getUTCDay();
    if (todayDayOfWeek !== 0) {
      workingDays++;
    }

    const week = Math.ceil(workingDays / 6);
    const day = workingDays % 6 === 0 ? 6 : workingDays % 6;

    return { week: Math.max(1, week), day: Math.max(1, day) };
  }

  const { week, day } = calculateWeekAndDay(
    phaseDate || new Date().toISOString().split("T")[0],
  );

  return (
    <Text style={styles.text}>
      Week {week} Day {day}
    </Text>
  );
}
const styles = StyleSheet.create({
  text: {
    color: color.darkForeground.color,
    fontSize: 18,
    fontWeight: "500",
  },
});
