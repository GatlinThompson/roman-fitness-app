import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

type BackButtonProps = {
  route?: string;
};

export default function BackButton({ route }: BackButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => router.back()}>
      <MaterialIcons name="arrow-back" size={32} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
});
