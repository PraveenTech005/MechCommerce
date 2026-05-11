const { generateToken } = require("../auth/Controller");
const { hashPassword, verifyPassword } = require("../config/hasher");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, pincode } = req.body;

    if (!name || !email || !password || !phone || !address || !city || !pincode) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email/Phone already registered" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      pincode,
      role: "user", // Enforce default role for security
    });

    if (newUser) {
      res.status(201).json({
        message: "Registered Successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const savedUser = await User.findOne({ email });

    if (!savedUser) return res.status(404).json({ message: "User Not Found" });

    const isPassword = await verifyPassword(password, savedUser.password);

    if (!isPassword)
      return res.status(401).json({ message: "Invalid Password" });

    res.status(200).json({
      message: "Login Successful",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        address: savedUser.address,
        city: savedUser.city,
        pincode: savedUser.pincode,
        createdAt: savedUser.createdAt,
        role: savedUser.role,
        token: generateToken(savedUser.email),
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const isValid = await User.findOne({ email: req.user.email }).select(
      "-password",
    );

    if (!isValid) return res.json({ message: "Not A Valid User" });

    return res.json({ message: "User Verified", isValid });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         role: user.role,
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching profile:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.pincode = req.body.pincode || user.pincode;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        pincode: updatedUser.pincode,
        createdAt: updatedUser.createdAt,
        role: updatedUser.role,
        token: generateToken(updatedUser.email),
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role || user.role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error updating user role:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMyAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  verifyUser,
  // getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  deleteMyAccount,
};
