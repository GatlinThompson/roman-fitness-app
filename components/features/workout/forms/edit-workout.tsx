import { getWorkout } from "@/lib/supabase/queries";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import LiftForm from "../../forms/LiftForm";

export default function EditWorkout({
  date,
  id,
}: {
  date: string;
  id: number;
}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["workout", date],
    queryFn: () => getWorkout(date),
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiftForm
        initialDate={date}
        initialLifts={data?.workout_lifts || []}
        workoutId={id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
