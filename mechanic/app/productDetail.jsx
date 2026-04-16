import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import products from "../seed";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const { addToCart, cartCount, selectedVehicle } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: "#F9FAFB" }}>
        <Text className="text-gray-900 text-lg">Product not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text style={{ color: "#EF4444" }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isCompatible =
    selectedVehicle.brand &&
    selectedVehicle.model &&
    product.vehicle.some(
      (v) => v.name === selectedVehicle.brand && v.model === selectedVehicle.model,
    );

  const handleAdd = () => {
    if (!product.stock) return;
    addToCart(product);
    Toast.show({ type: "success", text1: "Added to Cart", text2: product.name });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle-outline" size={36} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Product Details</Text>
        <TouchableOpacity onPress={() => router.push("/cart")} className="relative">
          <Ionicons name="cart-outline" size={28} color="#111827" />
          {cartCount > 0 && (
            <View
              className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: "#EF4444" }}
            >
              <Text className="text-xs font-bold text-white">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* ── Product Image ── */}
        <View
          className="mx-4 rounded-2xl overflow-hidden mb-4"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <Image
            source={product.image}
            className="h-64 w-full"
            resizeMode="contain"
          />
        </View>

        {/* ── Stock & Compat Badges ── */}
        <View className="flex-row gap-x-2 px-4 mb-3">
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: product.stock ? "#064E3B" : "#7F1D1D" }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: product.stock ? "#34D399" : "#FCA5A5" }}
            >
              {product.stock ? "✓ In Stock" : "✗ Out of Stock"}
            </Text>
          </View>
          {isCompatible && (
            <View className="rounded-full px-3 py-1" style={{ backgroundColor: "#1E3A8A" }}>
              <Text style={{ color: "#93C5FD" }} className="text-xs font-semibold">
                ✓ Compatible with {selectedVehicle.brand} {selectedVehicle.model}
              </Text>
            </View>
          )}
        </View>

        {/* ── Name & Price ── */}
        <View className="px-4 mb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-1">{product.name}</Text>
          <Text style={{ color: "#6B7280" }} className="text-sm capitalize mb-3">
            Category: {product.category}
          </Text>
          <Text style={{ color: "#EF4444" }} className="text-3xl font-bold">
            ₹{product.price.toLocaleString()}
          </Text>
        </View>

        {/* ── Description ── */}
        <View
          className="mx-4 rounded-2xl p-4 mb-4"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <Text className="text-base font-bold text-gray-900 mb-2">Description</Text>
          <Text style={{ color: "#6B7280" }} className="text-sm leading-5">
            {product.description}
          </Text>
        </View>

        {/* ── Vehicle Compatibility ── */}
        <View
          className="mx-4 rounded-2xl p-4 mb-8"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <Text className="text-base font-bold text-gray-900 mb-3">
            Compatible Vehicles ({product.vehicle.length})
          </Text>
          {product.vehicle.map((v, i) => {
            const isMyVehicle =
              v.name === selectedVehicle.brand && v.model === selectedVehicle.model;
            return (
              <View
                key={i}
                className="flex-row items-center gap-x-3 rounded-xl px-3 py-2.5 mb-2"
                style={{
                  backgroundColor: isMyVehicle ? "#1E3A8A" : "#F3F4F6",
                }}
              >
                <Ionicons name="checkmark-circle" size={16} color={isMyVehicle ? "#3B82F6" : "#6B7280"} />
                <Text
                  className="font-semibold"
                  style={{ color: isMyVehicle ? "#93C5FD" : "#D1D5DB" }}
                >
                  {v.name} {v.model}
                </Text>
                {isMyVehicle && (
                  <View
                    className="ml-auto rounded-full px-2 py-0.5"
                    style={{ backgroundColor: "#1D4ED8" }}
                  >
                    <Text style={{ color: "#BFDBFE" }} className="text-xs">Your vehicle</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Add to Cart Button ── */}
      <View className="px-4 pb-5 pt-3" style={{ backgroundColor: "#F9FAFB" }}>
        <TouchableOpacity
          onPress={handleAdd}
          className="flex-row items-center justify-center gap-x-2 rounded-2xl py-4"
          style={{ backgroundColor: product.stock ? "#EF4444" : "#F3F4F6" }}
        >
          <FontAwesome name="cart-plus" size={20} color="#111827" />
          <Text className="text-base font-bold text-gray-900">
            {product.stock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
