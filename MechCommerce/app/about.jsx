import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const About = () => {
  const WHY_US = [
    { logo: "✅", head: "Genuine Parts", desc: "100% original spare parts" },
    { logo: "🛒", head: "Easy Shopping", desc: "Smooth & Simple UI" },
    { logo: "🔐", head: "Secure Login", desc: "Safe Authentication" },
    { logo: "⚡", head: "Fast Delivery", desc: "Quick order processing" },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View className="flex flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">About Us</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1 px-5 pt-4">
        {/* Intro */}
        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">Welcome to MechPro Tools</Text>
          <Text className="text-base text-gray-600 leading-6 text-justify mb-3">
            Your trusted online destination for genuine mechanic tools and quality spare parts.
          </Text>
          <Text className="text-base text-gray-600 leading-6 text-justify mb-3">
            We are committed to providing reliable tools and components for bike mechanics, car workshops, and automotive professionals. Our platform connects customers with verified suppliers to ensure quality, durability, and fair pricing in every purchase.
          </Text>
          <Text className="text-base text-gray-600 leading-6 text-justify">
            At MechPro Tools, we understand how important the right tool is for the right job. That's why we focus on offering carefully curated products, simple ordering, and a smooth shopping experience.
          </Text>
        </View>

        {/* Mission & Vision */}
        <View className="flex-row justify-between mb-4 gap-x-4">
          <View className="flex-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-2">🚀 Mission</Text>
            <Text className="text-sm text-gray-600 leading-5 text-justify">
              To make professional-grade mechanic tools easily accessible to everyone through a secure and user-friendly platform.
            </Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-2">👁️ Vision</Text>
            <Text className="text-sm text-gray-600 leading-5 text-justify">
              To become a leading digital marketplace for automotive tools and spare parts across India.
            </Text>
          </View>
        </View>

        {/* Why Choose Us */}
        <Text className="text-lg font-bold text-gray-900 mb-3 mt-2 ml-1">Why MechPro?</Text>
        <View className="mb-6 gap-y-3">
          {WHY_US.map((item, i) => (
            <View
              key={i}
              className="flex-row items-center gap-x-4 rounded-2xl p-4 border border-gray-200 shadow-sm"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
                <Text className="text-2xl">{item.logo}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-base">{item.head}</Text>
                <Text style={{ color: "#6B7280" }} className="text-sm mt-0.5">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact & Location */}
        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 items-center">
          <Text className="text-lg font-bold text-gray-900 mb-1">📍 Serving You Better</Text>
          <Text className="text-center text-gray-600 leading-5 mb-4">
            Based in Tamil Nadu, India, MechPro Tools proudly serves customers across regions with a focus on trust, quality, and innovation.
          </Text>
          <View className="bg-gray-50 py-3 px-6 rounded-xl border border-gray-100 w-full items-center">
            <Text className="text-base font-bold text-gray-900">🔧 MechPro Tools</Text>
            <Text className="text-sm text-gray-500 mt-1">Powering Mechanics. Driving Trust.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
