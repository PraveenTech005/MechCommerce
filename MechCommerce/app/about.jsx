import { View, Text, ScrollView } from "react-native";
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
    <SafeAreaView className="flex-1">
      <View className="flex flex-row items-center justify-between">
        <Text className="w-full p-5 text-center text-xl font-bold">
          About Us
        </Text>
        <Ionicons
          name="chevron-back-circle-outline"
          size={40}
          className="absolute left-5"
          onPress={() => router.back()}
        />
      </View>
      <ScrollView className="flex-1">
        <View className="mx-auto w-10/12 gap-y-3 rounded-xl border bg-white p-5 my-2">
          <Text className="text-justify text-base">
            {"    "}
            Welcome to MechPro Tools, your trusted online destination for
            genuine mechanic tools and quality spare parts.
          </Text>
          <Text className="text-justify text-base">
            {"    "}
            We are committed to providing reliable tools and components for bike
            mechanics, car workshops, and automotive professionals. Our platform
            connects customers with verified suppliers to ensure quality,
            durability, and fair pricing in every purchase.
          </Text>
          <Text className="text-justify text-base">
            {"    "}
            At MechPro Tools, we understand how important the right tool is for
            the right job. That's why we focus on offering carefully curated
            products, simple ordering, and a smooth shopping experience.
          </Text>
        </View>
        <View className="mx-auto w-10/12 gap-y-3 rounded-xl border bg-white p-5 my-2">
          <Text>🚀 Our Mission</Text>
          <Text className="text-justify">
            Our mission is to make professional-grade mechanic tools easily
            accessible to everyone—from individual mechanics to large
            workshops—through a secure and user-friendly platform.
          </Text>
        </View>
        <View className="mx-auto w-10/12 gap-y-3 rounded-xl border bg-white p-5 my-2">
          <Text>👁️ Our Vision</Text>
          <Text className="text-justify">
            To become a leading digital marketplace for automotive tools and
            spare parts, empowering mechanics and suppliers across India with
            technology-driven solutions.
          </Text>
        </View>
        <View className="mx-auto w-10/12 gap-y-3 rounded-xl border bg-white p-5 my-2">
          <Text>✅ Why Choose MechPro Tools?</Text>
          <Text className="text-justify">
            ✔️ Genuine & quality-checked products
          </Text>
          <Text className="text-justify">
            ✔️ Verified suppliers and transparent pricing
          </Text>
          <Text className="text-justify">
            ✔️ Easy ordering & secure checkout
          </Text>
          <Text className="text-justify">
            ✔️ Supplier-friendly platform with admin verification
          </Text>
          <Text className="text-justify">
            ✔️ Customer-first support & reliability
          </Text>
        </View>
        <View className="mx-auto w-10/12 gap-y-3 rounded-xl border bg-white p-5 my-2">
          <Text>🤝 Our Commitment</Text>
          <Text className="text-justify">We are dedicated to:</Text>
          <Text className="text-justify">Delivering authentic products</Text>
          <Text className="text-justify">Ensuring secure transactions</Text>
          <Text className="text-justify">
            Supporting both customers and suppliers
          </Text>
          <Text className="text-justify">
            Continuously improving our platform
          </Text>
        </View>
        <View className="mx-auto w-10/12 gap-y-3 rounded-xl border bg-white p-5 my-2">
          <Text>📍 Serving You Better</Text>
          <Text>
            Based in Tamil Nadu, India, MechPro Tools proudly serves customers
            across regions with a focus on trust, quality, and innovation.
          </Text>
        </View>
        <View>
          <Text>🔧 MechPro Tools</Text>
          <Text>Powering Mechanics. Driving Trust.</Text>
        </View>

        {/* ── Why Choose Us ── */}
        <Text className="mx-4 mt-2 mb-3 text-lg font-bold text-gray-900">Why MechPro?</Text>
        <View className="mx-4 mb-8 gap-y-3">
          {WHY_US.map((item, i) => (
            <View
              key={i}
              className="flex-row items-center gap-x-4 rounded-xl px-4 py-3"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <Text className="text-2xl">{item.logo}</Text>
              <View>
                <Text className="font-bold text-gray-900">{item.head}</Text>
                <Text style={{ color: "#6B7280" }} className="text-sm">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
