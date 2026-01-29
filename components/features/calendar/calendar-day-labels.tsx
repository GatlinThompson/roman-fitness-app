import { color } from "@/styles/color";
import { StyleSheet, Text, View } from "react-native";

export default function CalendarDayLabels() {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.daysRow}>
      {DAYS.map((day) => (
        <View key={day} style={styles.dayLabel}>
          <Text style={styles.dayLabelText}>{day}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    alignItems: "center",
  },
  dayLabelText: {
    fontWeight: "600",
    fontSize: 14,
    color: color.foreground.color,
  },
});
