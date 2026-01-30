import { color } from "@/styles/color";
import { StyleSheet, Text, View } from "react-native";

import { useSelector } from "react-redux";

const liftDays = ["Chest", "Leg", "Arms", "Chest", "Leg", "Shoulder", "Rest"];

export default function SelectedDate() {
  const selectedDate = useSelector((state: any) => state.calendar.selectedDate);

  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleString(
    "default",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const weekDay = new Date(selectedDate + "T00:00:00").toLocaleString(
    "default",
    {
      weekday: "long",
    },
  );

  const dayIndex = new Date(selectedDate + "T00:00:00").getDay();
  const liftDay = liftDays[dayIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.weekday}>
        {weekDay} | {liftDay} Day
      </Text>
      <Text style={styles.text}>{formattedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",

    color: color.foreground.color,
  },
  weekday: {
    fontSize: 16,
    fontWeight: "400",
    color: color.darkForeground.color,
    marginBottom: 0,
  },
});
