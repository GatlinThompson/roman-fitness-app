import { Phase, useGetPhase } from "@/hooks/use-get-phase";
import { color } from "@/styles/color";
import { useImage } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import PhaseImage from "./phase_image";
import PhaseWeek from "./phase_week";

export default function PhaseHeader() {
  const phase: Phase | null = useGetPhase();

  const image = useImage(require("../../../assets/images/logo.png"));
  return (
    <View style={styles.container}>
      <PhaseImage />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View>
          <Text style={styles.text}>
            Phase {phase?.phase.phase_number ? phase.phase.phase_number : "1"}
          </Text>
          <PhaseWeek phaseDate={phase?.start_date ? phase.start_date : null} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.text}>
            {phase?.phase.percentage ? phase.phase.percentage : "60"}%{" "}
            <Text style={styles.redText}>1RPM</Text>
          </Text>
          <Text style={styles.grayText}>
            Level-{phase?.phase.phase_number ? phase.phase.phase_number : "1"}{" "}
            {phase?.phase.level ? phase.phase.level : "1"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: color.blackBackground.backgroundColor,
    borderWidth: 1,
    borderColor: color.blackBackground.borderColor,
    padding: 12,
  },
  text: {
    color: color.foreground.color,
    fontSize: 24,
    fontWeight: "500",
  },
  redText: {
    color: color.primary.color,
    fontWeight: "bold",
  },
  grayText: {
    color: color.darkForeground.color,
    fontSize: 18,
    fontWeight: "500",
  },
});
