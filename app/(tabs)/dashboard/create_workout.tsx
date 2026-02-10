import NestedContainerView from "@/components/layout/nested-container-view";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CreateWorkout() {
  return (
    <NestedContainerView>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Create Workout</Text>
        </TouchableOpacity>
      </View>
    </NestedContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
