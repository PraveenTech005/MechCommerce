import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { Tabs } from "expo-router";
import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../context/AppContext";

const TabsLayout = () => {
  const { refreshData } = useContext(AppContext);

  useEffect(() => {
    refreshData();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        initialRouteName="dashboard"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#E11D48", // rose-600
          tabBarInactiveTintColor: "#94A3B8", // slate-400
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
            marginHorizontal: 15,
            marginBottom: 5,
            height: 70,
            borderRadius: 50,
            position: "absolute",
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarItemStyle: {
            borderRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Feather name="layout" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="product" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="opencart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="vehicles"
          options={{
            title: "Vehicles",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="motorbike" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Users",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
