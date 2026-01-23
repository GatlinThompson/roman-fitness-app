import ContainerView from "@/components/layout/container-view";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  return (
    <ContainerView>
      <ScrollView>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#dedbdb" }}>
          Workout Screen
        </Text>
      </ScrollView>
    </ContainerView>
  );
}

const styles = StyleSheet.create({});
