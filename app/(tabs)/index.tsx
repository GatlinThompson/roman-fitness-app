import ContainerView from "@/components/layout/container-view";
import { supabase } from "@/lib/supabase/client";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
};

export default function HomeScreen() {
  const TestSupabase = async () => {
    const todayStr = getTodayString();
    const { data, error } = await supabase
      .from("workouts")
      .select("*, workout_lifts(sequence, lift(*, superset(*)))")
      .eq("workout_date", todayStr)
      .order("sequence", {
        foreignTable: "workout_lifts",
        ascending: true,
      });
    if (error) {
      console.error("Error fetching workouts:", error);
    } else {
      console.log("Fetched workouts:", data);
    }
  };
  useEffect(() => {
    console.warn("Workout Screen Mounted");
    TestSupabase();
  }, []);

  return (
    <ContainerView>
      <ScrollView>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#dedbdb" }}>
          Workout Screen
        </Text>
      </ScrollView>
    </ContainerView>
  );
}

const styles = StyleSheet.create({});
