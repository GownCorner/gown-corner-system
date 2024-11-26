const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddleware");
const { getAllUsers, deleteUser } = require("../controllers/userController");

// User routes
router.get("/", isAdmin, getAllUsers); // Fetch all users
router.delete("/:id", isAdmin, deleteUser); // Delete a user

module.exports = router;
