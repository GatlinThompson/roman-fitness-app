import { StyleSheet, Text } from "react-native";

import ContainerView from "@/components/layout/container-view";

export default function phases() {
  return (
    <ContainerView>
      <Text style={styles.title}>Phase Management</Text>
    </ContainerView>
  );
}
const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
