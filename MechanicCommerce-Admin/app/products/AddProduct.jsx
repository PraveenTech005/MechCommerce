import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import imageStore from "../store/imageStore";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { ActivityIndicator } from "react-native";



const AddProduct = () => {
  const { products, setProducts, user, vehicles } = useContext(AppContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [compatibilities, setCompatibilities] = useState([]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const addCompatibility = () => {
    if (selectedBrand && selectedModel) {
      const exists = compatibilities.find(
        (c) => c.brand._id === selectedBrand._id && c.model === selectedModel,
      );
      if (!exists) {
        setCompatibilities([
          ...compatibilities,
          { brand: selectedBrand, model: selectedModel },
        ]);
      }
      setSelectedBrand(null);
      setSelectedModel("");
    }
  };

  const removeCompatibility = (index) => {
    const newComps = [...compatibilities];
    newComps.splice(index, 1);
    setCompatibilities(newComps);
  };

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

  const uploadToCloudinary = async (imageUri) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri: imageUri,
        type: `image/${imageUri.split(".").pop() || "jpg"}`,
        name: `photo.${imageUri.split(".").pop() || "jpg"}`,
      });
      data.append(
        "upload_preset",
        process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      );
      data.append("cloud_name", process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.log("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const handleCreate = async () => {
    try {
      if (!name || !price) return;
      setIsSubmitting(true);

      let uploadedUrls = [];
      if (images.length > 0) {
        const uploadPromises = images.map(async (uri) => {
          if (uri.startsWith("http")) return uri;
          return await uploadToCloudinary(uri);
        });
        const results = await Promise.all(uploadPromises);
        uploadedUrls = results.filter((url) => url !== null);
      }

      const formattedVehicles = Object.values(
        compatibilities.reduce((acc, c) => {
          const brandName =
            typeof c.brand === "object"
              ? c.brand.brand || c.brand.name || String(c.brand._id)
              : String(c.brand);

          if (!acc[brandName]) {
            acc[brandName] = { brand: brandName, model: [] };
          }
          if (!acc[brandName].model.includes(c.model)) {
            acc[brandName].model.push(c.model);
          }
          return acc;
        }, {}),
      );

      const newProduct = {
        name,
        price: parseInt(price) || 0,
        category,
        stock: parseInt(stock) || 0,
        description,
        isFeatured,
        vehicle: formattedVehicles,
        images: uploadedUrls,
      };

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_SERVER}/product`,
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      // The backend returns the created product directly as res.data
      const appendedProduct = res.data && res.data._id ? res.data : newProduct;

      setProducts([...products, appendedProduct]);
      setIsSubmitting(false);
      router.back();
    } catch (error) {
      console.log(error || "error on adding product");
      setIsSubmitting(false);
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
            <Text className="font-bold text-xs uppercase tracking-wider mb-2 ml-1 text-red-500">
              Product Title <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Lithium Ion Battery"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-1 text-slate-900 text-base font-bold"
            />
          </View>

          {/* Price + Stock */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-red-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                Price (₹) <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor="#cbd5e1"
                keyboardType="numeric"
                className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-rose-600 text-base font-black"
              />
            </View>
            <View className="flex-1">
              <Text className="text-red-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                Stock <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={stock}
                onChangeText={setStock}
                placeholder="10"
                placeholderTextColor="#cbd5e1"
                keyboardType="numeric"
                className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-slate-900 text-base font-bold"
              />
            </View>
          </View>

          {/* Category */}
          <View>
            <Text className="text-red-500 font-bold text-xs uppercase tracking-wider mb-3 ml-1">
              Category <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {["Bike", "Car", "Engine", "Accessories"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-5 py-3 rounded-full border-2 ${category === cat
                    ? "bg-slate-900 border-slate-900"
                    : "bg-slate-50 border-slate-100"
                    }`}
                >
                  <Text
                    className={`font-bold ${category === cat ? "text-white" : "text-slate-500"
                      }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vehicle Dropdowns */}
          <View>
            <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
              Vehicle Compatibilities
            </Text>

            {compatibilities.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-3">
                {compatibilities.map((c, i) => (
                  <View
                    key={i}
                    className="flex-row items-center bg-rose-50 px-3 py-2 rounded-full border border-rose-100"
                  >
                    <Text className="text-rose-700 font-bold text-sm mr-2">
                      {c.brand.brand} {c.model}
                    </Text>
                    <TouchableOpacity onPress={() => removeCompatibility(i)}>
                      <Feather name="x" size={14} color="#BE123C" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View className="flex-row gap-4 mb-3 h-56">
              {/* Brands Column */}
              <View className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3">
                <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
                  Brands
                </Text>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  <View className="flex-row flex-wrap gap-2">
                    {vehicles &&
                      vehicles.map((v) => (
                        <TouchableOpacity
                          key={v._id}
                          className={`px-3 py-1.5 rounded-full border ${selectedBrand?._id === v._id
                            ? "bg-slate-900 border-slate-900"
                            : "bg-white border-slate-200"
                            }`}
                          onPress={() => {
                            setSelectedBrand(v);
                            setSelectedModel("");
                          }}
                        >
                          <Text
                            className={`font-bold  ${selectedBrand?._id === v._id
                              ? "text-white"
                              : "text-slate-600"
                              }`}
                          >
                            {v.brand}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>
              </View>

              {/* Models Column */}
              <View className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3">
                <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
                  Models
                </Text>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {selectedBrand ? (
                    <View className="flex-row flex-wrap gap-2">
                      {selectedBrand.model &&
                        selectedBrand.model.map((m, idx) => (
                          <TouchableOpacity
                            key={idx}
                            className={`px-3 py-1.5 rounded-full border ${selectedModel === m
                              ? "bg-rose-600 border-rose-600"
                              : "bg-white border-slate-200"
                              }`}
                            onPress={() => setSelectedModel(m)}
                          >
                            <Text
                              className={`font-bold text-xs ${selectedModel === m
                                ? "text-white"
                                : "text-slate-600"
                                }`}
                            >
                              {m}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  ) : (
                    <View className="flex-1 items-center justify-center pt-10">
                      <Text className="text-slate-400 text-xs text-center font-medium">
                        Select a brand
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              onPress={addCompatibility}
              disabled={!selectedBrand || !selectedModel}
              className={`rounded-xl py-3 items-center ${selectedBrand && selectedModel ? "bg-slate-900" : "bg-slate-200"
                }`}
            >
              <Text
                className={
                  selectedBrand && selectedModel
                    ? "text-white font-bold"
                    : "text-slate-400 font-bold"
                }
              >
                + Add Vehicle
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View>
            <Text className="text-red-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
              Description <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Detailed description of the product."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={5}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 text-base font-medium"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Featured Toggle */}
          <View className="flex-row justify-between items-center bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4">
            <View>
              <Text className="text-slate-900 font-bold text-base">
                Featured Product
              </Text>
              <Text className="text-slate-500 text-xs mt-1">
                Show this product on the home screen
              </Text>
            </View>
            <Switch
              value={isFeatured}
              onValueChange={setIsFeatured}
              trackColor={{ false: "#cbd5e1", true: "#e11d48" }}
              thumbColor={"#ffffff"}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={isSubmitting}
            className={`rounded-2xl items-center mt-4 ${isSubmitting ? "bg-slate-400" : "bg-rose-600"}`}
            style={{ paddingVertical: 18 }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg">
                Create Product
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProduct;
