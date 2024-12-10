const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddleware");
const { getAllUsers, deleteUser, updateUser } = require("../controllers/userController");

// Get all users
router.get("/", isAdmin, getAllUsers);

// Update a user
router.put("/:id", isAdmin, updateUser);

// Delete a user
router.delete("/:id", isAdmin, deleteUser);

module.exports = router;
