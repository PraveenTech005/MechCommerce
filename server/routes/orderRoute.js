const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route("/:id")
  .get(protect, getOrderById)
  .put(protect, authorize("admin"), updateOrder)
  .delete(protect, authorize("admin"), deleteOrder);

module.exports = router;
