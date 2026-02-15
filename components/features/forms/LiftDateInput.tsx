import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { getDate, getWeekDay } from "@/utils/get-date";

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginHorizontal: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  dateDisplay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDay: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  date: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
});
