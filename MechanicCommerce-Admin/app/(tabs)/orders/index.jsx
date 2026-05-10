import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import OrderView from "../../../components/OrderView";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";

const Orders = () => {
  const { orders, user, fetchOrders } = useContext(AppContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const totalOrders = orders.length;

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete Orders",
      `Are you sure you want to delete ${selectedIds.length} order(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const deletePromises = selectedIds.map((id) =>
                axios.delete(
                  `${process.env.EXPO_PUBLIC_API_SERVER}/order/${id}`,
                  {
                    headers: { Authorization: `Bearer ${user.token}` },
                  }
                )
              );
              await Promise.all(deletePromises);
              
              fetchOrders();
              setSelectedIds([]);
              setIsSelectionMode(false);
            } catch (error) {
              console.log("Error deleting orders:", error);
              Alert.alert("Error", "Failed to delete selected orders.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-slate-50 px-5 pt-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center py-4">
          <View>
            <Text className="text-slate-500 text-sm font-medium tracking-wider uppercase mb-1">
              Management
            </Text>
            <Text className="text-3xl font-bold text-slate-900 tracking-tight">
              All Orders
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedIds([]);
              }}
              className={`px-4 py-2.5 rounded-xl flex-row items-center gap-2 ${isSelectionMode ? "bg-slate-900" : "bg-white border border-slate-200"}`}
            >
              <Feather
                name={isSelectionMode ? "x" : "check-square"}
                size={18}
                color={isSelectionMode ? "white" : "#0F172A"}
              />
              <Text className={`font-bold ${isSelectionMode ? "text-white" : "text-slate-900"}`}>
                {isSelectionMode ? "Cancel" : "Select"}
              </Text>
            </TouchableOpacity>

            {isSelectionMode && selectedIds.length > 0 && (
              <TouchableOpacity
                onPress={handleDeleteSelected}
                disabled={isDeleting}
                className="bg-rose-600 px-4 py-2.5 rounded-xl flex-row items-center gap-2"
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Feather name="trash-2" size={18} color="white" />
                )}
                <Text className="text-white font-bold">
                  {isDeleting ? "..." : "Delete"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text className="text-slate-500 font-medium mb-4">
          {totalOrders} Total Orders
        </Text>

        <View className="flex flex-col gap-3 pb-28">
          {orders.map((item, i) => {
            const isSelected = selectedIds.includes(item._id);

            return (
            <TouchableOpacity
              key={i}
              className={`w-full bg-white p-4 rounded-3xl flex flex-row justify-between items-center shadow-sm ${isSelected ? "border-rose-500 border-2" : "border border-slate-200"}`}
              onPress={() => {
                if (isSelectionMode) {
                  if (isSelected) {
                    setSelectedIds(selectedIds.filter((id) => id !== item._id));
                  } else {
                    setSelectedIds([...selectedIds, item._id]);
                  }
                  return;
                }
                setSelectedOrder({ ...item, i });
              }}
              onLongPress={() => {
                if (!isSelectionMode) {
                  setIsSelectionMode(true);
                  setSelectedIds([item._id]);
                }
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row gap-4 items-center flex-1">
                <View className="relative bg-slate-50 p-4 rounded-full border border-slate-100">
                  <Feather name="package" size={20} color="#64748B" />
                  {isSelectionMode && (
                    <View className="absolute -top-1 -right-1">
                      <Feather
                        name={isSelected ? "check-circle" : "circle"}
                        size={18}
                        color={isSelected ? "#E11D48" : "#94A3B8"}
                        style={{ backgroundColor: 'white', borderRadius: 9, overflow: 'hidden' }}
                      />
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base font-bold text-slate-900 mb-0.5"
                    numberOfLines={1}
                  >
                    Order #{item._id.slice(-6).toUpperCase()} • {item.user.name}
                  </Text>
                  <Text className="text-slate-500 text-xs font-medium">
                    {item.orderItems?.length || 0} items • {item.paymentMethod}
                  </Text>
                </View>
              </View>

              <View className="items-end gap-1.5 min-w-[80px]">
                <Text className="text-[15px] font-bold text-rose-600">
                  ₹{item.totalAmount}
                </Text>
                <View
                  className={`px-2.5 py-1 rounded-md ${
                    item.orderStatus === "Pending" ||
                    item.orderStatus === "Placed"
                      ? "bg-orange-500/10"
                      : item.orderStatus === "Delivered"
                        ? "bg-green-500/10"
                        : "bg-blue-500/10"
                  }`}
                >
                  <Text
                    className={`text-[10px] uppercase tracking-wider font-bold ${
                      item.orderStatus === "Pending" ||
                      item.orderStatus === "Placed"
                        ? "text-orange-600"
                        : item.orderStatus === "Delivered"
                          ? "text-green-600"
                          : "text-blue-600"
                    }`}
                  >
                    {item.orderStatus}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Order detail modal */}
      {selectedOrder && (
        <View className="absolute w-full h-full justify-center items-center">
          <TouchableOpacity
            className="bg-black/40 absolute w-full h-full backdrop-blur-sm"
            activeOpacity={1}
            onPress={() => setSelectedOrder(null)}
          />
          <View className="bg-white w-[92%] h-[80%] rounded-3xl overflow-hidden z-10 border border-slate-200 shadow-2xl p-5">
            <OrderView order={selectedOrder} close={setSelectedOrder} />
          </View>
        </View>
      )}
    </>
  );
};

export default Orders;
