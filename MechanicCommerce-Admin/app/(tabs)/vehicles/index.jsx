import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useContext, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";

const VehiclesIndex = () => {
  const { user } = useContext(AppContext);
  const [vehiclesData, setVehiclesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editType, setEditType] = useState("brand"); // 'brand' or 'model'
  const [editTargetId, setEditTargetId] = useState("");
  const [editTargetBrand, setEditTargetBrand] = useState("");
  const [editTargetModel, setEditTargetModel] = useState("");
  const [editNewValue, setEditNewValue] = useState("");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_SERVER}/vehicle`,
      );
      setVehiclesData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVehicles();
    }, []),
  );

  // get unique brands from vehiclesData
  const uniqueBrands = [...new Set(vehiclesData.map((v) => v.brand))];

  const openEditBrand = (id, brand) => {
    setEditType("brand");
    setEditTargetId(id);
    setEditTargetBrand(brand);
    setEditNewValue(brand);
    setEditModalVisible(true);
  };

  const openEditModel = (id, brand, model) => {
    setEditType("model");
    setEditTargetId(id);
    setEditTargetBrand(brand);
    setEditTargetModel(model);
    setEditNewValue(model);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editNewValue.trim()) {
      Alert.alert("Validation Error", "Value cannot be empty.");
      return;
    }

    const existingVehicle = vehiclesData.find((v) => v._id === editTargetId);
    if (!existingVehicle) return;

    let payload = {};
    if (editType === "brand") {
      payload = { brand: editNewValue.trim() };
    } else if (editType === "model") {
      const updatedModels = existingVehicle.model.map((m) =>
        m === editTargetModel ? editNewValue.trim() : m,
      );
      payload = { model: updatedModels };
    }

    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_SERVER}/vehicle/${editTargetId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
      fetchVehicles();
      setEditModalVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not update vehicle.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete this ${editType}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const existingVehicle = vehiclesData.find(
              (v) => v._id === editTargetId,
            );
            if (!existingVehicle) return;

            try {
              if (editType === "brand") {
                await axios.delete(
                  `${process.env.EXPO_PUBLIC_API_SERVER}/vehicle/${editTargetId}`,
                  {
                    headers: { Authorization: `Bearer ${user?.token}` },
                  },
                );
              } else if (editType === "model") {
                const updatedModels = existingVehicle.model.filter(
                  (m) => m !== editTargetModel,
                );
                await axios.put(
                  `${process.env.EXPO_PUBLIC_API_SERVER}/vehicle/${editTargetId}`,
                  { model: updatedModels },
                  {
                    headers: { Authorization: `Bearer ${user?.token}` },
                  },
                );
              }
              fetchVehicles();
              setEditModalVisible(false);
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Could not delete vehicle.");
            }
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    let desmodels = newModel.split(",");

    for (let i = 0; i < desmodels.length; i++) {
      desmodels[i] = desmodels[i].trim();
      if (!desmodels[i].trim()) {
        Alert.alert("Validation Error", "Please enter a model name.");
        return;
      }
    }

    // if (!newModel.trim()) {
    //   Alert.alert("Validation Error", "Please enter a model name.");
    //   return;
    // }

    const finalBrand =
      selectedBrand === "Others" ? newBrand.trim() : selectedBrand;
    if (!finalBrand) {
      Alert.alert("Validation Error", "Please select or enter a brand.");
      return;
    }

    const existingVehicle = vehiclesData.find(
      (v) => v.brand.toLowerCase() === finalBrand.toLowerCase(),
    );

    try {
      if (existingVehicle) {
        if (desmodels.some((m) => existingVehicle.model.includes(m))) {
          Alert.alert(
            "Info",
            "One or more models already exist for this brand.",
          );
          return;
        }

        const updatedModels = [...existingVehicle.model, ...desmodels];
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_SERVER}/vehicle/${existingVehicle._id}`,
          { model: updatedModels },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          },
        );
      } else {
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_SERVER}/vehicle`,
          { brand: finalBrand, model: [...desmodels] },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          },
        );
      }
      fetchVehicles();

      // Reset form
      setSelectedBrand("");
      setNewBrand("");
      setNewModel("");
      setBrandDropdownOpen(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save vehicle.");
    }
  };

  const renderBrandItem = ({ item }) => (
    <View className="bg-white mx-4 mb-4 p-4 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-800">{item.brand}</Text>
        <TouchableOpacity
          onPress={() => openEditBrand(item._id, item.brand)}
          className="p-1"
        >
          <Ionicons name="pencil" size={18} color="gray" />
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap">
        {item.model.map((m, index) => (
          <TouchableOpacity
            key={index}
            className="bg-gray-100 px-3 py-1.5 rounded-full mr-2 mb-2 border border-gray-200 flex-row items-center justify-between"
            onPress={() => openEditModel(item._id, item.brand, m)}
          >
            <Text className="text-gray-700 text-sm mr-2">{m}</Text>
            <Ionicons name="create-outline" size={14} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const formHeaderElement = (
    <View className="p-4">
      <Text className="text-3xl font-bold text-gray-800 mb-6 mt-2">
        Vehicles
      </Text>

      <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 z-10">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Add Vehicle
        </Text>

        <Text className="text-gray-700 font-medium mb-2">Brand</Text>
        <TouchableOpacity
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex-row justify-between items-center"
          onPress={() => setBrandDropdownOpen(!brandDropdownOpen)}
        >
          <Text className={selectedBrand ? "text-gray-800" : "text-gray-400"}>
            {selectedBrand || "Select Brand"}
          </Text>
          <Ionicons
            name={brandDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>

        {brandDropdownOpen && (
          <View className="bg-white border border-gray-200 rounded-lg max-h-40 mb-4 shadow-sm -mt-2">
            <ScrollView nestedScrollEnabled>
              {uniqueBrands.map((brand, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="p-3 border-b border-gray-100"
                  onPress={() => {
                    setSelectedBrand(brand);
                    setBrandDropdownOpen(false);
                  }}
                >
                  <Text className="text-gray-700">{brand}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                className="p-3 border-b border-gray-100 bg-blue-50"
                onPress={() => {
                  setSelectedBrand("Others");
                  setBrandDropdownOpen(false);
                }}
              >
                <Text className="text-blue-600 font-medium">+ Others</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {selectedBrand === "Others" && (
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">
              New Brand Name
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
              placeholder="Enter new brand name"
              value={newBrand}
              onChangeText={setNewBrand}
            />
          </View>
        )}

        <Text className="text-gray-700 font-medium mb-2">Model</Text>
        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 mb-6"
          placeholder="Enter model name"
          value={newModel}
          onChangeText={setNewModel}
        />

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 items-center shadow-sm"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">Save Vehicle</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-bold text-gray-800 mb-2 mt-4 ml-1">
        Existing Vehicles
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pb-12">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {loading && vehiclesData.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <FlatList
            data={vehiclesData}
            keyExtractor={(item, index) =>
              item._id ? item._id.toString() : index.toString()
            }
            renderItem={renderBrandItem}
            ListHeaderComponent={formHeaderElement}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* Edit Modal */}
        <Modal
          visible={editModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center bg-black/50"
          >
            <View className="bg-white m-5 rounded-2xl p-6 shadow-xl">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Edit {editType === "brand" ? "Brand" : "Model"}
                </Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color="gray" />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-700 font-medium mb-2">New Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 mb-6"
                value={editNewValue}
                onChangeText={setEditNewValue}
                autoFocus
              />

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-red-500 rounded-lg p-4 items-center shadow-sm flex-1 mr-2"
                  onPress={handleDelete}
                >
                  <Text className="text-white font-bold text-base">Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-blue-500 rounded-lg p-4 items-center shadow-sm flex-1 ml-2"
                  onPress={handleUpdate}
                >
                  <Text className="text-white font-bold text-base">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VehiclesIndex;
