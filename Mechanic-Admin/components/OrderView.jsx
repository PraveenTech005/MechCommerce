import { AntDesign } from "@expo/vector-icons";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

const OrderView = ({ order, close }) => {
  return (
    <ScrollView className="flex-1">
      {/* Header */}
      <View className="py-5 rounded-b-3xl bg-gray-200 flex flex-row justify-evenly items-center">
        <Text className="text-black text-2xl font-bold text-center flex-1">
          Order Summary - #{order._id?.slice(-5)}
        </Text>
        <TouchableOpacity onPress={() => close(null)}>
          <AntDesign name="close-circle" size={30} color="red" />
        </TouchableOpacity>
      </View>
      <View className="p-4 -mt-6">
        {/* Customer Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg border">
          <Text className="text-lg font-bold mb-3">👤 Customer</Text>
          <View className="flex flex-row items-center">
            <Text className=" w-[20%]">Name: </Text>
            <Text className="text-gray-800 font-medium w-[60%] text-start ">
              {order.userName}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Text className=" w-[20%]">Phone: </Text>
            <Text className="text-gray-500 w-[60%] text-start ">
              {order.phone}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Text className=" w-[20%]">Address: </Text>
            <Text className="text-gray-500 mt-1 w-[60%] text-start ">
              {order.address}
            </Text>
          </View>
        </View>
        {/* Items */}
        <View className="bg-white rounded-3xl shadow-lg gap-2 mb-4">
          <Text className="text-lg font-bold mb-4">🛒 Items</Text>
          {order.orderItems.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center gap-3 border p-3 rounded-xl"
            >
              <Image
                source={{ uri: item.image }}
                className="w-20 h-20 rounded-2xl"
                style={{ width: 80, height: 80 }}
              />
              <View className="flex-1 ml-4">
                <Text className="font-semibold text-base">{item.name}</Text>
                <Text className="text-gray-500 text-sm">{item.product}</Text>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-600">Qty: {item.quantity}</Text>
                  <Text className="font-bold text-black">₹{item.price}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* Payment Card */}
        <View className="bg-white rounded-3xl shadow-lg border-t-4">
          <Text className="text-lg font-bold mb-4">💳 Payment</Text>
          {/* Amount */}
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500">Total</Text>
            <Text className="text-xl font-bold text-black">
              ₹{order.totalAmount}
            </Text>
          </View>
          {/* Method */}
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500">Method</Text>
            <Text className="font-medium">{order.paymentMethod}</Text>
          </View>
          {/* Paid Status */}
          <View className="flex-row justify-between mb-3 items-center">
            <Text className="text-gray-500">Payment</Text>
            <View
              className={`px-3 py-1 rounded-full ${
                order.isPaid ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  order.isPaid ? "text-green-600" : "text-red-500"
                }`}
              >
                {order.isPaid ? "Paid" : "Pending"}
              </Text>
            </View>
          </View>
          {/* Order Status */}
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500">Status</Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-600 font-semibold text-sm">
                {order.orderStatus}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderView;
