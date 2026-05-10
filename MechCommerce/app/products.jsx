import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import products, { CATEGORY_PLACEHOLDERS } from "../seed";

const DEFAULT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500",
];
import { router, useLocalSearchParams } from "expo-router";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";

const CATEGORY_TABS = [
  { key: "All", label: "All" },
  { key: "Bike", label: "Bike" },
  { key: "Car", label: "Car" },
  { key: "Engine", label: "Engine" },
  { key: "Accessories", label: "Accessories" },
];

const Products = () => {
  const { brand, model, category: paramCategory } = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState(paramCategory || "All");
  const { addToCart, cartCount, cart, updateQty } = useCart();

  const filtered = useMemo(() => {
    let list = products;

    // Vehicle filter
    if (brand && model) {
      list = list.filter((p) =>
        p.vehicle.some((v) => v.brand === brand && v.model.includes(model)),
      );
    }

    // Category filter
    if (activeCategory && activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    return list;
  }, [brand, model, activeCategory]);

  const isCompatible = (product) => {
    if (!brand || !model) return false;
    return product.vehicle.some((v) => v.brand === brand && v.model.includes(model));
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
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-2"
        style={{ maxHeight: 44 }}
        contentContainerStyle={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly" }}

      > */}
      <View className="flex flex-row justify-evenly w-full px-4 py-2">
        {CATEGORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveCategory(tab.key)}
            className="rounded-full px-5 py-2 border-2 border-gray-200"
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
        ))}</View>
      {/* </ScrollView> */}

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
          <View className="w-full flex-row flex-wrap justify-between gap-y-4 pb-6">
            {filtered.map((item, i) => {
              const compat = isCompatible(item);
              return (
                <TouchableOpacity
                  key={item._id || i}
                  onPress={() =>
                    router.push({ pathname: "/productDetail", params: { id: item._id, brand, model } })
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
                    {compat && (
                      <View className="absolute top-2 left-2 bg-[#064E3B]/90 px-2 py-1 rounded-md backdrop-blur-sm">
                        <Text className="text-[#34D399] text-[10px] font-bold tracking-wider">
                          ✓ Compatible
                        </Text>
                      </View>
                    )}
                    {(!item.stock || item.stock === 0) && (
                      <View className="absolute top-2 right-2 bg-rose-500/90 px-2 py-1 rounded-md backdrop-blur-sm">
                        <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                          Out of Stock
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="px-2 pb-2">
                    <Text
                      className="text-slate-900 font-bold text-base mb-1 tracking-tight"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>

                    <View className="flex-row justify-between items-center mb-3">
                      <Text
                        className="text-slate-500 text-xs font-medium"
                        numberOfLines={1}
                      >
                        {item.category}
                      </Text>
                      <Text className="text-slate-400 text-xs font-medium">
                        {item.stock} left
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center mt-1">
                      <Text className="text-rose-600 font-bold text-lg">
                        ₹{item.price}
                      </Text>
                      {(() => {
                        const cartItem = cart.find(i => (i.product._id || i.product.id) === item._id);
                        return cartItem ? (
                          <View className="flex-row items-center bg-slate-100 rounded-full border border-slate-200">
                            <TouchableOpacity
                              onPress={() => updateQty(item._id, cartItem.qty - 1)}
                              className="p-1.5 px-2"
                            >
                              <AntDesign name="minus" size={14} color="#0F172A" />
                            </TouchableOpacity>
                            <Text className="text-xs font-bold text-slate-900 px-1 w-4 text-center">{cartItem.qty}</Text>
                            <TouchableOpacity
                              onPress={() => updateQty(item._id, cartItem.qty + 1)}
                              className="p-1.5 px-2"
                            >
                              <AntDesign name="plus" size={14} color="#0F172A" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => item.stock && handleAdd(item)}
                            className="p-1.5 rounded-full border shadow-sm"
                            style={{
                              borderColor: item.stock ? "#E11D48" : "#E2E8F0",
                              backgroundColor: item.stock ? "#E11D48" : "#F8FAFC",
                            }}
                          >
                            <FontAwesome name="cart-plus" size={14} color={item.stock ? "white" : "#94A3B8"} />
                          </TouchableOpacity>
                        );
                      })()}
                    </View>
                  </View>
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
