import { View, Text, Image, TouchableOpacity } from "react-native";
import { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import mechanic from "../assets/icon.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Toast from "react-native-toast-message";

const Onboarding = () => {

  const { setUser } = useContext(AppContext)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const User = storedUser ? JSON.parse(storedUser) : null;

        if (User && User.token) {
          const res = await axios.get(
            `${process.env.EXPO_PUBLIC_API_SERVER}/user/verify`,
            {
              headers: {
                Authorization: `Bearer ${User.token}`,
              },
            },
          );

          if (!res.data)
            return Toast.show({
              type: "error",
              text1: "Server Unreachable",
            });

          if (!res.data.isValid) {
            Toast.show({
              type: "error",
              text1: "Login Expired",
              text2: "Please log in again"
            });
            return router.push("/login")
          }

          setUser({ ...res.data.isValid, token: User.token });
          Toast.show({
            type: "success",
            text1: `Welcome back ${User.name}`,
            text2: `Logged in as ${User.email}`,
          });
          router.replace("/home");
        }
        // Otherwise, do nothing and let them see the onboarding screen!
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      <View className="flex flex-1 items-center justify-center gap-y-4 px-8">
        <View
          className="mb-2 h-36 w-36 items-center justify-center rounded-full"
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 3,
            borderColor: "#EF4444",
          }}
        >
          <Image source={mechanic} className="h-28 w-28 rounded-full" />
        </View>
        <Text className="text-5xl font-bold text-gray-900 tracking-wide">
          MechCommerce
        </Text>
        <Text
          style={{ color: "#6B7280" }}
          className="text-center text-base leading-6"
        >
          Your one-stop shop for genuine vehicle spare parts & accessories
        </Text>
        <View className="mt-2 flex-row gap-x-3">
          {["🏍️", "🚗", "🔧", "⚙️"].map((icon, i) => (
            <View
              key={i}
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <Text className="text-2xl">{icon}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        className="mx-6 mb-12 flex-row items-center justify-center gap-x-3 rounded-2xl py-4"
        style={{ backgroundColor: "#EF4444" }}
        onPress={() => router.push("login")}
      >
        <Text className="text-lg font-bold text-white">Get Started</Text>
        <Entypo name="chevron-right" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Onboarding;
