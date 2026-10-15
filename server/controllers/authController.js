const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= REGISTER =================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, "i") }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "user"
    });

    await user.save();

    res.status(201).json({
      message: "Registration Successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Register Error:", error);

    res.status(500).json({
      message: "Registration Failed"
    });
  }
};


// ================= LOGIN =================

const login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, "i") }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // ================= JWT TOKEN =================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      {
        expiresIn: "1d"
      }
    );

    // ================= LOGIN RESPONSE =================

    res.status(200).json({

      message: "Login Successful",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login Failed"
    });
  }
};


// ================= FORGOT PASSWORD =================

const forgotPassword = async (req, res) => {
  try {

    const {
      email,
      newPassword
    } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, "i") }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {

    console.error(
      "Forgot Password Error:",
      error
    );

    res.status(500).json({
      message: "Password reset failed"
    });
  }
};


// ================= EXPORT =================

module.exports = {
  register,
  login,
  forgotPassword
};