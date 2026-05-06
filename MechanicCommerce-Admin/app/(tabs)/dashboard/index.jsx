import {
  AntDesign,
  Feather,
  FontAwesome,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import OrderView from "../../../components/OrderView";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../../context/AppContext";

const Dashboard = () => {
  const { user, orders, allUsers, products, refreshData } =
    useContext(AppContext);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const ordersf = orders.filter((item, index) => index < 5);
  const income = orders.reduce((a, b) => {
    return a + b.totalAmount;
  }, 0);

  const DASH_CARDS = [
    {
      title: "Income",
      color: "#3B82F6",
      bg: "bg-blue-500/10",
      value: income,
      icon: <Fontisto name="inr" color="#3B82F6" size={20} />,
    },
    {
      title: "Products",
      color: "#A855F7",
      bg: "bg-purple-500/10",
      value: products.length,
      icon: <AntDesign name="product" size={20} color="#A855F7" />,
    },
    {
      title: "Orders",
      color: "#F97316",
      bg: "bg-orange-500/10",
      value: orders.length,
      icon: <FontAwesome name="opencart" color="#F97316" size={20} />,
    },
    {
      title: "Users",
      color: "#22C55E",
      bg: "bg-green-500/10",
      value: allUsers.length,
      icon: <Feather name="users" color="#22C55E" size={20} />,
    },
  ];

  return (
    <>
      <ScrollView className="flex-1 bg-slate-50 px-5 pt-5">
        <View className="flex-row justify-between items-center py-4">
          <View>
            <Text className="text-2xl px-1 font-bold">Welcome Back</Text>
            <Text className="text-3xl font-bold">{user?.name}</Text>
          </View>
          <View className="flex flex-row justify-center items-center gap-x-5">
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#0F172A"
              className="bg-white p-3 rounded-full border border-slate-200 shadow-sm"
            />
            <TouchableOpacity onPress={() => refreshData()}>
              <FontAwesome
                name="refresh"
                size={22}
                color="#0F172A"
                className="bg-white p-3 rounded-full border border-slate-200 shadow-sm"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-400 p-2 px-5 rounded-lg border border-red-600 "
              onPress={async () => {
                await AsyncStorage.removeItem("User");
                return router.replace("/login");
              }}
            >
              <Text className="text-white font-bold text-xl">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stat cards */}
        <View className="w-full flex flex-row flex-wrap justify-between gap-y-4 pt-4 pb-8">
          {DASH_CARDS.map((item, i) => (
            <View
              key={i}
              className={`w-[48%] flex justify-between rounded-3xl p-5 border border-slate-200 bg-white shadow-sm`}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View
                  className={`p-2 rounded-2xl w-12 h-12 flex justify-center items-center ${item.bg}`}
                >
                  {item.icon}
                </View>
              </View>
              <View>
                <Text className="text-slate-500 font-medium text-sm mb-1">
                  {item.title}
                </Text>
                <Text className="font-bold text-2xl text-slate-900 tracking-tight">
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Orders list */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-slate-900">
            Recent Orders
          </Text>
          <TouchableOpacity onPress={() => router.push("/orders")}>
            <Text className="text-rose-600 font-medium">See All</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col gap-3 pb-28">
          {ordersf.map((item, i) => (
            <TouchableOpacity
              key={i}
              className="w-full bg-white p-4 rounded-3xl flex flex-row justify-between items-center border border-slate-200 shadow-sm"
              onPress={() => setSelectedOrder({ ...item, i: 2400 + i })}
              activeOpacity={0.7}
            >
              <View className="flex-row gap-4 items-center flex-1">
                <View className="bg-slate-50 p-4 rounded-full border border-slate-100">
                  <Feather name="package" size={20} color="#64748B" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900 mb-0.5">
                    Order #{item._id?.slice(-6).toUpperCase()}
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
                    item.orderStatus === "Pending"
                      ? "bg-orange-500/10"
                      : item.orderStatus === "Delivered"
                        ? "bg-green-500/10"
                        : "bg-blue-500/10"
                  }`}
                >
                  <Text
                    className={`text-[10px] uppercase tracking-wider font-bold ${
                      item.orderStatus === "Pending"
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
          ))}
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

export default Dashboard;
