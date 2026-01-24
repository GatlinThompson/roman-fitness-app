import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

// For web, we need to check if we're in a browser environment
const isServer = typeof window === "undefined";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      // Only use AsyncStorage in non-server environments
      storage: isServer ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: !isServer,
      detectSessionInUrl: Platform.OS === "web",
      // Use navigator lock for web, no lock for React Native to prevent issues
      ...(Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      navigator.locks
        ? {}
        : { lock: undefined }),
    },
  },
);
