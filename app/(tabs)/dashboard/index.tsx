import CalendarView from "@/components/features/calendar/calendar-component/calendar-view";
import WorkoutList from "@/components/features/calendar/calendar-workout/workout-list";

import ContainerView from "@/components/layout/container-view";

export default function TabTwoScreen() {
  return (
    <ContainerView bottomSpace={false}>
      <CalendarView />
      <WorkoutList />
    </ContainerView>
  );
}
