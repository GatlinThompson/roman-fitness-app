import ContainerView from "@/components/layout/container-view";
import { StyleSheet } from "react-native";

import { ScrollView, Text } from "react-native";

export default function TabTwoScreen() {
  return (
    <ContainerView>
      <ScrollView>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#dedbdb" }}>
          Dashboard Screen
        </Text>
      </ScrollView>
    </ContainerView>
  );
}

const styles = StyleSheet.create({});
