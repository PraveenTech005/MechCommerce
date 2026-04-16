import { View, Text, TouchableOpacity } from "react-native";
import { Entypo, FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useCart } from "../context/CartContext";

const Menu = () => {
  const { cartCount } = useCart();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Close */}
      <TouchableOpacity
        className="flex flex-row justify-end px-4 py-2"
        onPress={() => router.back()}
      >
        <Entypo name="cross" size={36} color="#111827" />
      </TouchableOpacity>

      <View className="flex-1 justify-center gap-4 px-5">
        <TouchableOpacity
          className="flex flex-row items-center gap-x-4 rounded-2xl p-4"
          style={{ backgroundColor: "#FFFFFF" }}
          onPress={() => router.replace("profile")}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <FontAwesome name="user" size={20} color="#111827" />
          </View>
          <Text className="text-lg font-semibold text-gray-900">Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row items-center gap-x-4 rounded-2xl p-4"
          style={{ backgroundColor: "#FFFFFF" }}
          onPress={() => router.push("/cart")}
        >
          <View className="relative">
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <Ionicons name="cart-outline" size={22} color="#111827" />
            </View>
            {cartCount > 0 && (
              <View
                className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full"
                style={{ backgroundColor: "#EF4444" }}
              >
                <Text className="text-xs font-bold text-white">{cartCount}</Text>
              </View>
            )}
          </View>
          <Text className="text-lg font-semibold text-white">Cart</Text>
          {cartCount > 0 && (
            <View
              className="ml-auto rounded-full px-2 py-0.5"
              style={{ backgroundColor: "#EF4444" }}
            >
              <Text className="text-xs font-bold text-white">{cartCount} items</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex flex-row items-center gap-x-4 rounded-2xl p-4"
          style={{ backgroundColor: "#FFFFFF" }}
          onPress={() => router.replace("about")}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <FontAwesome name="info" size={20} color="#111827" />
          </View>
          <Text className="text-lg font-semibold text-gray-900">About Us</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mx-5 mb-8 flex flex-row items-center justify-center gap-x-2 rounded-2xl py-4"
        style={{ backgroundColor: "#EF4444" }}
        onPress={() => {
          AsyncStorage.removeItem("User");
          Toast.show({ type: "success", text1: "Logged Out" });
          router.dismiss();
          router.replace("/onboarding");
        }}
      >
        <MaterialIcons name="logout" size={22} color="#111827" />
        <Text className="text-lg font-bold text-gray-900">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Menu;
