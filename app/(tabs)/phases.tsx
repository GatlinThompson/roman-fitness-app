import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function phases() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#8f3434", dark: "#63124f" }}
      headerImage={<AntDesign name="aim" size={310} color="#058226" />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Phases
        </ThemedText>
      </ThemedView>
      <ThemedText>This is the phases screen.</ThemedText>
    </ParallaxScrollView>
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
});
