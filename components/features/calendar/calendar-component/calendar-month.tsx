import { color } from "@/styles/color";
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
    return dateObj.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
  }, [month]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{monthString}</Text>
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
    fontWeight: "bold",
    color: color.foreground.color,
  },
});
