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
} from "react-native";
import React, { useContext, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../../context/AppContext";

// Get screen width for the slider
const { width } = Dimensions.get("window");

const Product = () => {
  const { index } = useLocalSearchParams();
  const productIndex = parseInt(index);
  const { products } = useContext(AppContext);

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
  const [vehicle, setVehicle] = useState(products[productIndex].vehicle || "");

  const handleSave = () => {
    // temporarily modify fdb in-memory
    products[productIndex].name = name;
    products[productIndex].price = parseInt(price) || 0;
    products[productIndex].category = category;
    products[productIndex].stock = parseInt(stock) || 0;
    products[productIndex].description = description;
    products[productIndex].vehicle = vehicle;

    setIsEditing(false);
  };

  const product = products[productIndex];
  const images =
    product.images && product.images.length > 0
      ? product.images
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
            {images.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={{ width, height: 400 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          {images.length > 1 && (
            <View className="absolute bottom-12 w-full flex-row justify-center gap-2">
              {images.map((_, i) => (
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
                className="bg-green-600 px-5 py-2.5 rounded-full shadow-lg flex-row items-center gap-2"
                style={{ elevation: 5 }}
              >
                <Feather name="check" size={18} color="white" />
                <Text className="text-white font-bold text-base">Save</Text>
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
              {vehicle ? (
                <View className="mb-8">
                  <Text className="text-xl font-bold text-slate-900 mb-4">
                    Compatibility
                  </Text>
                  <View className="bg-slate-100 px-5 py-4 rounded-2xl flex-row items-center gap-4 border border-slate-200">
                    <Feather name="settings" size={22} color="#475569" />
                    <View>
                      <Text className="text-slate-900 font-bold base">
                        Designed for
                      </Text>
                      <Text className="text-slate-600 font-medium">
                        {product.vehicle}
                      </Text>
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
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                    Classification Category
                  </Text>
                  <TextInput
                    value={category}
                    onChangeText={setCategory}
                    className="bg-white border-2 border-slate-100 focus:border-slate-300 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold shadow-sm"
                  />
                </View>

                <View>
                  <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
                    Vehicle Compatibility
                  </Text>
                  <TextInput
                    value={vehicle}
                    onChangeText={setVehicle}
                    className="bg-white border-2 border-slate-100 focus:border-slate-300 rounded-2xl px-5 py-4 text-slate-900 text-base font-bold shadow-sm"
                    placeholder="e.g. Yamaha R15 V4"
                  />
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
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Product;
