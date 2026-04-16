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
import products from "../seed";
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
          <View className="flex-row flex-wrap justify-between gap-y-3 pb-6 pt-1">
            {results.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push({ pathname: "/productDetail", params: { id: item.id } })
                }
                className="w-[48%] rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <Image
                  source={item.image}
                  className="h-36 w-full"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-gray-900 font-semibold text-sm mb-0.5" numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={{ color: "#6B7280" }} className="text-xs capitalize mb-1">
                    {item.category}
                  </Text>
                  <Text style={{ color: "#EF4444" }} className="font-bold mb-2">
                    ₹{item.price.toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleAdd(item)}
                    className="flex-row items-center justify-center gap-x-1 rounded-xl py-2"
                    style={{ backgroundColor: item.stock ? "#EF4444" : "#F3F4F6" }}
                  >
                    <FontAwesome name="cart-plus" size={14} color="#111827" />
                    <Text className="text-gray-900 text-xs font-semibold">
                      {item.stock ? "Add" : "Out of Stock"}
                    </Text>
                  </TouchableOpacity>
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
