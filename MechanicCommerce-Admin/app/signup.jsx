import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import axios from "axios";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Signup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const validateName = (n) => n.length > 2;
  const validatePassword = (p) => p.length > 6;
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleRegister = async () => {
    if (!user.name || !user.email || !user.password || !user.phone || !user.address)
      return Toast.show({ type: "info", text1: "Fill all fields" });
    if (!validateName(user.name) || !validateEmail(user.email) || !validatePassword(user.password))
      return Toast.show({ type: "info", text1: "Check field formats", text2: "Name >2 chars, valid email, password >3 chars" });

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_SERVER}/user/register`, user);
      Toast.show({ type: "success", text1: res.data.message || "Registered!", text2: "Please log in" });
      setUser({ name: "", email: "", password: "" });
      router.replace("/login");
    } catch (error) {
      console.log("SIGNUP ERROR:", error.message, error?.response?.data);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Registration failed",
        text2: "Try a different email",
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
          <View className="mb-8 items-center">
            <Text className="text-4xl font-bold text-gray-900 mb-1">Create Account</Text>
            <Text style={{ color: "#6B7280" }} className="text-sm">
              Join MechCommerce — your spare parts store
            </Text>
          </View>

          {/* Card */}
          <View
            className="w-full rounded-2xl p-6 gap-y-4"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            {/* Name */}
            <View>
              <Text style={{ color: "#6B7280" }} className="text-xs mb-2 font-semibold uppercase">
                Full Name
              </Text>
              <TextInput
                value={user.name}
                onChangeText={(t) => setUser({ ...user, name: t })}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                maxLength={30}
                className="rounded-xl px-4 py-3 text-gray-900"
                style={{ backgroundColor: "#F3F4F6" }}
              />
            </View>

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

            {/* Phone */}
            <View>
              <Text style={{ color: "#6B7280" }} className="text-xs mb-2 font-semibold uppercase">
                Phone
              </Text>
              <TextInput
                value={user.phone}
                onChangeText={(t) => setUser({ ...user, phone: t })}
                keyboardType="phone-pad"
                placeholder="+1 234 567 890"
                placeholderTextColor="#9CA3AF"
                className="rounded-xl px-4 py-3 text-gray-900"
                style={{ backgroundColor: "#F3F4F6" }}
              />
            </View>

            {/* Address */}
            <View>
              <Text style={{ color: "#6B7280" }} className="text-xs mb-2 font-semibold uppercase">
                Address
              </Text>
              <TextInput
                value={user.address}
                onChangeText={(t) => setUser({ ...user, address: t })}
                placeholder="123 Main St..."
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

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="mt-2 items-center rounded-xl py-4"
              style={{ backgroundColor: "#EF4444", opacity: loading ? 0.7 : 1 }}
            >
              <Text className="text-base font-bold text-white">
                {loading ? "Creating account…" : "Create Account"}
              </Text>
            </TouchableOpacity>

            {/* Login link */}
            <View className="flex-row items-center justify-center gap-x-1">
              <Text style={{ color: "#6B7280" }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={{ color: "#EF4444" }} className="font-semibold">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
