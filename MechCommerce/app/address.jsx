import { ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Address = () => {
  const { user } = useContext(AppContext);
  
  const primaryAddress = {
    id: "primary",
    name: user?.name || "John Doe",
    type: "Home",
    phone: user?.phone || "+91 90000 00000",
    address: user?.address || "123, Your Street Name",
    city: "Your City",
    pincode: "000000",
  };

  const [addresses, setAddresses] = useState([primaryAddress]);
  const [selectedId, setSelectedId] = useState("primary");
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const stored = await AsyncStorage.getItem(`saved_addresses_${user?._id || 'guest'}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setAddresses([primaryAddress, ...parsed]);
        } else {
          setAddresses([primaryAddress]);
        }
      } catch (e) {
        console.error("Error loading addresses:", e);
      }
    };
    loadAddresses();
  }, [user?._id]);

  // Form states for new address
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddressStr, setNewAddressStr] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newType, setNewType] = useState("Home");

  const handleProceed = () => {
    router.push({ pathname: "/payment", params: { addressId: selectedId } });
  };

  const handleSaveAddress = async () => {
    if (!newName || !newPhone || !newAddressStr) return;
    const newAddr = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone,
      address: newAddressStr,
      city: newCity || "Your City",
      pincode: newPincode || "000000",
      type: newType,
    };
    const updatedAddresses = [...addresses, newAddr];
    setAddresses(updatedAddresses);
    setSelectedId(newAddr.id);
    setIsAddingNew(false);
    
    try {
      const additional = updatedAddresses.filter(a => a.id !== "primary");
      await AsyncStorage.setItem(`saved_addresses_${user?._id || 'guest'}`, JSON.stringify(additional));
    } catch (e) {
      console.error("Failed to save address", e);
    }
    
    // Reset form
    setNewName("");
    setNewPhone("");
    setNewAddressStr("");
    setNewCity("");
    setNewPincode("");
    setNewType("Home");
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white shadow-sm z-10" style={{ elevation: 2 }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Select Address</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {!isAddingNew ? (
          <>
            <TouchableOpacity 
              onPress={() => setIsAddingNew(true)}
              className="flex-row items-center justify-center py-4 mb-6 bg-rose-50 rounded-2xl border border-rose-200 border-dashed"
            >
              <Ionicons name="add-circle-outline" size={20} color="#E11D48" />
              <Text className="ml-2 font-bold text-rose-600 text-base">Add New Address</Text>
            </TouchableOpacity>

            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Saved Addresses</Text>
            
            <View className="gap-y-4 pb-20">
              {addresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => setSelectedId(addr.id)}
                  className={`p-4 rounded-2xl border-2 ${selectedId === addr.id ? 'border-rose-500 bg-rose-50/30' : 'border-transparent bg-white'}`}
                  style={{ elevation: selectedId === addr.id ? 0 : 1 }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-row items-center">
                      <Ionicons 
                        name={addr.type === 'Home' ? "home" : "briefcase"} 
                        size={18} 
                        color={selectedId === addr.id ? "#E11D48" : "#6B7280"} 
                      />
                      <Text className={`ml-2 font-bold text-base ${selectedId === addr.id ? 'text-rose-700' : 'text-gray-900'}`}>
                        {addr.type}
                      </Text>
                    </View>
                    <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedId === addr.id ? 'border-rose-500' : 'border-gray-300'}`}>
                      {selectedId === addr.id && <View className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
                    </View>
                  </View>
                  
                  <Text className="font-bold text-gray-900 mb-1">{addr.name} <Text className="font-normal text-gray-500">| {addr.phone}</Text></Text>
                  <Text className="text-gray-600 leading-5">{addr.address}</Text>
                  {addr.city && addr.pincode && <Text className="text-gray-600">{addr.city} - {addr.pincode}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View className="bg-white p-5 rounded-3xl shadow-sm mb-10">
            <Text className="text-lg font-bold text-gray-900 mb-4">Contact Details</Text>
            <TextInput 
              placeholder="Full Name" 
              value={newName}
              onChangeText={setNewName}
              className="bg-gray-50 p-4 rounded-xl mb-3 text-gray-900 border border-gray-100" 
            />
            <TextInput 
              placeholder="Phone Number" 
              keyboardType="phone-pad" 
              value={newPhone}
              onChangeText={setNewPhone}
              className="bg-gray-50 p-4 rounded-xl mb-6 text-gray-900 border border-gray-100" 
            />
            
            <Text className="text-lg font-bold text-gray-900 mb-4">Address</Text>
            <TextInput 
              placeholder="House No, Building, Street" 
              value={newAddressStr}
              onChangeText={setNewAddressStr}
              className="bg-gray-50 p-4 rounded-xl mb-3 text-gray-900 border border-gray-100" 
            />
            <TextInput 
              placeholder="City" 
              value={newCity}
              onChangeText={setNewCity}
              className="bg-gray-50 p-4 rounded-xl mb-3 text-gray-900 border border-gray-100" 
            />
            <TextInput 
              placeholder="Pincode" 
              keyboardType="numeric" 
              value={newPincode}
              onChangeText={setNewPincode}
              className="bg-gray-50 p-4 rounded-xl mb-6 text-gray-900 border border-gray-100" 
            />
            
            <View className="flex-row gap-x-3 mb-4">
               <TouchableOpacity 
                 onPress={() => setNewType("Home")}
                 className={`flex-1 py-3 rounded-xl border items-center ${newType === "Home" ? "bg-rose-50 border-rose-200" : "bg-white border-gray-200"}`}
               >
                 <Text className={`font-bold ${newType === "Home" ? "text-rose-600" : "text-gray-600"}`}>Home</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 onPress={() => setNewType("Work")}
                 className={`flex-1 py-3 rounded-xl border items-center ${newType === "Work" ? "bg-rose-50 border-rose-200" : "bg-white border-gray-200"}`}
               >
                 <Text className={`font-bold ${newType === "Work" ? "text-rose-600" : "text-gray-600"}`}>Work</Text>
               </TouchableOpacity>
            </View>

            <View className="flex-row gap-x-3 mt-4">
              <TouchableOpacity onPress={() => setIsAddingNew(false)} className="flex-1 py-4 rounded-xl items-center bg-gray-100">
                <Text className="font-bold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSaveAddress} 
                className="flex-1 py-4 rounded-xl items-center bg-rose-600"
                style={{ opacity: (!newName || !newPhone || !newAddressStr) ? 0.5 : 1 }}
                disabled={!newName || !newPhone || !newAddressStr}
              >
                <Text className="font-bold text-white">Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {!isAddingNew && (
        <View className="px-5 py-4 bg-white border-t border-gray-100 shadow-lg">
          <TouchableOpacity
            onPress={handleProceed}
            className="items-center rounded-2xl py-4 flex-row justify-center shadow-sm"
            style={{ backgroundColor: "#E11D48" }}
          >
            <Text className="text-base font-bold text-white mr-2">Proceed to Payment</Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Address;
