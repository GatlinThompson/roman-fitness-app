import { color } from "@/styles/color";
import { StyleSheet, Text, View } from "react-native";

const liftDays = [
  "Rest",
  "Chest",
  "Leg",
  "Arms",
  "Chest",
  "Leg",
  "Shoulder",
  "Rest",
];

type SelectedDateProps = {
  date: string;
};

export default function SelectedDate({ date }: SelectedDateProps) {
  const formattedDate = new Date(date + "T00:00:00").toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekDay = new Date(date + "T00:00:00").toLocaleString("default", {
    weekday: "long",
  });

  const dayIndex = new Date(date + "T00:00:00").getDay();
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
    marginTop: 0,
    marginBottom: 8,
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
