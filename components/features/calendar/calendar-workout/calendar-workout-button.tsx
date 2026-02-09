import { color } from "@/styles/color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const HEIGHT = 45;

type CalendarWorkoutButtonProps = {
  editMode: boolean;
};

export default function CalendarWorkoutButton({
  editMode,
}: CalendarWorkoutButtonProps) {
  const text = editMode ? "Edit" : "Create";

  return (
    <TouchableOpacity style={styles.container}>
      {/* <View style={styles.blackBar}>
        <Text style={styles.text}>{text}</Text>
      </View> */}
      <View style={styles.circle}>
        <MaterialIcons
          name={editMode ? "edit" : "add"}
          size={28}
          color={color.blackFillBackground.backgroundColor}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginEnd: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    backgroundColor: color.foreground.color,
    borderRadius: HEIGHT / 2,
    height: HEIGHT,
    width: HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  blackBar: {
    backgroundColor: color.blackBackground.backgroundColor,
    borderWidth: 1,
    borderColor: color.darkForeground.color,
    height: HEIGHT * 0.8,
    width: 100,
    borderTopStartRadius: HEIGHT / 2,
    borderBottomStartRadius: HEIGHT / 2,
    marginEnd: -24,
    paddingEnd: 24,
  },
  text: {
    color: color.foreground.color,
    fontSize: 16,
    textAlign: "center",
    lineHeight: HEIGHT * 0.8,
  },
});
