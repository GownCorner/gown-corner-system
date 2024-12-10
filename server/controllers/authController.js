const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify the provided password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token with user details including the role
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send back the user information and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Ensure the role is part of the response
      },
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body; // Default role is "user"

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
