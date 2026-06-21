import { Phase, useGetPhase } from "@/hooks/use-get-phase";
import { color } from "@/styles/color";
import { font } from "@/styles/fonts";
import { useImage } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import PhaseWeek from "./phase_week";

export default function PhaseHeader() {
  const phase: Phase | null = useGetPhase();

  const image = useImage(require("../../../assets/images/logo.png"));
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View>
          <Text style={styles.text}>
            Phases {phase?.phase.phase_number ? phase.phase.phase_number : "1"}
          </Text>
          <PhaseWeek phaseDate={phase?.start_date ? phase.start_date : null} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.text}>
            {phase?.phase.percentage ? phase.phase.percentage : "60"}%{" "}
            <Text style={styles.redText}>1RPM</Text>
          </Text>
          <Text style={styles.grayText}>
            Level-
            {phase?.phase.phase_number ? phase.phase.phase_number : "1"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C090C",
    borderWidth: 1,
    borderBottomColor: "#625E5E",

    padding: 16,
    paddingBottom: 20,
    paddingTop: 48,
  },
  text: {
    color: color.foreground.color,
    fontSize: 32,
    fontWeight: font.montserratBold.fontWeight,
    fontFamily: font.montserratBold.fontFamily,
    marginBottom: -4,
  },
  redText: {
    color: color.primary.color,
    fontWeight: "bold",
  },
  grayText: {
    color: color.darkForeground.color,
    fontSize: 16,
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
    alignItems: "flex-end",
  },
});
