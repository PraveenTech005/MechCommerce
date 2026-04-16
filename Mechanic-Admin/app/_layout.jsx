import { Stack } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";
import { AppProvider } from "../context/AppContext";

const RootLayout = () => {
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
