import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function CalendarWorkout() {
  const selectedDate = useSelector((state: any) => state.calendar.selectedDate);

  return (
    <View style={styles.container}>
      <Text>as</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
