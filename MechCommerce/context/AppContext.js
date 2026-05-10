import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { createContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
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

    const fetchVehicles = async (token) => {
        if (!token) return;

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
                    fetchVehicles(parsedUser.token),
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

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <AppContext.Provider value={{ user, setUser, orders, setOrders, products, setProducts, loading, setLoading, vehicles, refreshData }}>
            {children}
        </AppContext.Provider>
    )
}