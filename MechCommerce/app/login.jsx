import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// eslint-disable-next-line import/no-unresolved
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const validatePassword = (p) => p.length > 3;
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async () => {
    if (!user.email || !user.password)
      return Toast.show({ type: "info", text1: "Fill all fields" });
    if (!validateEmail(user.email) || !validatePassword(user.password))
      return Toast.show({ type: "info", text1: "Invalid email or password format" });

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_API}/user/login`, user);
      await AsyncStorage.setItem("User", JSON.stringify(res.data.user));
      Toast.show({ type: "success", text1: res.data.message || "Logged in!" });
      setUser({ email: "", password: "" });
      router.replace("/home");
    } catch (error) {
      console.log("LOGIN ERROR:", error.message, error?.response?.data);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Login failed",
        text2: "Check credentials and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View className="flex flex-1 items-center justify-center px-6">
          {/* Heading */}
          <View className="mb-8 w-[80%]">
            <Text className="text-4xl font-bold text-gray-900 mb-1 text-center">Welcome Back</Text>
            <Text style={{ color: "#6B7280" }} className="text-sm text-center">
              Sign in to continue to MechCommerce
            </Text>
          </View>

          {/* Card */}
          <View
            className="w-full rounded-2xl p-6 gap-y-4"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            {/* Email */}
            <View>
              <Text style={{ color: "#6B7280" }} className="text-xs mb-2 font-semibold uppercase">
                Email
              </Text>
              <TextInput
                value={user.email}
                onChangeText={(t) => setUser({ ...user, email: t })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                className="rounded-xl px-4 py-3 text-gray-900"
                style={{ backgroundColor: "#F3F4F6" }}
              />
            </View>

            {/* Password */}
            <View>
              <Text style={{ color: "#6B7280" }} className="text-xs mb-2 font-semibold uppercase">
                Password
              </Text>
              <View className="flex-row items-center rounded-xl px-4" style={{ backgroundColor: "#F3F4F6" }}>
                <TextInput
                  value={user.password}
                  onChangeText={(t) => setUser({ ...user, password: t })}
                  secureTextEntry={!show}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 py-3 text-gray-900"
                />
                <TouchableOpacity onPress={() => setShow(!show)}>
                  <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="mt-2 items-center rounded-xl py-4"
              style={{ backgroundColor: "#EF4444", opacity: loading ? 0.7 : 1 }}
            >
              <Text className="text-base font-bold text-white">
                {loading ? "Signing in…" : "Login"}
              </Text>
            </TouchableOpacity>

            {/* Signup link */}
            <View className="flex-row items-center justify-center gap-x-1">
              <Text style={{ color: "#6B7280" }}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/signup")}>
                <Text style={{ color: "#EF4444" }} className="font-semibold">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
