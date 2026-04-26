import { color } from "@/styles/color";
import { font } from "@/styles/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * CalendarWeek - Static week labels component
 * Memoized since it never changes - pure static content
 */
function CalendarWeek() {
  return (
    <View style={styles.weekLabels}>
      {daysOfWeek.map((day, index) => (
        <View key={index} style={styles.weekLabelCell}>
          <Text style={styles.weekLabelText}>{day}</Text>
        </View>
      ))}
    </View>
  );
}

// Memoize since this component never changes
export default React.memo(CalendarWeek);

const styles = StyleSheet.create({
  weekLabels: {
    flexDirection: "row",
    paddingLeft: 8,
  },
  weekLabelCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 4,
    paddingTop: 8,
    borderRadius: 4,
  },
  weekLabelText: {
    fontSize: 18,
    fontWeight: font.montserratBold.fontWeight,
    fontFamily: font.montserratBold.fontFamily,
    textAlign: "center",
    color: color.foreground.color,
  },
});
