import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { vehicleCatalog, CATEGORY_PLACEHOLDERS } from "../seed";
import { AppContext } from "../context/AppContext";

const DEFAULT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500",
];
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCart } from "../context/CartContext";
import OrderView from "./OrderView";

const CATEGORIES = [
  { key: "Bike", label: "Bike Parts", icon: "motorbike" },
  { key: "Car", label: "Car Parts", icon: "car" },
  { key: "Engine", label: "Engine", icon: "engine" },
  { key: "Accessories", label: "Accessories", icon: "shopping" },
];

const Home = () => {
  // const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [brandModal, setBrandModal] = useState(false);
  const [modelModal, setModelModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState({ brand: '', model: '' });
  const { cartCount } = useCart();
  const { user, products, orders, refreshData } = useContext(AppContext);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const brands = vehicleCatalog.map(v => v.brand);
  const models = selectedVehicle.brand ? vehicleCatalog.find(v => v.brand === selectedVehicle.brand)?.model || [] : [];

  const featured = products?.filter((item) => item.isFeatured)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.token) return router.replace("/onboarding");
        refreshData();
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const isCompatible = (product) => {
    if (!selectedVehicle.brand || !selectedVehicle.model) return false;
    return product.vehicle.some(
      (v) => v.brand === selectedVehicle.brand && v.model.includes(selectedVehicle.model)
    );
  };

  const handleFindParts = () => {
    router.push({
      pathname: "/products",
      params: {
        brand: selectedVehicle.brand,
        model: selectedVehicle.model,
        category: "",
      },
    });
  };

  return (
    <>
      <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
        {/* ── Header ── */}
        <View className="flex flex-row items-center justify-between px-5 pt-3 pb-2">
          <View>
            <Text style={{ color: "#6B7280" }} className="text-sm">Welcome back,</Text>
            <Text className="text-xl font-bold text-gray-900">{user?.name ?? "Rider"} 👋</Text>
          </View>
          <View className="flex flex-row items-center gap-x-4">
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              className="relative"
            >
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
            <TouchableOpacity onPress={() => router.push("/menu")}>
              <Ionicons name="menu-outline" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search Bar ── */}
        <View className="flex flex-row items-center gap-x-2 px-5 py-2">
          <View
            className="flex-1 flex-row items-center rounded-xl px-3 border-2 border-slate-300"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Feather name="search" size={18} color="#6B7280" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search parts, brands…"
              placeholderTextColor="#9CA3AF"
              className="ml-2 flex-1 py-3 text-gray-900"
              returnKeyType="search"
              onSubmitEditing={() => {
                if (search.trim()) {
                  router.push({ pathname: "/searchPage", params: { name: search, type: "search" } });
                  setSearch("");
                }
              }}
            />
          </View>
          <TouchableOpacity
            style={{ backgroundColor: "#EF4444" }}
            className="rounded-xl p-3"
            onPress={() => {
              if (search.trim()) {
                router.push({ pathname: "/searchPage", params: { name: search, type: "search" } });
                setSearch("");
              }
            }}
          >
            <Feather name="search" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* ── Vehicle Selector Hero ── */}
          <View
            className="mx-4 mt-3 rounded-2xl p-5"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <View className="flex flex-row justify-between items-center">
              <View>
                <Text className="mb-1 text-lg font-bold text-gray-900">Find Parts for Your Vehicle</Text>
                <Text style={{ color: "#6B7280" }} className="mb-4 text-sm">
                  Select your vehicle to see compatible parts
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedVehicle({ brand: '', model: '' })} className="rounded-xl px-4 py-3"><Text className="text-red-500 font-semibold">Clear</Text></TouchableOpacity>
            </View>


            {/* Brand Picker */}
            <TouchableOpacity
              onPress={() => setBrandModal(true)}
              className="mb-3 flex-row items-center justify-between rounded-xl px-4 py-3 border-2 border-slate-300"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <View className="flex-row items-center gap-x-2">
                <MaterialCommunityIcons name="car-side" size={18} color="#EF4444" />
                <Text className={selectedVehicle.brand ? "text-gray-900 font-semibold" : "text-gray-500"}>
                  {selectedVehicle.brand || "Select Brand"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>

            {/* Model Picker */}
            <TouchableOpacity
              onPress={() => selectedVehicle.brand && setModelModal(true)}
              className="mb-4 flex-row items-center justify-between rounded-xl px-4 py-3 border-2 border-slate-300"
              style={{ backgroundColor: "#F3F4F6", opacity: selectedVehicle.brand ? 1 : 0.5 }}
            >
              <View className="flex-row items-center gap-x-2">
                <MaterialCommunityIcons name="motorbike" size={18} color="#3B82F6" />
                <Text className={selectedVehicle.model ? "text-gray-900 font-semibold" : "text-gray-500"}>
                  {selectedVehicle.model || "Select Model"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFindParts}
              className="items-center rounded-xl py-3"
              style={{ backgroundColor: "#EF4444" }}
            >
              <Text className="text-base font-bold text-white">
                {selectedVehicle.brand && selectedVehicle.model
                  ? `Find Parts for ${selectedVehicle.brand} ${selectedVehicle.model}`
                  : "Browse All Parts"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Categories ── */}
          <Text className="mx-4 mt-5 mb-3 text-lg font-bold text-gray-900">Categories</Text>
          <View className="flex-row flex-wrap px-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  router.push({
                    pathname: "/products",
                    params: { brand: "", model: "", category: cat.key },
                  })
                }
                className="w-[47%] flex-row items-center gap-x-3 rounded-xl px-4 py-4 border-2 border-slate-300"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <MaterialCommunityIcons name={cat.icon} size={22} color="#EF4444" />
                <Text className="font-semibold text-gray-900">{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Featured Products ── */}
          <Text className="mx-4 mt-5 mb-3 text-lg font-bold text-gray-900 pt-6">Featured Products</Text>
          <View className="w-full flex-row flex-wrap justify-between gap-y-4 px-4 mb-4">
            {featured.map((item, i) => {
              const compatible = isCompatible(item);
              return (
                <TouchableOpacity
                  key={item._id || i}
                  onPress={() => router.push({ pathname: "/productDetail", params: { id: item._id, brand: selectedVehicle.brand, model: selectedVehicle.model } })}
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
                    {compatible && (
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
                      <View
                        className="bg-slate-50 p-1.5 rounded-full border border-slate-200"
                      >
                        <Ionicons name="chevron-forward" size={14} color="#64748B" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={() => router.push("/products")}
            className="mx-4 mb-4 items-center rounded-xl border py-3 border-red-500"
          >
            <Text style={{ color: "#6B7280" }} className="font-semibold">View All Products →</Text>
          </TouchableOpacity>

          {/* ── Recent Orders ── */}
          {orders && orders.length > 0 && (
            <View className="pb-28">
              <View className="flex-row justify-between items-center px-5">
                <Text className="mx-4 mt-5 mb-3 text-lg font-bold text-gray-900 pt-6">Recent Orders</Text>
                <TouchableOpacity className="flex justify-center items-center mt-5 px-3 py-2" onPress={refreshData}><AntDesign name="reload" size={20} color="#EF4444" /></TouchableOpacity></View>
              <View className="flex flex-col gap-3 px-5">
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
            </View>
          )}
        </ScrollView>

        {/* ── Brand Modal ── */}
        <Modal visible={brandModal} transparent animationType="slide">
          <TouchableOpacity
            className="flex-1"
            style={{ backgroundColor: "#00000080" }}
            activeOpacity={1}
            onPress={() => setBrandModal(false)}
          >
            <View
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <Text className="mb-4 text-center text-lg font-bold text-gray-900">Select Brand</Text>
              <FlatList
                data={brands}
                keyExtractor={(b) => b}
                renderItem={({ item: brand }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedVehicle({ brand, model: "" });
                      setBrandModal(false);
                    }}
                    className="flex-row items-center justify-between rounded-xl px-4 py-4 mb-2"
                    style={{
                      backgroundColor: selectedVehicle.brand === brand ? "#F3F4F6" : "#F9FAFB",
                    }}
                  >
                    <Text className="text-gray-900 font-semibold text-base">{brand}</Text>
                    {selectedVehicle.brand === brand && (
                      <Ionicons name="checkmark-circle" size={20} color="#EF4444" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ── Model Modal ── */}
        <Modal visible={modelModal} transparent animationType="slide">
          <TouchableOpacity
            className="flex-1"
            style={{ backgroundColor: "#00000080" }}
            activeOpacity={1}
            onPress={() => setModelModal(false)}
          >
            <View
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <Text className="mb-4 text-center text-lg font-bold text-gray-900">
                Select {selectedVehicle.brand} Model
              </Text>
              <FlatList
                data={models}
                keyExtractor={(m) => m}
                renderItem={({ item: model }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedVehicle((v) => ({ ...v, model }));
                      setModelModal(false);
                    }}
                    className="flex-row items-center justify-between rounded-xl px-4 py-4 mb-2"
                    style={{
                      backgroundColor: selectedVehicle.model === model ? "#F3F4F6" : "#F9FAFB",
                    }}
                  >
                    <Text className="text-gray-900 font-semibold text-base">{model}</Text>
                    {selectedVehicle.model === model && (
                      <Ionicons name="checkmark-circle" size={20} color="#EF4444" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>

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

export default Home;
