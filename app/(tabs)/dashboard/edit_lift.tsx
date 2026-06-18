import LiftInput from "@/components/features/forms/LiftInput";
import BackButton from "@/components/layout/back-button";
import NestedContainerView from "@/components/layout/nested-container-view";
import { getLiftEditContext, setPendingLiftEdit } from "@/lib/pendingLiftEdit";
import { font } from "@/styles/fonts";
import { router } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EditLiftScreen() {
  // Read context set by LiftInputGroup before navigating here — avoids URL param encoding issues
  const context = useMemo(() => getLiftEditContext(), []);
  const index = context?.index ?? -1;
  const initialLiftData = context?.liftData ?? null;
  const isNew = index === -1;

  const latestDataRef = useRef(
    initialLiftData ?? { exercise: "", reps: "", tempo: "", superSet: null },
  );

  const handleDataChange = useCallback((data: any, _seq: number) => {
    latestDataRef.current = data;
  }, []);

  const handleSave = () => {
    setPendingLiftEdit({ index, liftData: latestDataRef.current });
    router.back();
  };

  return (
    <NestedContainerView>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>{isNew ? "New Lift" : "Edit Lift"}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <LiftInput
              sequence={index + 1}
              initialData={
                initialLiftData ? { lift: initialLiftData } : undefined
              }
              onDataChange={handleDataChange}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>
                {isNew ? "Add Lift" : "Update Lift"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </NestedContainerView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    // position: "absolute",
    // bottom: 64,
    // left: 8,
    // right: 8,
  },
  button: {
    backgroundColor: "#0F0E0E",
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#454444",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: font.montserratBold.fontWeight,
    fontFamily: font.montserratBold.fontFamily,
    flex: 1,
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: -1,
  },
  saveButton: {
    backgroundColor: "#b41212",
    marginLeft: "auto",
    paddingVertical: 8,
    paddingHorizontal: 16,

    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: font.montserratSemiBold.fontFamily,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
