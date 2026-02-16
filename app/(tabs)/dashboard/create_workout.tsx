import LiftForm from "@/components/features/forms/LiftForm";
import BackButton from "@/components/layout/back-button";
import NestedContainerView from "@/components/layout/nested-container-view";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function CreateWorkout() {
  const { date } = useLocalSearchParams();

  return (
    <NestedContainerView>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <BackButton />
          <Text style={styles.title}>Create Workout</Text>
        </View>
      </View>
      <LiftForm initialDate={date as string} />
    </NestedContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 24,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: -1,
  },
});
