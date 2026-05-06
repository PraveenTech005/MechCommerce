import { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Token expired or unauthorized. Logging out...");
          await AsyncStorage.removeItem("User");
          setUser(null);
          router.replace("/login");
          Toast.show({
            type: "error",
            text1: "Session Expired",
            text2: "Please log in again",
          });
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const fetchOrders = async (token) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_SERVER}/order`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOrders(res.data);
    } catch (error) {
      console.log(error || "error fetching from db");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (token) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_SERVER}/product`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error || "error fetching from db");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (token) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_SERVER}/user/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAllUsers(res.data);
    } catch (error) {
      console.log(error || "error fetching from db");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    if (!user || !user.token) return;

    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_SERVER}/vehicle`,
      );
      setVehicles(res.data);
    } catch (error) {
      console.log(error || "error fetching vehicles");
    }
  };

  const refreshData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("User");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser && parsedUser.token) {
        setUser(parsedUser);

        await Promise.all([
          fetchOrders(parsedUser.token),
          fetchProducts(parsedUser.token),
          fetchUsers(parsedUser.token),
          fetchVehicles(),
        ]);

        Toast.show({
          type: "success",
          text1: "Data Fetched",
        });
      } else {
        Toast.show({ type: "error", text1: "Failed Fetching Data" });
      }
    } catch (error) {
      console.log(error || "error fetching details");
      Toast.show({ type: "error", text1: "Unexpected Error" });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        orders,
        setOrders,
        fetchOrders,
        products,
        setProducts,
        fetchProducts,
        loading,
        allUsers,
        fetchUsers,
        vehicles,
        setVehicles,
        fetchVehicles,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
