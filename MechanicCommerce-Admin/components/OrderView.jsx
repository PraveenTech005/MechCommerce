import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Toast from "react-native-toast-message";

const paymentStyles = {
  Pending: { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
  Paid: { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
  "Not Paid": { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
};

const orderStyles = {
  Pending: { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
  Confirmed: { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
  Shipped: { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
  "Out for Delivery": { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
  Delivered: { active: "bg-slate-900 border-slate-500", text: "text-white", inactive: "bg-slate-100 border-slate-500/30", inactiveText: "text-slate-500/70" },
};

const OrderView = ({ order, close }) => {
  const { user, fetchOrders } = useContext(AppContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localOrder, setLocalOrder] = useState(order);

  const updateStatus = async (field, value) => {
    try {
      setIsUpdating(true);
      const res = await axios.put(
        `${process.env.EXPO_PUBLIC_API_SERVER}/order/${localOrder._id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLocalOrder(res.data);
      fetchOrders(); // refresh global orders list
      Toast.show({ type: "success", text1: "Order updated successfully" });
    } catch (error) {
      console.log("Error updating order:", error);
      Toast.show({ type: "error", text1: "Failed to update order" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="pt-6 pb-4 px-6 bg-white border-b border-slate-100 flex-row justify-between items-center z-10 shadow-sm">
        <View>
          <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
            Order Details
          </Text>
          <Text className="text-slate-900 text-2xl font-black">
            #{localOrder._id?.slice(-6).toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => close(null)}
          className="bg-slate-100 p-2.5 rounded-full"
        >
          <Feather name="x" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5 gap-6 mb-10">

          {/* Customer Card */}
          <View className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
            <View className="flex-row items-center gap-3 mb-5">
              <View className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center">
                <Feather name="user" size={18} color="#2563EB" />
              </View>
              <Text className="text-xl font-bold text-slate-900">Customer Info</Text>
            </View>

            <View className="gap-4">
              <View className="flex-row items-start gap-3">
                <Feather name="info" size={16} color="#94A3B8" className="mt-0.5" />
                <View className="flex-1">
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Name</Text>
                  <Text className="text-slate-900 font-semibold text-base">{localOrder.user?.name || 'Unknown'}</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <Feather name="phone" size={16} color="#94A3B8" className="mt-0.5" />
                <View className="flex-1">
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Phone</Text>
                  <Text className="text-slate-900 font-semibold text-base">{localOrder.user?.phone || 'Unknown'}</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <Feather name="map-pin" size={16} color="#94A3B8" className="mt-0.5" />
                <View className="flex-1">
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Delivery Address</Text>
                  <Text className="text-slate-700 font-medium leading-5">{localOrder.user?.address || 'Unknown'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Items */}
          <View>
            <Text className="text-slate-900 text-lg font-bold mb-3 ml-2">Order Items</Text>
            <View className="gap-3">
              {localOrder.orderItems.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-white p-3 rounded-[24px] border border-slate-100 shadow-sm"
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-[72px] h-[72px] rounded-[16px] bg-slate-100"
                  />
                  <View className="flex-1 ml-4 justify-center py-1">
                    <Text className="font-bold text-slate-900 text-base mb-1" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View className="flex-row items-center gap-2 mb-2">
                      <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                        <Text className="text-slate-500 text-xs font-bold">Qty: {item.quantity}</Text>
                      </View>
                    </View>
                    <Text className="font-black text-rose-600 text-lg">
                      ₹{item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Payment Card */}
          <View className="bg-slate-200 rounded-[28px] p-6 shadow-xl mt-2">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-3">
                <View className="bg-white/20 w-10 h-10 rounded-full items-center justify-center">
                  <MaterialCommunityIcons name="wallet-outline" size={20} color="black" />
                </View>
                <Text className="text-xl font-bold text-slate-900">Payment</Text>
              </View>
              <Text className="text-3xl font-black text-slate-900 tracking-tight">
                ₹{localOrder.totalAmount}
              </Text>
            </View>

            <View className="bg-white/10 rounded-2xl p-4 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-900 font-medium">Method</Text>
                <Text className="font-bold text-slate-900 uppercase tracking-wider">{localOrder.paymentMethod}</Text>
              </View>

              <View className="h-[1px] bg-white/10 w-full" />

              <View className="flex-col gap-3">
                <Text className="text-slate-900 font-medium">Payment Status</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {Object.keys(paymentStyles).map((status) => {
                    const isActive = localOrder.paymentStatus === status;
                    const style = paymentStyles[status];
                    return (
                      <TouchableOpacity
                        key={status}
                        disabled={isUpdating || isActive}
                        onPress={() => updateStatus("paymentStatus", status)}
                        className={`px-3 py-1.5 mb-1 rounded-lg border ${isActive ? style.active : style.inactive}`}
                      >
                        <Text className={`text-xs font-bold uppercase ${isActive ? style.text : style.inactiveText}`}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View className="h-[1px] bg-white/10 w-full" />

              <View className="flex-col gap-3">
                <Text className="text-slate-900 font-medium">Order Status</Text>
                <View className="flex-row gap-2 flex-wrap">
                  {Object.keys(orderStyles).map((status) => {
                    const isActive = localOrder.orderStatus === status;
                    const style = orderStyles[status];
                    return (
                      <TouchableOpacity
                        key={status}
                        disabled={isUpdating || isActive}
                        onPress={() => updateStatus("orderStatus", status)}
                        className={`px-3 py-1.5 mb-1 rounded-lg border ${isActive ? style.active : style.inactive}`}
                      >
                        <Text className={`text-xs font-bold uppercase ${isActive ? style.text : style.inactiveText}`}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default OrderView;

