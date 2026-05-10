import { ScrollView, Text, TouchableOpacity, View, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useContext } from "react";
import { useCart } from "../context/CartContext";
import { AppContext } from "../context/AppContext";
import Toast from "react-native-toast-message";
import axios from "axios";

const PAYMENT_METHODS = [
  { id: "upi", title: "UPI", icon: "mobile-alt" },
  { id: "card", title: "Credit / Debit Card", icon: "credit-card" },
  { id: "netbanking", title: "NetBanking", icon: "university" },
  { id: "cod", title: "Pay on Delivery", icon: "money-bill-wave" },
];

const Payment = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, refreshData } = useContext(AppContext);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const handlePay = async () => {
    if (!user || !user.token) {
      return Toast.show({
        type: "error",
        text1: "Authentication Error",
        text2: "Please log in to place an order.",
      });
    }

    setIsProcessing(true);
    
    try {
      const orderItems = cart.map(item => ({
        id: item.product._id || item.product.id,
        name: item.product.name,
        quantity: item.qty,
        price: item.product.price,
        image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : "",
      }));

      const orderData = {
        orderItems,
        totalAmount: cartTotal,
        paymentMethod: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.title || selectedMethod,
      };

      await axios.post(
        `${process.env.EXPO_PUBLIC_API_SERVER}/order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setIsProcessing(false);
      setShowSuccess(true);
      clearCart();
      refreshData();
      
      // Auto redirect after showing success modal
      setTimeout(() => {
        setShowSuccess(false);
        Toast.show({
          type: "success",
          text1: "Order Placed! 🎉",
          text2: "Your order has been successfully placed.",
        });
        router.replace("/home");
      }, 2500);

    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);
      setIsProcessing(false);
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: error.response?.data?.message || "Could not place the order. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white shadow-sm z-10" style={{ elevation: 2 }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Payment</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View className="bg-white p-5 rounded-3xl shadow-sm mb-6 border border-gray-100">
          <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Order Summary</Text>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Items ({itemCount})</Text>
            <Text className="text-gray-900 font-medium">₹{cartTotal.toLocaleString()}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-600">Delivery Fee</Text>
            <Text className="text-emerald-600 font-bold">FREE</Text>
          </View>
          
          <View className="h-[1px] bg-gray-100 mb-4" />
          
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">Total Amount</Text>
            <Text className="text-xl font-bold text-rose-600">₹{cartTotal.toLocaleString()}</Text>
          </View>
        </View>

        <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Payment Options</Text>
        
        {/* Payment Methods */}
        <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {PAYMENT_METHODS.map((method, index) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              className={`flex-row items-center p-5 ${index !== PAYMENT_METHODS.length - 1 ? 'border-b border-gray-100' : ''} ${selectedMethod === method.id ? 'bg-rose-50/50' : 'bg-white'}`}
            >
              <View className="w-10 items-center justify-center">
                <FontAwesome5 
                  name={method.icon} 
                  size={20} 
                  color={selectedMethod === method.id ? "#E11D48" : "#6B7280"} 
                />
              </View>
              <Text className={`flex-1 ml-3 font-bold text-base ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-600'}`}>
                {method.title}
              </Text>
              <View className={`h-6 w-6 rounded-full border-2 items-center justify-center ${selectedMethod === method.id ? 'border-rose-500 bg-white' : 'border-gray-300'}`}>
                {selectedMethod === method.id && <View className="h-3 w-3 rounded-full bg-rose-500" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View className="px-5 py-4 bg-white border-t border-gray-100 shadow-lg">
        <TouchableOpacity
          onPress={handlePay}
          disabled={isProcessing}
          className="items-center rounded-2xl py-4 flex-row justify-center shadow-sm"
          style={{ backgroundColor: isProcessing ? "#F43F5E" : "#E11D48" }}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color="white" className="mr-2" />
              <Text className="text-base font-bold text-white ml-2">
                Pay ₹{cartTotal.toLocaleString()} securely
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white w-full rounded-[32px] p-8 items-center shadow-xl">
            <View className="h-20 w-20 rounded-full bg-emerald-100 items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={56} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</Text>
            <Text className="text-gray-500 text-center mb-6 text-base">
              Your order has been placed successfully. You will receive an email confirmation shortly.
            </Text>
            <ActivityIndicator color="#E11D48" />
            <Text className="text-gray-400 text-sm mt-4">Redirecting to Home...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Payment;
