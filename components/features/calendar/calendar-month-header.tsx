import { color } from "@/styles/color";
import { StyleSheet, Text, View } from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CalendarMonthHeaderProps = {
  currentMonth: Date;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
};

export default function CalendarMonthHeader({
  currentMonth,
  goToPreviousMonth,
  goToNextMonth,
}: CalendarMonthHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.monthText}>
        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    color: color.foreground.color,
    fontSize: 28,
    fontWeight: "bold",
  },
  monthText: {
    color: color.foreground.color,
    fontSize: 24,
    fontWeight: "600",
  },
});
