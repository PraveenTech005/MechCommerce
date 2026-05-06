const express = require("express");
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getVehicles)
  .post(protect, authorize("admin"), createVehicle);

router.route("/:id")
  .get(getVehicleById)
  .put(protect, authorize("admin"), updateVehicle)
  .delete(protect, authorize("admin"), deleteVehicle);

module.exports = router;
