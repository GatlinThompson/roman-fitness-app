import LiftInput from "@/components/features/forms/LiftInput";
import BackButton from "@/components/layout/back-button";
import NestedContainerView from "@/components/layout/nested-container-view";
import {
  getLiftEditContext,
  setPendingLiftEdit,
} from "@/lib/pendingLiftEdit";
import { font } from "@/styles/fonts";
import { router } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <LiftInput
            sequence={index + 1}
            initialData={initialLiftData ? { lift: initialLiftData } : undefined}
            onDataChange={handleDataChange}
          />
        </View>
      </ScrollView>
    </NestedContainerView>
  );
}

const styles = StyleSheet.create({
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
    marginLeft: "auto",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#c42222",
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
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
