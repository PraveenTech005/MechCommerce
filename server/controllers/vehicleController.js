const Vehicle = require("../models/Vehicle");

// @desc    Create a new vehicle
// @route   POST /api/vehicle
// @access  Private/Admin
const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    const createdVehicle = await vehicle.save();
    res.status(201).json(createdVehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error.message);
    res.status(400).json({ message: "Invalid vehicle data", error: error.message });
  }
};

// @desc    Get all vehicles
// @route   GET /api/vehicle
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single vehicle by ID
// @route   GET /api/vehicle/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    console.error("Error fetching vehicle:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicle/:id
// @access  Private/Admin
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      Object.assign(vehicle, req.body);
      
      const updatedVehicle = await vehicle.save();
      res.status(200).json(updatedVehicle);
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    console.error("Error updating vehicle:", error.message);
    res.status(400).json({ message: "Invalid vehicle data", error: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicle/:id
// @access  Private/Admin
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      await vehicle.deleteOne();
      res.status(200).json({ message: "Vehicle removed" });
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
