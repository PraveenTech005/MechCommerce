import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const User = storedUser ? JSON.parse(storedUser) : null;
        if (!User?.token) router.dismissAll();
        setUser(User);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      <View className="flex-row items-center px-5 py-3">
        <Ionicons
          name="chevron-back-circle-outline"
          size={36}
          color="#111827"
          onPress={() => router.back()}
        />
        <Text className="ml-3 text-lg font-bold text-gray-900">Profile</Text>
      </View>

      {/* Avatar */}
      <View className="items-center py-8">
        <View
          className="h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: "#FFFFFF", borderWidth: 3, borderColor: "#EF4444" }}
        >
          <FontAwesome name="user" size={40} color="#6B7280" />
        </View>
        <Text className="mt-3 text-xl font-bold text-gray-900">{user?.name ?? "—"}</Text>
        <Text style={{ color: "#6B7280" }} className="text-sm">{user?.email ?? "—"}</Text>
      </View>

      <View className="px-5 gap-y-3">
        {[
          { label: "Full Name", value: user?.name, icon: "person-outline" },
          { label: "Email", value: user?.email, icon: "mail-outline" },
        ].map(({ label, value, icon }) => (
          <View
            key={label}
            className="flex-row items-center gap-x-4 rounded-2xl p-4"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <Ionicons name={icon} size={20} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text style={{ color: "#6B7280" }} className="text-xs mb-0.5">{label}</Text>
              <Text className="text-gray-900 font-semibold">{value ?? "—"}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Profile;
