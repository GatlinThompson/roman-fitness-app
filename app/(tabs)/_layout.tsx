import { Tabs } from "expo-router";
import React from "react";
import { ViewStyle } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { DashboardIcon, PhaseIcon, WorkoutIcon } from "@/components/tab-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const tabBarStyles: ViewStyle = {
  position: "absolute",
  backgroundColor: "#0F0E0E",
  borderRadius: 4,
  marginBottom: 32 + 24,
  marginHorizontal: 16,
  paddingTop: 8,
  height: 52,
  borderWidth: 1,
  borderColor: "#262525",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        animation: "fade",
        sceneStyle: {
          backgroundColor: "transparent",
        },
        tabBarButton: HapticTab,
        tabBarStyle: tabBarStyles,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => <WorkoutIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="phases"
        options={{
          title: "Phases",
          tabBarIcon: ({ color }) => <PhaseIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
