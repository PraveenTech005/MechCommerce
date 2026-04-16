import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";

const index = () => {
  const { fetchOrders, fetchProducts, fetchUsers } = useContext(AppContext);
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, []);
  return <Redirect href="/dashboard" />;
};

export default index;
