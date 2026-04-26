import { color } from "@/styles/color";
import { font } from "@/styles/fonts";
import { getDate, getWeekDay } from "@/utils/get-date";
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

  const formattedDate = getDate(date as string);

  const weekDay = getWeekDay(date as string);

  const dayIndex = dateObj.getDay();
  const liftDay = liftDays[dayIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formattedDate}</Text>
      <Text style={styles.weekday}>
        {weekDay} | {liftDay} Day
      </Text>
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
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
    color: color.foreground.color,
  },
  weekday: {
    fontSize: 14,
    fontWeight: font.montserratRegular.fontWeight,
    fontFamily: font.montserratRegular.fontFamily,
    color: color.darkForeground.color,
    marginBottom: 0,
  },
});
