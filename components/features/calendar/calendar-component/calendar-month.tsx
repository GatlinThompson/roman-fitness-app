import { color } from "@/styles/color";
import { font } from "@/styles/fonts";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type CalendarMonthProps = {
  month: Date | string;
};

/**
 * CalendarMonth - Optimized month header display
 * Features:
 * - Memoized month string computation
 * - Only re-renders when month prop changes
 */
function CalendarMonth({ month }: CalendarMonthProps) {
  // Memoize date string computation
  const monthString = useMemo(() => {
    const dateObj =
      typeof month === "string" ? new Date(month + "T00:00:00") : month;
    const isCurrentYear = dateObj.getFullYear() === new Date().getFullYear();
    return dateObj.toLocaleString("default", {
      month: "short",
      ...(isCurrentYear ? {} : { year: "numeric" }),
    });
  }, [month]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{monthString.toUpperCase()}</Text>
    </View>
  );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(CalendarMonth);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: font.montserratBold.fontWeight,
    fontFamily: font.montserratBold.fontFamily,
    color: color.foreground.color,
  },
});
