import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCart } from "../context/CartContext";
import Toast from "react-native-toast-message";

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();

  const handlePlaceOrder = () => {
    clearCart();
    Toast.show({
      type: "success",
      text1: "Order Placed! 🎉",
      text2: "Your order has been successfully placed.",
    });
    router.replace("/home");
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-circle-outline" size={36} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">My Cart</Text>
        {cart.length > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Text style={{ color: "#EF4444" }} className="text-sm font-semibold">Clear All</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cart-outline" size={80} color="#F3F4F6" />
          <Text className="mt-4 text-xl font-bold text-gray-900">Cart is Empty</Text>
          <Text style={{ color: "#6B7280" }} className="mt-2 text-center text-sm">
            You haven't added any parts yet. Browse products and add them here.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/products")}
            className="mt-6 rounded-2xl px-8 py-3"
            style={{ backgroundColor: "#EF4444" }}
          >
            <Text className="font-bold text-white">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            <View className="gap-y-3 py-2">
              {cart.map(({ product, qty }) => (
                <View
                  key={product.id}
                  className="flex-row items-center rounded-2xl overflow-hidden"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <Image
                    source={product.image}
                    className="h-24 w-24"
                    resizeMode="cover"
                  />
                  <View className="flex-1 px-3 py-3">
                    <Text className="text-gray-900 font-semibold" numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={{ color: "#6B7280" }} className="text-xs capitalize mt-0.5">
                      {product.category}
                    </Text>
                    <Text style={{ color: "#EF4444" }} className="font-bold mt-1">
                      ₹{(product.price * qty).toLocaleString()}
                    </Text>

                    {/* Qty Controls */}
                    <View className="flex-row items-center gap-x-3 mt-2">
                      <TouchableOpacity
                        onPress={() => updateQty(product.id, qty - 1)}
                        className="rounded-full p-1"
                        style={{ backgroundColor: "#F3F4F6" }}
                      >
                        <AntDesign name="minus" size={14} color="#111827" />
                      </TouchableOpacity>
                      <Text className="text-gray-900 font-bold text-base w-6 text-center">{qty}</Text>
                      <TouchableOpacity
                        onPress={() => updateQty(product.id, qty + 1)}
                        className="rounded-full p-1"
                        style={{ backgroundColor: "#F3F4F6" }}
                      >
                        <AntDesign name="plus" size={14} color="#111827" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFromCart(product.id)}
                    className="mr-3 rounded-full p-2"
                    style={{ backgroundColor: "#7F1D1D" }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FCA5A5" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* ── Order Summary ── */}
            <View
              className="mt-3 mb-6 rounded-2xl p-4"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <Text className="text-base font-bold text-gray-900 mb-3">Order Summary</Text>
              <View className="flex-row justify-between mb-2">
                <Text style={{ color: "#6B7280" }}>
                  Items ({cart.reduce((s, i) => s + i.qty, 0)})
                </Text>
                <Text className="text-gray-900">₹{cartTotal.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text style={{ color: "#6B7280" }}>Delivery</Text>
                <Text style={{ color: "#34D399" }} className="font-semibold">FREE</Text>
              </View>
              <View
                className="my-2 h-px"
                style={{ backgroundColor: "#F3F4F6" }}
              />
              <View className="flex-row justify-between">
                <Text className="text-gray-900 font-bold text-base">Total</Text>
                <Text style={{ color: "#EF4444" }} className="font-bold text-base">
                  ₹{cartTotal.toLocaleString()}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* ── Place Order ── */}
          <View className="px-4 pb-5 pt-3" style={{ backgroundColor: "#F9FAFB" }}>
            <TouchableOpacity
              onPress={handlePlaceOrder}
              className="items-center rounded-2xl py-4"
              style={{ backgroundColor: "#EF4444" }}
            >
              <Text className="text-base font-bold text-white">
                Place Order · ₹{cartTotal.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Cart;
