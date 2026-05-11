import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PrivacyPolicy = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View className="flex flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Privacy Policy</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1 px-5 pt-4 mb-4">
        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</Text>
          <Text className="text-base text-gray-600 leading-6 text-justify">
            We collect information to provide better services to our users. This includes basic information such as your name, email address, phone number, and shipping address when you create an account or place an order.
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">2. How We Use Information</Text>
          <Text className="text-base text-gray-600 leading-6 text-justify">
            The information we collect is used to process your orders, communicate with you about your purchases, provide customer support, and improve our platform and services.
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">3. Data Security</Text>
          <Text className="text-base text-gray-600 leading-6 text-justify">
            We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-2">4. Third-Party Services</Text>
          <Text className="text-base text-gray-600 leading-6 text-justify">
            We may share your information with trusted third-party service providers (such as payment processors and delivery partners) solely for the purpose of fulfilling your orders.
          </Text>
        </View>

        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-2">5. Your Rights</Text>
          <Text className="text-base text-gray-600 leading-6 text-justify">
            You have the right to access, update, or delete your personal information. If you have any questions about our privacy practices, please contact our support team.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
