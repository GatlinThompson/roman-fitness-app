import Divider from "@/components/ui/divider";
import { font } from "@/styles/fonts";
import { getDate, getWeekDay } from "@/utils/get-date";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  initialDate?: string;
  onDateChange?: (date: string) => void;
};

export default function LiftDateInput({ initialDate, onDateChange }: Props) {
  const [date, setDate] = useState<string>(() => {
    if (initialDate) {
      return initialDate;
    }
    // Return today's date in YYYY-MM-DD format
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`;
  });

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    onDateChange?.(newDate);
  };

  const displayDate = getDate(date);
  const weekDay = getWeekDay(date);

  return (
    <View style={styles.container}>
      <View style={styles.dateDisplay}>
        <Text style={styles.weekDay}>{weekDay}</Text>
        <Text style={styles.date}>{displayDate}</Text>
      </View>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  dateDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  weekDay: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: font.montserratRegular.fontWeight,
    fontFamily: font.montserratRegular.fontFamily,
  },
  date: {
    color: "white",
    fontSize: 20,
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
    marginTop: -2,
  },
});
