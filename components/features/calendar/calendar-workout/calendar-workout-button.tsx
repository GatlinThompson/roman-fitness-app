import { color } from "@/styles/color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

const HEIGHT = 45;

type CalendarWorkoutButtonProps = {
  editMode: boolean;
  date: string;
  id?: number;
};

export default function CalendarWorkoutButton({
  editMode,
  date,
  id,
}: CalendarWorkoutButtonProps) {
  const isSunday = new Date(date + "T00:00:00").getDay() === 0;

  if (isSunday) {
    return null; // Don't render the button on Sundays
  }

  const linkHref: any = editMode
    ? {
        pathname: "/dashboard/[workoutId]?date=" + date,
        params: { workoutId: id?.toString() },
      }
    : `/dashboard/create_workout?date=${date}`;

  return (
    <Link style={styles.container} href={linkHref}>
      <View style={styles.circle}>
        <MaterialIcons
          name={editMode ? "edit" : "add"}
          size={28}
          color={color.blackFillBackground.backgroundColor}
        />
      </View>
    </Link>
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
