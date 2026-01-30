import { color } from "@/styles/color";
import { StyleSheet, Text, View } from "react-native";

type CalendarMonthProps = {
  month: Date;
};

export default function CalendarMonth({ month }: CalendarMonthProps) {
  const dateObj =
    typeof month === "string" ? new Date(month + "T00:00:00") : month;

  const monthString = dateObj.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{monthString}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: color.foreground.color,
  },
});
