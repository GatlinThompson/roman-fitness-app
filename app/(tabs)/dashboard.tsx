import ContainerView from "@/components/layout/container-view";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

import { ScrollView, Text } from "react-native";

export default function TabTwoScreen() {
  useEffect(() => {
    console.warn("Dashboard Screen Mounted");
  }, []);
  return (
    <ContainerView>
      <ScrollView>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#dedbdb" }}>
          Dashbosrd Screen
        </Text>
      </ScrollView>
    </ContainerView>
  );
}

const styles = StyleSheet.create({});
