import { supabase } from "@/lib/supabase/client";
import { font } from "@/styles/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "signin" | "signup";

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setSuccess("Account created! Sign in to continue.");
        setMode("signin");
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setSuccess(null);
    setMode((m) => (m === "signin" ? "signup" : "signin"));
  };

  return (
    <LinearGradient
      colors={["#09080F", "#1D1013"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.65 }}
      locations={[0.2, 1]}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.subtitle}>
                {mode === "signin"
                  ? "Sign in to continue"
                  : "Create your account"}
              </Text>
            </View>

            <View style={styles.form}>
              {success && (
                <View style={styles.successBanner}>
                  <Text style={styles.successText}>{success}</Text>
                </View>
              )}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#4a4a4a"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#4a4a4a"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>

              {error && <Text style={styles.error}>{error}</Text>}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#dedfdf" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </Text>
                )}
              </Pressable>

              <Pressable onPress={toggleMode} style={styles.toggleRow}>
                <Text style={styles.toggleText}>
                  {mode === "signin"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <Text style={styles.toggleLink}>
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 48,
  },
  header: {
    gap: 8,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 80,
  },
  subtitle: {
    ...font.montserratMedium,
    fontSize: 15,
    color: "#8d8d8d",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    ...font.montserratMedium,
    fontSize: 12,
    color: "#8d8d8d",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    ...font.montserratRegular,
    fontSize: 15,
    color: "#dedfdf",
    backgroundColor: "#1c1c1c33",
    borderWidth: 1,
    borderColor: "#262525",
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    ...font.montserratRegular,
    fontSize: 13,
    color: "#ffa2a2",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#c42222",
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...font.montserratSemiBold,
    fontSize: 14,
    color: "#dedfdf",
    letterSpacing: 1,
  },
  toggleRow: {
    alignItems: "center",
    paddingTop: 4,
  },
  toggleText: {
    ...font.montserratRegular,
    fontSize: 13,
    color: "#8d8d8d",
  },
  toggleLink: {
    ...font.montserratMedium,
    color: "#dedfdf",
  },
  successBanner: {
    backgroundColor: "#1a2e1a",
    borderWidth: 1,
    borderColor: "#2d5a2d",
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  successText: {
    ...font.montserratMedium,
    fontSize: 13,
    color: "#86efac",
  },
});
