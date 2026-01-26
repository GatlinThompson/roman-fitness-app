import { Image, useImage } from "expo-image";
import { View } from "react-native";

export default function PhaseImage() {
  const image = useImage(require("../../../assets/images/logo.png"));

  if (!image) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        marginTop: 4,
      }}
    >
      <Image
        source={image}
        style={{
          width: image.width * 0.75,
          height: image.height * 0.75,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
