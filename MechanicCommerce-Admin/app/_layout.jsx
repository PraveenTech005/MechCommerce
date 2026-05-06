import { Stack } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";
import { AppProvider } from "../context/AppContext";
import { useEffect } from "react";
import axios from "axios";

const RootLayout = () => {
  useEffect(() => {
    const WakeServer = async () => {
      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API_SERVER}/user/hello`)
        Toast.show({
          type: "success",
          text1: "Server is awake",
          text2: res.data.message
        })
      } catch (error) {
        console.log("error on waking server", error)
      }
    }

    WakeServer()
  }, [])

  return (
    <AppProvider>
      <Stack initialRouteName="onboarding">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="products/AddProduct"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="products/Camera"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <Toast />
    </AppProvider>
  );
};

export default RootLayout;
