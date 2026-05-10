import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import OrderView from "./OrderView";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext"

const Orders = () => {
    const { orders } = useContext(AppContext)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const totalOrders = orders.length;

    return (
        <>
            <ScrollView className="flex-1 bg-slate-50 px-5 pt-12" showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center py-4">
                    <View>
                        <Text className="text-slate-500 text-sm font-medium tracking-wider uppercase mb-1">Management</Text>
                        <Text className="text-3xl font-bold text-slate-900 tracking-tight">All Orders</Text>
                    </View>
                    <View className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex-row items-center gap-2">
                        <Feather name="filter" size={18} color="#0F172A" />
                    </View>
                </View>

                <Text className="text-slate-500 font-medium mb-4">{totalOrders} Total Orders</Text>

                <View className="flex flex-col gap-3 pb-28">
                    {orders.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            className="w-full bg-white p-4 rounded-3xl flex flex-row justify-between items-center border border-slate-200 shadow-sm"
                            onPress={() => setSelectedOrder({ ...item, i })}
                            activeOpacity={0.7}
                        >
                            <View className="flex-row gap-4 items-center flex-1">
                                <View className="bg-slate-50 p-4 rounded-full border border-slate-100">
                                    <Feather name="package" size={20} color="#64748B" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-slate-900 mb-0.5" numberOfLines={1}>
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
                                <View className={`px-2.5 py-1 rounded-md ${item.orderStatus === 'Pending' || item.orderStatus === 'Placed' ? 'bg-orange-500/10' :
                                    item.orderStatus === 'Delivered' ? 'bg-green-500/10' : 'bg-blue-500/10'
                                    }`}>
                                    <Text className={`text-[10px] uppercase tracking-wider font-bold ${item.orderStatus === 'Pending' || item.orderStatus === 'Placed' ? 'text-orange-600' :
                                        item.orderStatus === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                                        }`}>
                                        {item.orderStatus}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView >

            {/* Order detail modal */}
            {
                selectedOrder && (
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
                )
            }
        </>
    );
};

export default Orders;
