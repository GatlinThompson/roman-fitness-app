import CalendarView from "@/components/features/calendar/calendar-component/calendar-view";
import WorkoutList from "@/components/features/calendar/calendar-workout/workout-list";

import ContainerView from "@/components/layout/container-view";
import { StyleSheet } from "react-native";

export default function TabTwoScreen() {
  return (
    <ContainerView>
      <CalendarView />
      <WorkoutList />
    </ContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
