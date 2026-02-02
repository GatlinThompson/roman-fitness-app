import { StyleSheet, View } from "react-native";
import CalendarDay from "./calendar-day";

type CalendarGridProps = {
  //props to come
  month: Date | string;
};

// Helper function to get all days in a specific month
const getDaysInMonth = (month: Date | string): Date[] => {
  const dateObj =
    typeof month === "string" ? new Date(month + "T00:00:00") : new Date(month);
  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();

  // Get the number of days in the month
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Create an array of all days in the month
  const days: Date[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, monthIndex, day));
  }

  return days;
};

export default function CalendarGrid({ month }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(month);

  // Get the day of week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = daysInMonth[0].getDay();

  // Create empty cells for days before the month starts
  const emptyCells = Array(firstDayOfWeek).fill(null);

  // Calculate total number of rows needed
  const totalCells = emptyCells.length + daysInMonth.length;
  const totalRows = Math.ceil(totalCells / 7);
  const GRID_HEIGHT = 250; // Fixed height for the grid
  const cellHeight = GRID_HEIGHT / totalRows;

  return (
    <View style={[styles.container, styles.grid]}>
      {emptyCells.map((_, index) => (
        <View
          key={`empty-${index}`}
          style={[styles.dayCell, { height: cellHeight }]}
        />
      ))}
      {daysInMonth.map((day, index) => (
        <View
          key={`day-${index}`}
          style={[styles.dayCell, { height: cellHeight }]}
        >
          <CalendarDay day={day} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingLeft: 8,
    paddingVertical: 8,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
  },
  dayCell: {
    width: `${100 / 7}%`,
  },
});
