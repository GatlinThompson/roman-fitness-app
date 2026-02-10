import { StyleSheet } from "react-native";

export const color = StyleSheet.create({
  primary: {
    color: "#c42222",
  },
  secondary: {
    color: "#ffa2a2",
  },
  foreground: {
    color: "#dedfdf",
  },
  darkForeground: {
    color: "#8d8d8d",
  },
  nested: {
    color: "#1e1e20",
  },
  darkBackground: {
    backgroundColor: "#1c1c1c33",
    borderColor: "rgb(18, 18, 18)",
    borderWidth: 1,
    boxShadow: "inset 0 -2px 4px rgba(0, 0, 0, 0.5)",
    borderBottomColor: "rgb(37, 36, 36)",
    backdropFilter: "blur(10px)",
  },
  blackBackground: {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 1,
    borderColor: "rgb(18, 18, 18",
  },
  blackFillBackground: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
});
