import CalendarView from "@/components/features/calendar/calendar-view";
import WorkoutList from "@/components/features/calendar/workout-list";
import ContainerView from "@/components/layout/container-view";
import { useWorkoutByDate } from "@/hooks/use-workout-by-date";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function TabTwoScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { workout, loading } = useWorkoutByDate(selectedDate);

  return (
    <ContainerView>
      <View style={styles.container}>
        {/* Calendar - Top Half */}
        <View style={styles.calendarSection}>
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </View>

        {/* Workout List - Bottom Half */}
        <View style={styles.workoutSection}>
          <WorkoutList
            workout={workout}
            loading={loading}
            selectedDate={selectedDate}
          />
        </View>
      </View>
    </ContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarSection: {
    paddingBottom: 12,
  },
  workoutSection: {
    flex: 1,
  },
});
