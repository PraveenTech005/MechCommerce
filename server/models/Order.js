const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 0 },
        price: { type: Number, required: true, default: 0 },
        image: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, default: "" },
    paymentStatus: { type: String, default: "Pending" },
    orderStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
