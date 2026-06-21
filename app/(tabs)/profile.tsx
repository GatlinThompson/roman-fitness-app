import { useAuth } from "@/contexts/auth-context";
import { font } from "@/styles/fonts";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ContainerView from "@/components/layout/container-view";

export default function Profile() {
  const { session, signOut } = useAuth();

  return (
    <ContainerView>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{session?.user.email ?? "—"}</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ContainerView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 8,
    marginBottom: 24,
    paddingTop: 52,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: font.montserratBold.fontWeight,
    fontFamily: font.montserratBold.fontFamily,
  },
  body: {
    paddingHorizontal: 20,
    gap: 16,
  },
  infoCard: {
    backgroundColor: "#262525",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#454444",
    gap: 4,
  },
  label: {
    color: "#a3a3a3",
    fontSize: 12,
    fontFamily: font.montserratMedium.fontFamily,
    fontWeight: font.montserratMedium.fontWeight,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    color: "white",
    fontSize: 16,
    fontFamily: font.montserratRegular.fontFamily,
    fontWeight: font.montserratRegular.fontWeight,
  },
  signOutBtn: {
    backgroundColor: "#1a0a0a",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c42222",
  },
  signOutText: {
    color: "#c42222",
    fontSize: 16,
    fontWeight: font.montserratSemiBold.fontWeight,
    fontFamily: font.montserratSemiBold.fontFamily,
  },
});
