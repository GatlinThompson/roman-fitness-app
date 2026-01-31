import CalendarView from "@/components/features/calendar/calendar-component/calendar-view";
import WorkoutList from "@/components/features/calendar/calendar-workout/workout-list";

import ContainerView from "@/components/layout/container-view";
import { StyleSheet, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <ContainerView>
      <View style={styles.calendarSection}>
        <CalendarView />
      </View>
      <View style={styles.workoutSection}>
        <WorkoutList />
      </View>
    </ContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarSection: {
    flex: 1,
  },
  workoutSection: {
    flex: 1,
    marginTop: -40,
  },
});
