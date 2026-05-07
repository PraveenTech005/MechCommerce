import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";

const CATEGORY_PLACEHOLDERS = {
  Bike: [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500",
    "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=500",
    "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?q=80&w=500",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=500",
  ],
  Car: [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=500",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=500",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=500",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500",
  ],
  Engine: [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=500",
    "https://imgs.search.brave.com/2lodTy0u77NpkG4dNHWaik0GZFrbx4zHOPRHnNxO_zU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjcx/Nzk1NTcyL3Bob3Rv/L3Bvd2VyLWdlbmVy/YXRvci5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9SHZXOEZU/MEllLTBzMGpEYkZH/dFNQY3ZSYVdVUWR3/WlVDcmtWaVhqOExx/dz0",
    "https://imgs.search.brave.com/zSlCRnbiybg7AYfH-cG0dZvLdrRnD66EafFI3aBbT8U/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jYXIt/cGFydHMtaXNvbGF0/ZWQtZW5naW5lLXdo/aXRlLTU5ODI1NTI1/LmpwZw",
    "https://imgs.search.brave.com/XGTQj-RIhjhCAwN8CX7w21V1YzTD5pvfKNPQnD7cEfc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzMv/NzY1LzM3Mi9zbWFs/bC9hdXRvbW90aXZl/LXBhcnRzLWFuZC10/b29scy1vbi13b3Jr/c2hvcC10YWJsZS1t/ZWNoYW5pY2FsLWVu/Z2luZWVyaW5nLXNl/cnZpY2UtYW5kLWNh/ci1yZXBhaXItZXF1/aXBtZW50LWNvbmNl/cHQtb2YtbWFpbnRl/bmFuY2UtYW5kLXRl/Y2hub2xvZ3ktcGhv/dG8uanBn"
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=500",
    "https://imgs.search.brave.com/VCa42_07zuSWafn-OE0MaRJxAAa7Q_ZyKy32QFhZTLs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTA1/MjA1NTYwL3Bob3Rv/L2Jpa2UtYWNjZXNz/b3JpZXMtYmlrZS1o/ZWxtZXQtYmlrZS1n/bG92ZXMtZXllZ2xh/c3Nlcy1ib3R0bGUt/aW4taG9sZGVyLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1s/d0pnTGNFVXVCLUx5/ZWZ4NkZBNzBnOVhy/bzBaenprajlhQ0JE/M3VOQlk4PQ",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500",
    "https://loremflickr.com/cache/resized/3279_5777073521_d6c262945f_c_500_500_nofilter.jpg",
  ],
};

const DEFAULT_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500",
];

const index = () => {
  const { products, setProducts, user } = useContext(AppContext);
  const totalProducts = products.length;
  const [search, setSearch] = useState("");

  const [allproducts, setAllProducts] = useState([...products].reverse());

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setAllProducts([...products].reverse());
  }, [products]);

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete Products",
      `Are you sure you want to delete ${selectedIds.length} product(s)?`,
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
                  `${process.env.EXPO_PUBLIC_API_SERVER}/product/${id}`,
                  {
                    headers: { Authorization: `Bearer ${user.token}` },
                  }
                )
              );
              await Promise.all(deletePromises);

              const remainingProducts = products.filter(
                (p) => !selectedIds.includes(p._id)
              );
              setProducts(remainingProducts);
              setSelectedIds([]);
              setIsSelectionMode(false);
            } catch (error) {
              console.log("Error deleting products:", error);
              Alert.alert("Error", "Failed to delete selected products.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

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
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
            className={`px-4 py-2.5 rounded-xl flex-row items-center gap-2 ${isSelectionMode ? "bg-slate-900" : "bg-slate-200"
              }`}
          >
            <Feather
              name={isSelectionMode ? "x" : "check-square"}
              size={18}
              color={isSelectionMode ? "white" : "#0F172A"}
            />
            <Text
              className={`font-bold ${isSelectionMode ? "text-white" : "text-slate-900"
                }`}
            >
              {isSelectionMode ? "Cancel" : "Select"}
            </Text>
          </TouchableOpacity>

          {!isSelectionMode && (
            <TouchableOpacity
              onPress={() => router.push("/products/AddProduct")}
              className="bg-rose-600 px-4 py-2.5 rounded-xl flex-row items-center gap-2"
            >
              <Feather name="plus" size={18} color="white" />
              <Text className="text-white font-bold">Add</Text>
            </TouchableOpacity>
          )}

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

      <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-6 mt-2 shadow-sm">
        <Feather name="search" size={20} color="#94A3B8" />
        <TextInput
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            const lowerText = text.toLowerCase();
            const searchResults = products.filter(
              (item) =>
                item.name.toLowerCase().includes(lowerText) ||
                item.category.toLowerCase().includes(lowerText) ||
                (item.vehicle &&
                  item.vehicle
                    .map((v) => {
                      return typeof v.brand === "object"
                        ? v.brand?.name || v.brand?.brand || ""
                        : v.brand || "";
                    })
                    .join(" ")
                    .toLowerCase()
                    .includes(lowerText))
            );
            setAllProducts(searchResults.reverse());
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
        {allproducts.map((item, i) => {
          const isSelected = selectedIds.includes(item._id);

          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              className={`w-[48%] rounded-3xl bg-white border p-2 overflow-hidden shadow-sm ${isSelected ? "border-rose-500 border-2" : "border-slate-200"
                }`}
              onPress={() => {
                if (isSelectionMode) {
                  if (isSelected) {
                    setSelectedIds(selectedIds.filter((id) => id !== item._id));
                  } else {
                    setSelectedIds([...selectedIds, item._id]);
                  }
                  return;
                }
                const originalIndex = products.findIndex(
                  (p) => p._id === item._id
                );
                router.push({
                  pathname: "/products/Product",
                  params: { index: originalIndex },
                });
              }}
              onLongPress={() => {
                if (!isSelectionMode) {
                  setIsSelectionMode(true);
                  setSelectedIds([item._id]);
                }
              }}
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
                {item.stock < 5 && (
                  <View className="absolute top-2 left-2 bg-rose-500/90 px-2 py-1 rounded-md backdrop-blur-sm">
                    <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                      Low Stock
                    </Text>
                  </View>
                )}
                {isSelectionMode && (
                  <View className="absolute top-2 right-2">
                    <Feather
                      name={isSelected ? "check-circle" : "circle"}
                      size={24}
                      color={isSelected ? "#E11D48" : "#94A3B8"}
                      style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' }}
                    />
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
                        (p) => p._id === item._id
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
          );
        })}
      </View>
    </ScrollView>
  );
};

export default index;
