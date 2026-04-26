import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { StyleSheet } from "react-native";

export function useMontserratFonts() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
  });
  return fontsLoaded;
}

export const font = StyleSheet.create({
  montserratRegular: {
    fontFamily: "Montserrat_400Regular",
    fontWeight: "400",
  },
  montserratMedium: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: "500",
  },
  montserratSemiBold: {
    fontFamily: "Montserrat_600SemiBold",
    fontWeight: "600",
  },

  montserratBold: {
    fontFamily: "Montserrat_700Bold",
    fontWeight: "700",
  },
});
