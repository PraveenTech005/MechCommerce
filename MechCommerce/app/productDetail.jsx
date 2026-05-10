import { Image, ScrollView, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Ionicons, FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import products, { CATEGORY_PLACEHOLDERS } from "../seed";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";
import { useState } from "react";

const { width } = Dimensions.get("window");

const DEFAULT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500",
];

const ProductDetail = () => {
  const { id, brand, model } = useLocalSearchParams();
  const { addToCart, cartCount, cart, updateQty, removeFromCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);

  const product = products.find((p) => p._id === id);

  const cartItem = product ? cart.find((i) => (i.product._id || i.product.id) === product._id) : null;
  const qty = cartItem ? cartItem.qty : 0;

  if (!product) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-slate-500 font-medium mb-4">Product not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-slate-200 px-6 py-3 rounded-xl">
          <Text className="font-bold text-slate-900">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompatible =
    brand &&
    model &&
    product.vehicle.some(
      (v) => v.brand === brand && v.model.includes(model)
    );

  const handleAdd = () => {
    if (!product.stock) return;
    addToCart(product);
    Toast.show({ type: "success", text1: "Added to Cart", text2: product.name });
  };

  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : (product.category && CATEGORY_PLACEHOLDERS[product.category]
        ? CATEGORY_PLACEHOLDERS[product.category]
        : DEFAULT_PLACEHOLDERS);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const scrollIndex = Math.round(scrollPosition / width);
    setActiveIndex(scrollIndex);
  };

  return (
    <View className="flex-1 bg-slate-50">
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

            <TouchableOpacity
              onPress={() => router.push("/cart")}
              className="bg-white/90 p-3 rounded-full shadow-sm relative"
              style={{ elevation: 5 }}
            >
              <Ionicons name="cart-outline" size={24} color="#0F172A" />
              {cartCount > 0 && (
                <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-rose-600">
                  <Text className="text-[10px] font-bold text-white">{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Details Section */}
        <View className="bg-slate-50 -mt-6 rounded-t-[32px] px-6 pt-8 pb-40">
          {/* View Mode */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text
                className="text-3xl font-extrabold text-slate-900 mb-1"
                style={{ letterSpacing: -0.5 }}
              >
                {product.name}
              </Text>

              <View className="flex-row items-center gap-2 mb-4">
                <Text className="text-slate-500 font-medium">
                  {product.category}
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
                ₹{product.price.toLocaleString()}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-3 mb-8">
            <View
              className={`px-4 py-2.5 rounded-2xl flex-row items-center gap-2 ${product.stock ? "bg-green-50 border border-green-100" : "bg-rose-50 border border-rose-100"}`}
            >
              <Feather
                name="package"
                size={18}
                color={product.stock ? "#16A34A" : "#E11D48"}
              />
              <Text
                className={`font-bold ${product.stock ? "text-green-700" : "text-rose-600"}`}
              >
                {product.stock ? `${product.stock} Units in Stock` : "Out of Stock"}
              </Text>
            </View>

            {isCompatible && (
              <View className="px-4 py-2.5 rounded-2xl flex-row items-center gap-2 bg-blue-50 border border-blue-100">
                <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                <Text className="font-bold text-blue-700">Fits your {brand}</Text>
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
          {product.vehicle && product.vehicle.length > 0 && (
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
                    const isMyVehicle = brand && model && v.brand === brand && v.model.includes(model);
                    return (
                      <View key={i}>
                        <View className="flex-row items-center gap-2 mb-2 ml-1">
                          <Text className={`font-bold text-base ${isMyVehicle ? "text-blue-600" : "text-slate-800"}`}>
                            {v.brand}
                          </Text>
                          {isMyVehicle && (
                            <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                              <Text className="text-blue-700 text-[10px] font-bold uppercase tracking-wider">Your Vehicle</Text>
                            </View>
                          )}
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                          {v.model.map((m, j) => {
                            const isMyModel = isMyVehicle && m === model;
                            return (
                              <View key={j} className={`px-3 py-1.5 rounded-xl border shadow-sm ${isMyModel ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"}`}>
                                <Text className={`font-medium text-sm ${isMyModel ? "text-blue-700" : "text-slate-600"}`}>
                                  {m}
                                </Text>
                              </View>
                            )
                          })}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* Description */}
          <View>
            <Text className="text-xl font-bold text-slate-900 mb-4">
              About this product
            </Text>
            <Text className="text-slate-600 text-base leading-relaxed">
              {product.description ||
                "No elaborate description provided for this spare part yet. Please reach out to product authorities for more technical parameters."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Add to Cart Button ── */}
      <View className="absolute bottom-0 w-full px-5 py-4 bg-white/80 border-t border-slate-200" style={{ paddingBottom: 30, backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
        {qty > 0 ? (
          <View className="flex-col gap-y-3">
             <View className="flex-row items-center justify-between gap-x-3">
                <TouchableOpacity 
                   onPress={() => removeFromCart(product._id)}
                   className="flex-row items-center bg-rose-50 px-4 py-3 rounded-2xl border border-rose-100 flex-1 justify-center"
                >
                   <Ionicons name="trash-outline" size={20} color="#E11D48" />
                   <Text className="text-rose-600 font-bold ml-2">Remove</Text>
                </TouchableOpacity>

                <View className="flex-row items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                  <TouchableOpacity
                    onPress={() => updateQty(product._id, qty - 1)}
                    className="bg-white p-3 rounded-xl shadow-sm"
                  >
                    <AntDesign name="minus" size={16} color="#0F172A" />
                  </TouchableOpacity>
                  
                  <Text className="text-lg font-bold text-slate-900 w-10 text-center">{qty}</Text>
                  
                  <TouchableOpacity
                    onPress={() => {
                      if (qty < product.stock) {
                        updateQty(product._id, qty + 1);
                      } else {
                        Toast.show({ type: "info", text1: "Maximum stock reached" });
                      }
                    }}
                    className="bg-white p-3 rounded-xl shadow-sm"
                  >
                    <AntDesign name="plus" size={16} color="#0F172A" />
                  </TouchableOpacity>
                </View>
             </View>
             
             <TouchableOpacity
               onPress={() => router.push("/cart")}
               className="bg-rose-600 rounded-2xl py-4 flex-row items-center justify-center shadow-sm"
             >
               <Text className="text-white font-bold text-base mr-2">Proceed to Checkout</Text>
               <Ionicons name="arrow-forward" size={18} color="white" />
             </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleAdd}
            disabled={!product.stock}
            className={`flex-row items-center justify-center gap-x-2 rounded-2xl py-4 shadow-sm ${product.stock ? "bg-rose-600" : "bg-slate-300"}`}
          >
            <FontAwesome name="cart-plus" size={20} color={product.stock ? "white" : "#94A3B8"} />
            <Text className={`text-base font-bold ${product.stock ? "text-white" : "text-slate-500"}`}>
              {product.stock ? "Add to Cart" : "Out of Stock"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ProductDetail;
