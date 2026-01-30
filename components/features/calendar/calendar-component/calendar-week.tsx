import { color } from "@/styles/color";
import { StyleSheet, Text, View } from "react-native";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarWeek() {
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

const styles = StyleSheet.create({
  weekLabels: {
    flexDirection: "row",
    marginBottom: 8,

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
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    color: color.foreground.color,
  },
});
