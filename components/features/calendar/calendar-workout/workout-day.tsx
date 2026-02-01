import { StyleSheet, View } from "react-native";
import CalendarWorkout from "./calendar-workout";
import SelectedDate from "./workout-list-selected-date";

type WorkoutDayProps = {
  date: string;
};

export default function WorkoutDay({ date }: WorkoutDayProps) {
  return (
    <View style={styles.container}>
      <SelectedDate date={date} />
      <CalendarWorkout date={date} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
});
