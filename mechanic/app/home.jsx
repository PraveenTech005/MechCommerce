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
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import products, { vehicleCatalog } from "../seed";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  { key: "bike", label: "Bike Parts", icon: "motorbike" },
  { key: "car", label: "Car Parts", icon: "car" },
  { key: "engine", label: "Engine", icon: "engine" },
  { key: "accessories", label: "Accessories", icon: "shopping" },
];

const WHY_US = [
  { logo: "✅", head: "Genuine Parts", desc: "100% original spare parts" },
  { logo: "🛒", head: "Easy Shopping", desc: "Smooth & Simple UI" },
  { logo: "🔐", head: "Secure Login", desc: "Safe Authentication" },
  { logo: "⚡", head: "Fast Delivery", desc: "Quick order processing" },
];

const Home = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [brandModal, setBrandModal] = useState(false);
  const [modelModal, setModelModal] = useState(false);
  const { cartCount, selectedVehicle, setSelectedVehicle } = useCart();

  const brands = Object.keys(vehicleCatalog);
  const models = selectedVehicle.brand ? vehicleCatalog[selectedVehicle.brand] : [];

  const featured = products.slice(0, 4);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const User = storedUser ? JSON.parse(storedUser) : null;
        if (!User?.token) router.replace("/onboarding");
        setUser(User);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const isCompatible = (product) => {
    if (!selectedVehicle.brand || !selectedVehicle.model) return false;
    return product.vehicle.some(
      (v) => v.name === selectedVehicle.brand && v.model === selectedVehicle.model,
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
            <Ionicons name="menu-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search Bar ── */}
      <View className="flex flex-row items-center gap-x-2 px-5 py-2">
        <View
          className="flex-1 flex-row items-center rounded-xl px-3"
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
          <Text className="mb-1 text-lg font-bold text-gray-900">Find Parts for Your Vehicle</Text>
          <Text style={{ color: "#6B7280" }} className="mb-4 text-sm">
            Select your vehicle to see compatible parts
          </Text>

          {/* Brand Picker */}
          <TouchableOpacity
            onPress={() => setBrandModal(true)}
            className="mb-3 flex-row items-center justify-between rounded-xl px-4 py-3"
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
            className="mb-4 flex-row items-center justify-between rounded-xl px-4 py-3"
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
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              onPress={() =>
                router.push({
                  pathname: "/products",
                  params: { brand: "", model: "", category: cat.key },
                })
              }
              className="w-[47%] flex-row items-center gap-x-3 rounded-xl px-4 py-4"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <MaterialCommunityIcons name={cat.icon} size={22} color="#EF4444" />
              <Text className="font-semibold text-gray-900">{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Featured Products ── */}
        <Text className="mx-4 mt-5 mb-3 text-lg font-bold text-gray-900">Featured Products</Text>
        <View className="px-4 gap-y-3 mb-4">
          {featured.map((item) => {
            const compatible = isCompatible(item);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push({ pathname: "/productDetail", params: { id: item.id } })}
                className="flex-row items-center rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <Image
                  source={item.image}
                  className="h-24 w-24"
                  resizeMode="cover"
                />
                <View className="flex-1 px-3 py-3">
                  {compatible && (
                    <View
                      className="self-start rounded-full px-2 py-0.5 mb-1"
                      style={{ backgroundColor: "#064E3B" }}
                    >
                      <Text style={{ color: "#34D399" }} className="text-xs font-semibold">
                        ✓ Compatible
                      </Text>
                    </View>
                  )}
                  <Text className="text-gray-900 font-semibold" numberOfLines={1}>{item.name}</Text>
                  <Text style={{ color: "#6B7280" }} className="text-xs capitalize mb-1">{item.category}</Text>
                  <Text style={{ color: "#EF4444" }} className="font-bold">₹{item.price.toLocaleString()}</Text>
                </View>
                <View className="px-3">
                  <View
                    className="rounded-full p-2"
                    style={{ backgroundColor: item.stock ? "#EF444420" : "#F3F4F620" }}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={item.stock ? "#EF4444" : "#6B7280"}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/products")}
          className="mx-4 mb-4 items-center rounded-xl border py-3"
          style={{ borderColor: "#F3F4F6" }}
        >
          <Text style={{ color: "#6B7280" }} className="font-semibold">View All Products →</Text>
        </TouchableOpacity>

        {/* ── Why Choose Us ── */}
        <Text className="mx-4 mt-2 mb-3 text-lg font-bold text-gray-900">Why MechPro?</Text>
        <View className="mx-4 mb-8 gap-y-3">
          {WHY_US.map((item, i) => (
            <View
              key={i}
              className="flex-row items-center gap-x-4 rounded-xl px-4 py-3"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <Text className="text-2xl">{item.logo}</Text>
              <View>
                <Text className="font-bold text-gray-900">{item.head}</Text>
                <Text style={{ color: "#6B7280" }} className="text-sm">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
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
  );
};

export default Home;
