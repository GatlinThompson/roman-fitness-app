import { color } from "@/styles/color";
import { StyleSheet, View } from "react-native";

export default function ShowMoreToggle() {
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 4,
          width: 100,
          backgroundColor: color.darkForeground.color,
          borderRadius: 2,
          alignSelf: "center",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
  },
});
