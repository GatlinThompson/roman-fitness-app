import LiftForm from "@/components/features/forms/LiftForm";
import BackButton from "@/components/layout/back-button";
import NestedContainerView from "@/components/layout/nested-container-view";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CreateWorkout() {
  const { date } = useLocalSearchParams();

  return (
    <NestedContainerView>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Create Workout</Text>
        </View>

        <LiftForm initialDate={date as string} />
      </ScrollView>
    </NestedContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  dateSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
    textAlign: "center",
  },
});
