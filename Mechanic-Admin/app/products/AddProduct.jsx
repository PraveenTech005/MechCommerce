import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import imageStore from "../store/imageStore";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { API_SERVER } from "@env";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500&auto=format&fit=crop";

const AddProduct = () => {
  const { products, setProducts, user } = useContext(AppContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const unsubscribe = imageStore.onChange((incoming) => {
      const fresh = imageStore.consume();
      if (fresh.length === 0) return;
      setImages((prev) => {
        const combined = [...prev, ...fresh];
        return [...new Set(combined)].slice(0, 5);
      });
    });
    return unsubscribe;
  }, []);

  const openCamera = () => {
    router.push("/products/Camera");
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages((prev) => {
        const combined = [...prev, ...uris];
        // dedupe
        return [...new Set(combined)].slice(0, 5);
      });
    }
  };

  const removeImage = (uri) => {
    setImages((prev) => prev.filter((u) => u !== uri));
  };

  const handleCreate = async () => {
    try {
      if (!name || !price) return;

      const newProduct = {
        name,
        price: parseInt(price) || 0,
        category,
        stock: parseInt(stock) || 0,
        description,
        vehicle,
        images: images.length > 0 ? images : [PLACEHOLDER],
      };

      const res = await axios.post(`${API_SERVER}/product`, newProduct, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setProducts([newProduct, ...products]);
      router.back();
    } catch (error) {
      console.log(error || "error on adding product");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        className="flex-1 px-5 pt-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between py-4 mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white p-3 rounded-full border border-slate-200"
          >
            <Feather name="chevron-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900">Add Product</Text>
          <View style={{ width: 48 }} />
        </View>

        <View className="bg-white p-6 rounded-[32px] border border-slate-100 gap-5 mb-32">
          {/* Image picker */}
          <View>
            <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-3 ml-1">
              Product Images
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {/* Existing images */}
              {images.map((uri) => (
                <View key={uri} style={{ width: 80, height: 80 }}>
                  <Image
                    source={{ uri }}
                    style={{ width: 80, height: 80, borderRadius: 14 }}
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(uri)}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 rounded-full w-5 h-5 items-center justify-center"
                  >
                    <Feather name="x" size={10} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add buttons — show if under 5 images */}
              {images.length < 5 && (
                <View className="gap-2">
                  {/* Camera */}
                  <TouchableOpacity
                    onPress={openCamera}
                    className="w-[80px] h-[37px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center flex-row gap-1.5"
                  >
                    <Feather name="camera" size={14} color="#94A3B8" />
                    <Text className="text-slate-400 text-[10px] font-semibold">
                      Camera
                    </Text>
                  </TouchableOpacity>

                  {/* Gallery */}
                  <TouchableOpacity
                    onPress={openGallery}
                    className="w-[80px] h-[37px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center flex-row gap-1.5"
                  >
                    <Feather name="image" size={14} color="#94A3B8" />
                    <Text className="text-slate-400 text-[10px] font-semibold">
                      Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text className="text-slate-400 text-[10px] mt-2 ml-1">
              Up to 5 images · tap × to remove
            </Text>
          </View>

          {/* Product Title */}
          <View>
            <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
              Product Title
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Lithium Ion Battery"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold"
            />
          </View>

          {/* Price + Stock */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                Price (₹)
              </Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor="#cbd5e1"
                keyboardType="numeric"
                className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-rose-600 text-base font-black"
              />
            </View>
            <View className="flex-1">
              <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                Stock
              </Text>
              <TextInput
                value={stock}
                onChangeText={setStock}
                placeholder="10"
                placeholderTextColor="#cbd5e1"
                keyboardType="numeric"
                className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold"
              />
            </View>
          </View>

          {/* Category */}
          <View>
            <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
              Category
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Electrical Components"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold"
            />
          </View>

          {/* Vehicle */}
          <View>
            <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
              Vehicle Compatibility
            </Text>
            <TextInput
              value={vehicle}
              onChangeText={setVehicle}
              placeholder="e.g. Universal / Yamaha R15"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold"
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Detailed description of the product."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-base font-medium"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleCreate}
            className="bg-rose-600 rounded-2xl items-center mt-4"
            style={{ paddingVertical: 18 }}
          >
            <Text className="text-white font-black text-lg">
              Create Product
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProduct;
