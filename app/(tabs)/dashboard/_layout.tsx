import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="create_workout"
        options={{
          headerShown: false,

          animation: "fade",
        }}
      />
    </Stack>
  );
}
