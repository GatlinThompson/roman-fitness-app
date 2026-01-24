import Workout from "@/components/features/workout/workout";
import ContainerView from "@/components/layout/container-view";
import { ScrollView, StyleSheet, Text } from "react-native";

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
};

export default function HomeScreen() {
  return (
    <ContainerView>
      <ScrollView>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#dedbdb" }}>
          Workout Screen
        </Text>
        <Workout />
      </ScrollView>
    </ContainerView>
  );
}

const styles = StyleSheet.create({});
