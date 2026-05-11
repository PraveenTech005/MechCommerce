import { Stack } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";
import { CartProvider } from "../context/CartContext";
import { useEffect } from "react";
import axios from "axios";
import { AppProvider } from "../context/AppContext";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
  useEffect(() => {
    const WakeServer = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_SERVER}/user/hello`,
        );
        Toast.show({
          type: "success",
          text1: "Server is awake",
          text2: res.data.message,
        });
      } catch (error) {
        console.log("error on waking server", error);
      }
    };

    WakeServer();
  }, []);
  return (
    <AppProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <Stack
          initialRouteName="onboarding"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="home" />
          <Stack.Screen name="products" />
          <Stack.Screen name="productDetail" />
          <Stack.Screen name="cart" />
          <Stack.Screen name="searchPage" />
          <Stack.Screen name="menu" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="about" />
        </Stack>
        <Toast />
      </CartProvider>
    </AppProvider>
  );
};

export default RootLayout;
