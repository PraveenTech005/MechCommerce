const express = require("express");
const {
  register,
  login,
  verifyUser,
  // getProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/hello", async (req, res) => {
  try {
    res.json({ message: "Hello" });
  } catch (error) {
    console.error("Error: ", error.message);
  }
});

router.post("/register", register);
router.post("/login", login);
router.get("/verify", protect, verifyUser);

// Protected route (Any logged-in user can access)
// router.get("/profile", protect, getProfile);

// Admin-only protected route
router.get("/all", protect, authorize("admin"), getAllUsers);

router.put("/role/:id", protect, authorize("admin"), updateUserRole);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
