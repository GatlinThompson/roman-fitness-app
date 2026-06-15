import { Stack, Tabs, usePathname } from "expo-router";
import { tabBarStyles } from "../_layout";

export default function DashboardLayout() {
  const pathname = usePathname();
  const hideTabBar = pathname.startsWith("/dashboard/");

  return (
    <>
      <Tabs.Screen
        options={{
          tabBarStyle: hideTabBar ? { display: "none" } : tabBarStyles,
        }}
      />
      <Stack screenOptions={{ headerShown: false, animation: "simple_push" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="create_workout"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="[workoutId]"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="edit_lift"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
