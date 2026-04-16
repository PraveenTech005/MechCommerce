import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import products from "../seed";
import { router, useLocalSearchParams } from "expo-router";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";

const CATEGORY_TABS = [
  { key: "", label: "All" },
  { key: "bike", label: "Bike" },
  { key: "car", label: "Car" },
  { key: "engine", label: "Engine" },
  { key: "accessories", label: "Accessories" },
];

const Products = () => {
  const { brand, model, category: paramCategory } = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState(paramCategory ?? "");
  const { addToCart, cartCount } = useCart();

  const filtered = useMemo(() => {
    let list = products;

    // Vehicle filter
    if (brand && model) {
      list = list.filter((p) =>
        p.vehicle.some((v) => v.name === brand && v.model === model),
      );
    }

    // Category filter
    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }

    return list;
  }, [brand, model, activeCategory]);

  const isCompatible = (product) => {
    if (!brand || !model) return false;
    return product.vehicle.some((v) => v.name === brand && v.model === model);
  };

  const handleAdd = (product) => {
    addToCart(product);
    Toast.show({ type: "success", text1: "Added to cart", text2: product.name });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle-outline" size={36} color="#111827" />
        </TouchableOpacity>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-bold text-gray-900">
            {brand && model ? `${brand} ${model}` : "All Products"}
          </Text>
          <Text style={{ color: "#6B7280" }} className="text-xs">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
          </Text>
        </View>
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

      {/* ── Vehicle compat banner ── */}
      {brand && model && (
        <View
          className="mx-4 mb-2 flex-row items-center gap-x-2 rounded-xl px-4 py-2"
          style={{ backgroundColor: "#064E3B" }}
        >
          <Ionicons name="checkmark-circle" size={18} color="#34D399" />
          <Text style={{ color: "#34D399" }} className="text-sm font-semibold">
            Showing parts compatible with {brand} {model}
          </Text>
        </View>
      )}

      {/* ── Category Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-2"
        style={{ maxHeight: 44 }}
      >
        {CATEGORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveCategory(tab.key)}
            className="mr-2 rounded-full px-4 py-2"
            style={{
              backgroundColor: activeCategory === tab.key ? "#EF4444" : "#FFFFFF",
            }}
          >
            <Text
              className="font-semibold text-sm"
              style={{ color: activeCategory === tab.key ? "white" : "#9CA3AF" }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Product List ── */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-4xl mb-3">🔧</Text>
            <Text className="text-gray-900 text-lg font-bold mb-1">No parts found</Text>
            <Text style={{ color: "#6B7280" }} className="text-sm text-center">
              Try a different vehicle or category
            </Text>
          </View>
        ) : (
          <View className="gap-y-3 pb-6">
            {filtered.map((item) => {
              const compat = isCompatible(item);
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push({ pathname: "/productDetail", params: { id: item.id } })
                  }
                  className="flex-row items-center rounded-2xl overflow-hidden"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Image
                    source={item.image}
                    className="h-28 w-28"
                    resizeMode="cover"
                  />
                  <View className="flex-1 px-3 py-3">
                    {compat && (
                      <View
                        className="self-start rounded-full px-2 py-0.5 mb-1"
                        style={{ backgroundColor: "#064E3B" }}
                      >
                        <Text style={{ color: "#34D399" }} className="text-xs font-semibold">
                          ✓ Compatible
                        </Text>
                      </View>
                    )}
                    <Text className="text-gray-900 font-semibold" numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text
                      style={{ color: "#6B7280" }}
                      className="text-xs capitalize mt-0.5 mb-1"
                    >
                      {item.category}
                    </Text>
                    <Text style={{ color: "#EF4444" }} className="font-bold text-base">
                      ₹{item.price.toLocaleString()}
                    </Text>
                    {!item.stock && (
                      <Text style={{ color: "#F59E0B" }} className="text-xs mt-0.5">
                        Out of Stock
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => item.stock && handleAdd(item)}
                    className="mr-3 rounded-xl p-3"
                    style={{ backgroundColor: item.stock ? "#EF4444" : "#F3F4F6" }}
                  >
                    <FontAwesome name="cart-plus" size={18} color="#111827" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Products;
