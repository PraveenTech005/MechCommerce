import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        if (!parsedUser?.token) return router.dismissAll();
        setUser(parsedUser);
        setEditForm({
          name: parsedUser.name || "",
          phone: parsedUser.phone || "",
          address: parsedUser.address || "",
          city: parsedUser.city || "",
          pincode: parsedUser.pincode || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!user?.token) return;
    setIsSaving(true);
    try {
      const res = await axios.put(
        `${process.env.EXPO_PUBLIC_API_SERVER}/user/profile`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.status === 200) {
        const updatedUser = { ...user, ...res.data.user };
        setUser(updatedUser);
        await AsyncStorage.setItem("User", JSON.stringify(updatedUser));
        Toast.show({ type: "success", text1: "Profile Updated" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
    });
    setIsEditing(false);
  };

  const PROFILE_FIELDS = [
    { label: "Full Name", key: "name", value: user?.name, icon: "person-outline", iconFamily: "Ionicons" },
    { label: "Email", key: "email", value: user?.email, icon: "mail-outline", iconFamily: "Ionicons", readonly: true },
    { label: "Phone", key: "phone", value: user?.phone, icon: "call-outline", iconFamily: "Ionicons" },
    { label: "Address", key: "address", value: user?.address, icon: "location-outline", iconFamily: "Ionicons" },
    { label: "City", key: "city", value: user?.city, icon: "business-outline", iconFamily: "Ionicons" },
    { label: "Pincode", key: "pincode", value: user?.pincode, icon: "pin-outline", iconFamily: "Ionicons" },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200 z-10">
        <View className="flex-row items-center">
          <Ionicons
            name="chevron-back"
            size={28}
            color="#111827"
            onPress={() => router.back()}
            style={{ marginLeft: -4 }}
          />
          <Text className="ml-2 text-xl font-bold text-gray-900">Profile</Text>
        </View>
        {!isEditing && (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text className="text-base font-semibold" style={{ color: "#EF4444" }}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          {/* Avatar */}
          <View className="items-center py-6">
            <View
              className="h-24 w-24 items-center justify-center rounded-full mb-3"
              style={{ backgroundColor: "#FFFFFF", borderWidth: 3, borderColor: "#EF4444" }}
            >
              <FontAwesome name="user" size={40} color="#6B7280" />
            </View>
            <Text className="text-xl font-bold text-gray-900">{user?.name || "—"}</Text>
            <Text style={{ color: "#6B7280" }} className="text-sm mt-0.5">{user?.email || "—"}</Text>
            {user?.createdAt && (
              <View className="mt-2 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                <Text className="text-xs font-semibold text-gray-600">
                  Joined in {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
              </View>
            )}
          </View>

          {/* Fields */}
          <View className="px-5 pb-8 gap-y-3">
            {PROFILE_FIELDS.map((field) => (
              <View
                key={field.label}
                className={`flex-row items-center gap-x-4 rounded-2xl p-4 border border-gray-100 ${
                  isEditing && !field.readonly ? "border-gray-300" : ""
                }`}
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#F3F4F6" }}
                >
                  <Ionicons name={field.icon} size={20} color="#EF4444" />
                </View>
                <View className="flex-1 justify-center">
                  <Text style={{ color: "#6B7280" }} className="text-xs mb-1">
                    {field.label}
                  </Text>
                  {isEditing && !field.readonly ? (
                    <TextInput
                      className="text-gray-900 font-semibold p-0 text-base"
                      value={editForm[field.key]}
                      onChangeText={(text) => setEditForm({ ...editForm, [field.key]: text })}
                      placeholder={`Enter ${field.label}`}
                      placeholderTextColor="#9CA3AF"
                    />
                  ) : (
                    <Text className="text-gray-900 font-semibold text-base">
                      {field.value || "—"}
                    </Text>
                  )}
                </View>
              </View>
            ))}

            {/* Action Buttons */}
            {isEditing && (
              <View className="flex-row gap-x-4 mt-4">
                <TouchableOpacity
                  className="flex-1 items-center justify-center rounded-xl py-4 border border-gray-300"
                  style={{ backgroundColor: "#FFFFFF" }}
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  <Text className="text-base font-bold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="flex-1 items-center justify-center rounded-xl py-4"
                  style={{ backgroundColor: "#EF4444" }}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-base font-bold text-white">Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
