import { setSelectedDate } from "@/store/slices/calendar-slices";
import { color } from "@/styles/color";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

type CalendarDayProps = {
  day: Date;
};

export default function CalendarDay({ day }: CalendarDayProps) {
  const today = new Date();
  const selectedDate = useSelector((state: any) => state.calendar.selectedDate);
  const workoutDates = useSelector((state: any) => state.calendar.workoutDates);
  const dispatch = useDispatch();

  const isSelected = (): boolean => {
    const selected = new Date(selectedDate + "T00:00:00");
    return (
      selected.getDate() === day.getDate() &&
      selected.getMonth() === day.getMonth() &&
      selected.getFullYear() === day.getFullYear()
    );
  };

  const isToday: boolean =
    today.getDate() === day.getDate() &&
    today.getMonth() === day.getMonth() &&
    today.getFullYear() === day.getFullYear();

  const hasWorkout = (): boolean => {
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, "0");
    const date = String(day.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${date}`;
    return workoutDates.includes(dateString);
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        ...(isSelected() ? styles.isSelected : {}),
        ...(isToday ? styles.isToday : {}),
      }}
      onPress={() => {
        // Format date as YYYY-MM-DD
        const year = day.getFullYear();
        const month = String(day.getMonth() + 1).padStart(2, "0");
        const date = String(day.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${date}`;

        console.log("Selected date:", dateString);

        dispatch(setSelectedDate(dateString));
      }}
    >
      <View>
        <Text style={styles.dayText}>{day.getDate()}</Text>
        {hasWorkout() && <View style={styles.workoutIndicator}></View>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 2,
    borderRadius: 8,
  },

  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: color.foreground.color,
    textAlign: "center",
    paddingTop: 4,
  },
  isToday: {
    borderWidth: 2,
    borderColor: color.primary.color,
  },

  workoutIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.secondary.color,
    alignSelf: "center",
    marginTop: 4,
  },
  isSelected: {
    backgroundColor: color.primary.color,
  },
});
