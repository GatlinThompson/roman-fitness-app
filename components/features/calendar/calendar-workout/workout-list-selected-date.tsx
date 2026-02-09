import { color } from "@/styles/color";
import { getDateString } from "@/utils/get-today";
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
  const normalizedDate = getDateString(date);
  const [year, month, day] = normalizedDate.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);

  const formattedDate = dateObj.toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const weekDay = dateObj.toLocaleString("default", {
    weekday: "long",
  });

  const dayIndex = dateObj.getDay();
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
