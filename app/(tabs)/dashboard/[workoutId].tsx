import EditWorkout from "@/components/features/workout/forms/edit-workout";
import BackButton from "@/components/layout/back-button";
import NestedContainerView from "@/components/layout/nested-container-view";
import { font } from "@/styles/fonts";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function WorkoutDetails() {
  const { workoutId, date } = useLocalSearchParams();

  return (
    <NestedContainerView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginTop: 16,
          }}
        >
          <BackButton />
          <Text style={styles.title}>Edit Workout</Text>
        </View>
      </View>
      <EditWorkout date={date as string} id={Number(workoutId)} />
    </NestedContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 12,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: font.montserratBold.fontWeight,
    flex: 1,
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: -1,
    fontFamily: font.montserratBold.fontFamily,
  },
});
