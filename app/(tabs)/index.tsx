import PhaseHeader from "@/components/features/phases/phase_header";
import Workout from "@/components/features/workout/workout";
import ContainerView from "@/components/layout/container-view";
import { ScrollView, StyleSheet } from "react-native";

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
};

export default function HomeScreen() {
  return (
    <ContainerView>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 8 }}
        contentContainerStyle={{ gap: 20 }}
        stickyHeaderIndices={[0]}
      >
        <PhaseHeader />
        <Workout />
      </ScrollView>
    </ContainerView>
  );
}

const styles = StyleSheet.create({});
