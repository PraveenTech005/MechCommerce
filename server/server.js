const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/db");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoute");
const vehicleRoutes = require("./routes/vehicleRoute");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/vehicle", vehicleRoutes);

app.listen(3000, () => console.log("Server Running on 3000"));
