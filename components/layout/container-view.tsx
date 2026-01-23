import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ContainerViewProps = {
  children?: React.ReactNode;
};

export default function ContainerView({ children }: ContainerViewProps) {
  return (
    <SafeAreaView
      style={{ ...styles.background, ...styles.container }}
      edges={["top", "left", "right"]}
    >
      <LinearGradient
        colors={["#140505", "#0d0b10", "#420c0c"]}
        style={{ ...styles.background, ...styles.background_container }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.0, 0.45, 1]}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  container: {
    paddingTop: 16,
    backgroundColor: "#140505",
  },
  background_container: {
    paddingRight: 8,
    paddingLeft: 8,
  },
});
