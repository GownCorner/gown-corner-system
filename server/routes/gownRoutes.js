const express = require("express");
const Gown = require("../models/Gown");
const router = express.Router();

// Get all gowns
router.get("/", async (req, res) => {
  try {
    const gowns = await Gown.find({});
    res.status(200).json(gowns);
  } catch (error) {
    console.error("Error fetching gowns:", error.message);
    res.status(500).json({ message: "Error fetching gowns", error: error.message });
  }
});

// Add a new gown
router.post("/", async (req, res) => {
  const { name, category, price } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ message: "All fields (name, category, price) are required" });
  }

  try {
    const newGown = new Gown({ name, category, price });
    await newGown.save();
    res.status(201).json({ message: "Gown added successfully", gown: newGown });
  } catch (error) {
    console.error("Error adding gown:", error.message);
    res.status(500).json({ message: "Error adding gown", error: error.message });
  }
});

// Update a gown
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ message: "All fields (name, category, price) are required" });
  }

  try {
    const updatedGown = await Gown.findByIdAndUpdate(
      id,
      { name, category, price },
      { new: true, runValidators: true }
    );

    if (!updatedGown) {
      return res.status(404).json({ message: "Gown not found" });
    }

    res.status(200).json({ message: "Gown updated successfully", gown: updatedGown });
  } catch (error) {
    console.error("Error updating gown:", error.message);
    res.status(500).json({ message: "Error updating gown", error: error.message });
  }
});

// Delete a gown
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGown = await Gown.findByIdAndDelete(id);

    if (!deletedGown) {
      return res.status(404).json({ message: "Gown not found" });
    }

    res.status(200).json({ message: "Gown deleted successfully", gown: deletedGown });
  } catch (error) {
    console.error("Error deleting gown:", error.message);
    res.status(500).json({ message: "Error deleting gown", error: error.message });
  }
});

module.exports = router;
