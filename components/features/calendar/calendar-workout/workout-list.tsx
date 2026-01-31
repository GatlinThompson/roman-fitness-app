import { color } from "@/styles/color";
import { StyleSheet, View } from "react-native";
import CalendarWorkout from "./calendar-workout";
import SelectedDate from "./workout-list-selected-date";

export default function WorkoutList() {
  return (
    <View style={styles.container}>
      <SelectedDate />
      <CalendarWorkout />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.blackBackground.backgroundColor,
    height: "100%",
    marginHorizontal: -8,
    paddingHorizontal: 16,
    paddingTop: 25,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderTopColor: color.blackBackground.borderColor,
    borderLeftColor: color.blackBackground.backgroundColor,
    borderRightColor: color.blackBackground.backgroundColor,
  },
});
