const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token Received:", token); // Debug token

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token payload (e.g., id, email, role) to the request object
    console.log("Decoded User Info:", decoded); // Debug decoded user
    next(); // Pass control to the next middleware/handler
  } catch (error) {
    console.error("Token Verification Error:", error.message); // Log token verification errors
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = authMiddleware;
