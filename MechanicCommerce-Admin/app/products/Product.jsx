import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Switch,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import imageStore from "../store/imageStore";

// Get screen width for the slider
const { width } = Dimensions.get("window");

const Product = () => {
  const { index } = useLocalSearchParams();
  const productIndex = parseInt(index);
  const { products, setProducts, user, vehicles } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);

  // Guard logic
  if (isNaN(productIndex) || !products[productIndex]) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-slate-500 font-medium mb-4">
          Product not found.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-slate-200 px-6 py-3 rounded-xl"
        >
          <Text className="font-bold text-slate-900">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Local state for edits
  const [name, setName] = useState(products[productIndex].name);
  const [price, setPrice] = useState(products[productIndex].price.toString());
  const [category, setCategory] = useState(products[productIndex].category);
  const [stock, setStock] = useState(products[productIndex].stock.toString());
  const [description, setDescription] = useState(
    products[productIndex].description || "",
  );
  
  const [compatibilities, setCompatibilities] = useState(() => {
    const initial = [];
    const prodVehicles = products[productIndex].vehicle;
    if (Array.isArray(prodVehicles)) {
      prodVehicles.forEach(v => {
        const brandName = typeof v.brand === 'object' ? v.brand.brand || v.brand.name : v.brand;
        const realBrand = vehicles?.find(b => b.brand === brandName) || { brand: brandName };
        const models = Array.isArray(v.model) ? v.model : [v.model].filter(Boolean);
        models.forEach(m => {
          initial.push({ brand: realBrand, model: m });
        });
      });
    }
    return initial;
  });

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [images, setImages] = useState(products[productIndex].images || []);
  const [isFeatured, setIsFeatured] = useState(products[productIndex].isFeatured || false);

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
        (c) => (c.brand._id === selectedBrand._id || c.brand.brand === selectedBrand.brand) && c.model === selectedModel
      );
      if (!exists) {
        setCompatibilities([...compatibilities, { brand: selectedBrand, model: selectedModel }]);
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
        type: `image/${imageUri.split('.').pop() || 'jpg'}`,
        name: `photo.${imageUri.split('.').pop() || 'jpg'}`,
      });
      data.append("upload_preset", process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      const result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.log("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      let uploadedUrls = [];
      if (images.length > 0) {
        const uploadPromises = images.map(async (uri) => {
          if (uri.startsWith('http')) return uri;
          return await uploadToCloudinary(uri);
        });
        const results = await Promise.all(uploadPromises);
        uploadedUrls = results.filter((url) => url !== null);
      }

      const formattedVehicles = Object.values(
        compatibilities.reduce((acc, c) => {
          const brandName = typeof c.brand === 'object' ? (c.brand.brand || c.brand.name || String(c.brand._id)) : String(c.brand);
          
          if (!acc[brandName]) {
            acc[brandName] = { brand: brandName, model: [] };
          }
          if (!acc[brandName].model.includes(c.model)) {
            acc[brandName].model.push(c.model);
          }
          return acc;
        }, {})
      );

      const updatedProduct = {
        name,
        price: parseInt(price) || 0,
        category,
        stock: parseInt(stock) || 0,
        description,
        vehicle: formattedVehicles,
        images: uploadedUrls,
        isFeatured,
      };

      const res = await axios.put(
        `${process.env.EXPO_PUBLIC_API_SERVER}/product/${products[productIndex]._id}`,
        updatedProduct,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // update local memory
      const newProducts = [...products];
      newProducts[productIndex] = { ...newProducts[productIndex], ...updatedProduct };
      setProducts(newProducts);
      
      Toast.show({ type: "success", text1: "Product updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      Toast.show({ type: "error", text1: "Failed to update product" });
    } finally {
      setIsSaving(false);
    }
  };

  const product = products[productIndex];
  const displayImages =
    images && images.length > 0
      ? images
      : ["https://via.placeholder.com/500"];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const scrollIndex = Math.round(scrollPosition / width);
    setActiveIndex(scrollIndex);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image Slider */}
        <View className="relative w-full h-[400px] bg-slate-200">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="w-full h-full"
          >
            {displayImages.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={{ width, height: 400 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          {displayImages.length > 1 && (
            <View className="absolute bottom-12 w-full flex-row justify-center gap-2">
              {displayImages.map((_, i) => (
                <View
                  key={i}
                  className={`h-2 rounded-full ${activeIndex === i ? "w-6 bg-rose-600" : "w-2 bg-white/60"}`}
                />
              ))}
            </View>
          )}

          {/* Top Bar Overlay */}
          <View className="absolute top-12 w-full px-5 flex-row justify-between items-center z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/90 p-3 rounded-full shadow-sm"
              style={{ elevation: 5 }}
            >
              <Feather name="chevron-left" size={24} color="#0F172A" />
            </TouchableOpacity>

            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-white/90 p-3 rounded-full shadow-sm"
                style={{ elevation: 5 }}
              >
                <Feather name="edit-2" size={20} color="#0F172A" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                className="bg-green-600 px-5 py-2.5 rounded-full shadow-lg flex-row items-center gap-2"
                style={{ elevation: 5, opacity: isSaving ? 0.7 : 1 }}
              >
                <Feather name="check" size={18} color="white" />
                <Text className="text-white font-bold text-base">{isSaving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Details Section */}
        <View className="bg-slate-50 -mt-6 rounded-t-[32px] px-6 pt-8 pb-32">
          {!isEditing ? (
            <>
              {/* View Mode */}
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text
                    className="text-3xl font-extrabold text-slate-900 mb-1"
                    style={{ letterSpacing: -0.5 }}
                  >
                    {name}
                  </Text>

                  <View className="flex-row items-center gap-2 mb-4">
                    <Text className="text-slate-500 font-medium">
                      {category}
                    </Text>
                    <View className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    <View className="flex-row items-center gap-1">
                      <Feather name="star" size={14} color="#F59E0B" />
                      <Text className="text-slate-700 font-bold">4.8</Text>
                      <Text className="text-slate-400 font-medium">
                        (120+ reviews)
                      </Text>
                    </View>
                  </View>

                  <Text className="text-rose-600 font-black text-3xl mb-4">
                    ₹{price}
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap gap-3 mb-8">
                <View
                  className={`px-4 py-2.5 rounded-2xl flex-row items-center gap-2 ${parseInt(stock) < 5 ? "bg-rose-50 border border-rose-100" : "bg-green-50 border border-green-100"}`}
                >
                  <Feather
                    name="package"
                    size={18}
                    color={parseInt(stock) < 5 ? "#E11D48" : "#16A34A"}
                  />
                  <Text
                    className={`font-bold ${parseInt(stock) < 5 ? "text-rose-600" : "text-green-700"}`}
                  >
                    {stock} Units in Stock
                  </Text>
                </View>
                {product.isFeatured && (
                  <View className="px-4 py-2.5 rounded-2xl flex-row items-center gap-2 bg-amber-50 border border-amber-100">
                    <Feather name="star" size={18} color="#D97706" />
                    <Text className="font-bold text-amber-700">Featured</Text>
                  </View>
                )}
              </View>

              {/* Delivery Features */}
              <View className="bg-white border border-slate-100 rounded-3xl p-5 mb-8 shadow-sm">
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Feather name="truck" size={24} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-bold text-base mb-0.5">
                      Free Premium Delivery
                    </Text>
                    <Text className="text-slate-500 text-sm">
                      Estimated delivery in 2-3 business days
                    </Text>
                  </View>
                </View>
                <View className="h-[1px] bg-slate-100 my-1 mx-2" />
                <View className="flex-row items-center gap-4 mt-4">
                  <View className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Feather name="refresh-ccw" size={24} color="#F97316" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-bold text-base mb-0.5">
                      Hassle-Free Returns
                    </Text>
                    <Text className="text-slate-500 text-sm">
                      7 days easy return & refund policy
                    </Text>
                  </View>
                </View>
              </View>

              {/* Vehicle Compatibility */}
              {product.vehicle && Array.isArray(product.vehicle) && product.vehicle.length > 0 ? (
                <View className="mb-8">
                  <Text className="text-xl font-bold text-slate-900 mb-4">
                    Compatibility
                  </Text>
                  <View className="bg-slate-100 px-5 py-5 rounded-2xl border border-slate-200 shadow-sm">
                    <View className="flex-row items-center gap-3 mb-4 border-b border-slate-200 pb-3">
                      <View className="bg-white p-2 rounded-full shadow-sm">
                        <Feather name="settings" size={20} color="#475569" />
                      </View>
                      <Text className="text-slate-900 font-bold text-lg">
                        Designed for
                      </Text>
                    </View>
                    
                    <View className="gap-5">
                      {product.vehicle.map((v, i) => {
                        const brandName = typeof v.brand === 'object' ? v.brand.name || 'Unknown' : v.brand || 'Unknown';
                        const modelsArray = Array.isArray(v.model) ? v.model : [v.model].filter(Boolean);
                        
                        return (
                          <View key={i}>
                            <Text className="text-slate-800 font-bold text-base mb-2 ml-1">
                              {brandName}
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                              {modelsArray.map((m, j) => (
                                <View key={j} className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                                  <Text className="text-slate-600 font-medium text-sm">
                                    {m}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              ) : null}

              {/* Description Phase */}
              <View>
                <Text className="text-xl font-bold text-slate-900 mb-4">
                  About this product
                </Text>
                <Text className="text-slate-600 text-base leading-relaxed">
                  {description ||
                    "No elaborate description provided for this spare part yet. Please reach out to product authorities for more technical parameters."}
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <Text className="text-2xl font-bold text-slate-900 mb-6 px-1">
                Edit Master Details
              </Text>

              <View className="gap-5">
                <View>
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                    Product Title
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className="bg-white border-2 border-slate-100 focus:border-slate-300 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold shadow-sm"
                  />
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                      Price (₹)
                    </Text>
                    <TextInput
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                      className="bg-white border-2 border-slate-100 focus:border-slate-300 rounded-2xl px-5 py-4 text-rose-600 text-base font-black shadow-sm"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                      Stock Left
                    </Text>
                    <TextInput
                      value={stock}
                      onChangeText={setStock}
                      keyboardType="numeric"
                      className="bg-white border-2 border-slate-100 focus:border-slate-300 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold shadow-sm"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-3 ml-1">
                    Classification Category
                  </Text>
                  <View className="flex-row flex-wrap gap-3">
                    {["Bike", "Car", "Engine", "Accessories"].map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        className={`px-5 py-3 rounded-full border-2 ${
                          category === cat 
                            ? "bg-slate-900 border-slate-900 shadow-sm" 
                            : "bg-white border-slate-100 shadow-sm"
                        }`}
                      >
                        <Text 
                          className={`font-bold ${
                            category === cat ? "text-white" : "text-slate-500"
                          }`}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Images Upload Section */}
                <View>
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                    Product Images
                  </Text>
                  <View className="bg-white border-2 border-slate-100 rounded-2xl px-5 py-5 shadow-sm">
                    <View className="flex-row flex-wrap gap-3">
                      {images.map((uri) => (
                        <View key={uri} style={{ width: 80, height: 80 }}>
                          <ExpoImage
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
                      {images.length < 5 && (
                        <View className="gap-2">
                          <TouchableOpacity
                            onPress={openCamera}
                            className="w-[80px] h-[37px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center flex-row gap-1.5"
                          >
                            <Feather name="camera" size={14} color="#94A3B8" />
                            <Text className="text-slate-400 text-[10px] font-semibold">Camera</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={openGallery}
                            className="w-[80px] h-[37px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center flex-row gap-1.5"
                          >
                            <Feather name="image" size={14} color="#94A3B8" />
                            <Text className="text-slate-400 text-[10px] font-semibold">Gallery</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Vehicle Dropdowns */}
                <View>
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                    Vehicle Compatibility
                  </Text>
                  <View className="bg-white border-2 border-slate-100 rounded-2xl px-5 py-5 shadow-sm">
                    {compatibilities.length > 0 && (
                      <View className="flex-row flex-wrap gap-2 mb-3">
                        {compatibilities.map((c, i) => (
                          <View key={i} className="flex-row items-center bg-rose-50 px-3 py-2 rounded-full border border-rose-100">
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
                    
                    <View className="flex-row gap-4 mb-3">
                      <View className="flex-1">
                        <TouchableOpacity
                          className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 flex-row justify-between items-center"
                          onPress={() => { setBrandOpen(!brandOpen); setModelOpen(false); }}
                        >
                          <Text className={selectedBrand ? "text-slate-900 font-bold" : "text-slate-400"}>
                            {selectedBrand ? selectedBrand.brand : "Brand"}
                          </Text>
                          <Feather name={brandOpen ? "chevron-up" : "chevron-down"} size={18} color="#94A3B8" />
                        </TouchableOpacity>

                        {brandOpen && (
                          <View className="bg-white border border-slate-200 rounded-2xl max-h-40 mt-2 shadow-sm overflow-hidden z-10">
                            <ScrollView nestedScrollEnabled>
                              {vehicles && vehicles.map((v) => (
                                <TouchableOpacity
                                  key={v._id}
                                  className="px-4 py-3 border-b border-slate-50"
                                  onPress={() => { setSelectedBrand(v); setSelectedModel(""); setBrandOpen(false); }}
                                >
                                  <Text className="text-slate-700 font-bold">{v.brand}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                      </View>

                      <View className="flex-1">
                        <TouchableOpacity
                          className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 flex-row justify-between items-center"
                          onPress={() => { if (selectedBrand) setModelOpen(!modelOpen); }}
                        >
                          <Text className={selectedModel ? "text-slate-900 font-bold" : "text-slate-400"}>
                            {selectedModel || "Model"}
                          </Text>
                          <Feather name={modelOpen ? "chevron-up" : "chevron-down"} size={18} color="#94A3B8" />
                        </TouchableOpacity>

                        {modelOpen && selectedBrand && (
                          <View className="bg-white border border-slate-200 rounded-2xl max-h-40 mt-2 shadow-sm overflow-hidden z-10">
                            <ScrollView nestedScrollEnabled>
                              {selectedBrand.model && selectedBrand.model.map((m, idx) => (
                                <TouchableOpacity
                                  key={idx}
                                  className="px-4 py-3 border-b border-slate-50"
                                  onPress={() => { setSelectedModel(m); setModelOpen(false); }}
                                >
                                  <Text className="text-slate-700 font-bold">{m}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={addCompatibility}
                      disabled={!selectedBrand || !selectedModel}
                      className={`rounded-xl py-3 items-center ${selectedBrand && selectedModel ? "bg-slate-900" : "bg-slate-200"}`}
                    >
                      <Text className={selectedBrand && selectedModel ? "text-white font-bold" : "text-slate-400 font-bold"}>
                        + Add Vehicle
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                    Product Description
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                    className="bg-white border-2 border-slate-100 focus:border-slate-300 rounded-2xl px-5 py-4 text-slate-900 text-base font-medium shadow-sm"
                    style={{ textAlignVertical: "top" }}
                  />
                </View>

                {/* Featured Toggle */}
                <View className="flex-row justify-between items-center bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
                  <View>
                    <Text className="text-slate-900 font-bold text-base">Featured Product</Text>
                    <Text className="text-slate-500 text-xs mt-1">Show this product on the home screen</Text>
                  </View>
                  <Switch
                    value={isFeatured}
                    onValueChange={setIsFeatured}
                    trackColor={{ false: "#cbd5e1", true: "#e11d48" }}
                    thumbColor={"#ffffff"}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Product;
