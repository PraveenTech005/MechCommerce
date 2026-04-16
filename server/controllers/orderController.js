const Order = require("../models/Order");

// @desc    Create a new order
// @route   POST /api/order
// @access  Public
const createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(400).json({ message: "Invalid order data", error: error.message });
  }
};

// @desc    Get orders
// @route   GET /api/order
// @access  Private
const getOrders = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(query).populate("user", "name email phone address").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single order by ID
// @route   GET /api/order/:id
// @access  Public
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email phone address");

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update order
// @route   PUT /api/order/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      Object.assign(order, req.body);
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(400).json({ message: "Invalid order data", error: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/order/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.status(200).json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
