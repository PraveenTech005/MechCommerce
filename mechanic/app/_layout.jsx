import { Stack } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";
import { CartProvider } from "../context/CartContext";

const RootLayout = () => {
  return (
    <CartProvider>
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
  );
};

export default RootLayout;
