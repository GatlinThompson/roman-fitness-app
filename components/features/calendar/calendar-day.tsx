import { color } from "@/styles/color";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CalendarDayProps = {
  day: { date: Date; isCurrentMonth: boolean } | null;
  selected: boolean;
  today: boolean;
  onDateSelect: (date: Date) => void;
};

export default function CalendarDay({
  day,
  selected,
  today,
  onDateSelect,
}: CalendarDayProps) {
  return (
    <TouchableOpacity
      style={[
        styles.dayCell,
        selected && styles.selectedDay,
        today && !selected && styles.todayDay,
      ]}
      onPress={() => day && onDateSelect(day.date)}
      disabled={!day}
    >
      {day && (
        <Text
          style={[
            styles.dayText,
            !day.isCurrentMonth && styles.otherMonthText,
            selected && styles.selectedDayText,
            today && !selected && styles.todayText,
          ]}
        >
          {day.date.getDate()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  selectedDay: {
    backgroundColor: color.primary.color,
    borderRadius: 9999,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: color.primary.color,
    borderRadius: 9999,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: color.foreground.color,
  },
  otherMonthText: {
    color: color.darkForeground.color,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  todayText: {
    color: color.primary.color,
    fontWeight: "600",
  },
});
