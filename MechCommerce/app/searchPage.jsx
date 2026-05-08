import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import products, { CATEGORY_PLACEHOLDERS } from "../seed";

const DEFAULT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500",
];
import { router, useLocalSearchParams } from "expo-router";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";

const SearchPage = () => {
  const { name, type } = useLocalSearchParams();
  const [results, setResults] = useState([]);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    if (type === "search") {
      setResults(
        products.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase()),
        ),
      );
    } else if (type === "category") {
      setResults(
        products.filter(
          (item) => item.category.toLowerCase() === name.toLowerCase(),
        ),
      );
    }
  }, [name, type]);

  const handleAdd = (product) => {
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
        <View className="flex-1 ml-2">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
            "{name}"
          </Text>
          <Text style={{ color: "#6B7280" }} className="text-xs">
            {results.length} result{results.length !== 1 ? "s" : ""}
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

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {results.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="text-gray-900 text-lg font-bold mb-1">No Results</Text>
            <Text style={{ color: "#6B7280" }} className="text-sm text-center">
              No products found for "{name}"
            </Text>
          </View>
        ) : (
          <View className="w-full flex-row flex-wrap justify-between gap-y-4 pb-6 pt-1">
            {results.map((item, i) => (
              <TouchableOpacity
                key={item._id || i}
                onPress={() =>
                  router.push({ pathname: "/productDetail", params: { id: item._id } })
                }
                activeOpacity={0.7}
                className="w-[48%] rounded-3xl bg-white border border-slate-200 p-2 overflow-hidden shadow-sm"
              >
                <View className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  <Image
                    source={{
                      uri: item.images && item.images.length > 0
                        ? item.images[i % item.images.length]
                        : (item.category && CATEGORY_PLACEHOLDERS[item.category]
                          ? CATEGORY_PLACEHOLDERS[item.category][i % 4]
                          : DEFAULT_PLACEHOLDERS[0])
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {(!item.stock || item.stock === 0) && (
                    <View className="absolute top-2 right-2 bg-rose-500/90 px-2 py-1 rounded-md backdrop-blur-sm">
                      <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                        Out of Stock
                      </Text>
                    </View>
                  )}
                </View>

                <View className="px-2 pb-2">
                  <Text className="text-slate-900 font-bold text-base mb-1 tracking-tight" numberOfLines={1}>
                    {item.name}
                  </Text>

                  <View className="flex-row justify-between items-center mb-3">
                    <Text style={{ color: "#6B7280" }} className="text-xs font-medium" numberOfLines={1}>
                      {item.category}
                    </Text>
                    <Text className="text-slate-400 text-xs font-medium">
                      {item.stock} left
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-rose-600 font-bold text-lg">
                      ₹{item.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => item.stock && handleAdd(item)}
                      className="p-1.5 rounded-full border"
                      style={{
                        borderColor: item.stock ? "#EF4444" : "#E2E8F0",
                        backgroundColor: item.stock ? "#EF4444" : "#F8FAFC",
                      }}
                    >
                      <FontAwesome name="cart-plus" size={14} color={item.stock ? "white" : "#94A3B8"} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchPage;
