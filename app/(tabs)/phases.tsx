import { StyleSheet, Text, View } from "react-native";

import ContainerView from "@/components/layout/container-view";

export default function Phases() {
  return (
    <ContainerView>
      <View style={{ paddingHorizontal: 8 }}>
        <Text style={styles.title}>Phase Management</Text>
      </View>
    </ContainerView>
  );
}
const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
