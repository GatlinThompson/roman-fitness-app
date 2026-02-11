import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        animation: "fade",
        sceneStyle: {
          backgroundColor: "#140505",
        },
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#0a0707",
          paddingRight: 8,
          paddingLeft: 8,
          paddingTop: 6,
          marginBottom: 32,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="phases"
        options={{
          title: "Phases",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="timeline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
