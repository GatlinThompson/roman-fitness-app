import { StyleSheet, View } from "react-native";
import CalendarDay from "./calendar-day";

type CalendarDayGridProps = {
  days: Array<{ date: Date; isCurrentMonth: boolean } | null>;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isSameDay: (date1: Date, date2: Date | null) => boolean;
  isToday: (date: Date | null) => boolean;
};

export default function CalendarDayGrid({
  days,
  selectedDate,
  onDateSelect,
  isSameDay,
  isToday,
}: CalendarDayGridProps) {
  return (
    <View style={styles.calendar}>
      {days.map((day, index) => (
        <CalendarDay
          key={index}
          day={day}
          selected={day ? isSameDay(selectedDate, day.date) : false}
          today={isToday(day?.date || null)}
          onDateSelect={onDateSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
