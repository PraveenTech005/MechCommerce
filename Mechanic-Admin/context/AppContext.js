import { createContext, useState } from "react";
import { API_SERVER } from "@env";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_SERVER}/order`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.log(error || "error fetching from db");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_SERVER}/product`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProducts(res.data);
    } catch (error) {
      console.log(error || "error fetching from db");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_SERVER}/user/all`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAllUsers(res.data);
    } catch (error) {
      console.log(error || "error fetching from db");
    } finally {
      setLoading(false);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
