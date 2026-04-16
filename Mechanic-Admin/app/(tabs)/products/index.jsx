import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";

const index = () => {
  const { products } = useContext(AppContext);
  const totalProducts = products.length;
  const [search, setSearch] = useState("");

  const [allproducts, setAllProducts] = useState(products.reverse());

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  return (
    <ScrollView className="flex-1 bg-slate-50 px-5 pt-12 pb-12">
      <View className="flex-row justify-between items-center py-4">
        <View>
          <Text className="text-slate-500 text-sm font-medium tracking-wider uppercase mb-1">
            Inventory
          </Text>
          <Text className="text-3xl font-bold text-slate-900 tracking-tight">
            Products
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/products/AddProduct")}
          className="bg-rose-600 px-4 py-2.5 rounded-xl flex-row items-center gap-2"
        >
          <Feather name="plus" size={18} color="white" />
          <Text className="text-white font-bold">Add</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-6 mt-2 shadow-sm">
        <Feather name="search" size={20} color="#94A3B8" />
        <TextInput
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            const lowerText = text.toLowerCase();
            setAllProducts(
              products.filter(
                (item) =>
                  item.name.toLowerCase().includes(lowerText) ||
                  item.category.toLowerCase().includes(lowerText) ||
                  (item.vehicle &&
                    item.vehicle.toLowerCase().includes(lowerText)),
              ),
            );
          }}
          placeholder="Search spare parts..."
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-3 text-slate-900 text-base font-medium"
        />
      </View>

      <Text className="text-slate-500 font-medium mb-4">
        {totalProducts} Items Available
      </Text>

      <View className="w-full flex-row flex-wrap justify-between gap-y-4 pb-28">
        {allproducts.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            className="w-[48%] rounded-3xl bg-white border border-slate-200 p-2 overflow-hidden shadow-sm"
            onPress={() =>
              router.push({
                pathname: "/products/Product",
                params: { index: i },
              })
            }
          >
            <View className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
              <Image
                source={{ uri: item.images[i % item.images.length] }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {item.stock < 5 && (
                <View className="absolute top-2 left-2 bg-rose-500/90 px-2 py-1 rounded-md backdrop-blur-sm">
                  <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                    Low Stock
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
                <TouchableOpacity
                  className="bg-slate-50 p-1.5 rounded-full border border-slate-200"
                  onPress={() => {
                    const originalIndex = products.findIndex(
                      (p) => p._id === item._id,
                    );
                    router.push({
                      pathname: "/products/Product",
                      params: { index: originalIndex },
                    });
                  }}
                >
                  <Feather name="edit-2" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default index;
