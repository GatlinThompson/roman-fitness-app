import React from "react";
import { StyleSheet, View } from "react-native";
import CalendarGrid from "../calendar-component/calendar-grid";

type CalendarProps = {
  month: Date | string;
  days?: Array<string>;
  events?: Array<any>;
};

/**
 * Calendar - Memoized calendar grid component
 * Only re-renders when month prop actually changes
 * Prevents unnecessary re-renders during carousel animations
 */
function Calendar({ month, days, events }: CalendarProps) {
  return (
    <View style={styles.container}>
      <CalendarGrid month={month} />
    </View>
  );
}

// Memoize with custom comparison for optimal performance
export default React.memo(Calendar, (prevProps, nextProps) => {
  return prevProps.month === nextProps.month;
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
});
