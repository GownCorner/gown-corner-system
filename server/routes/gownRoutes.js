const express = require("express");
const Gown = require("../models/Gown"); // Ensure the model is correctly imported
const router = express.Router();

// Get all gowns
router.get("/", async (req, res) => {
  try {
    const gowns = await Gown.find({});
    res.status(200).json(gowns);
  } catch (error) {
    console.error("Error fetching gowns:", error);
    res.status(500).json({ message: "Error fetching gowns", error });
  }
});

// Check gown availability
router.post("/availability", async (req, res) => {
  const { gownId, startDate, endDate } = req.body;

  try {
    const gown = await Gown.findById(gownId);

    if (!gown) {
      return res.status(404).json({ message: "Gown not found" });
    }

    // Check if any date overlaps
    const isAvailable = gown.availability.every(
      (range) =>
        new Date(endDate) < new Date(range.startDate) ||
        new Date(startDate) > new Date(range.endDate)
    );

    if (!isAvailable) {
      return res
        .status(400)
        .json({ message: "Gown not available for selected dates" });
    }

    res.status(200).json({ message: "Gown available" });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Error checking availability", error });
  }
});

// Book gown (update availability)
router.post("/book", async (req, res) => {
  const { gownId, startDate, endDate } = req.body;

  try {
    const gown = await Gown.findById(gownId);

    if (!gown) {
      return res.status(404).json({ message: "Gown not found" });
    }

    // Check if any date overlaps
    const isAvailable = gown.availability.every(
      (range) =>
        new Date(endDate) < new Date(range.startDate) ||
        new Date(startDate) > new Date(range.endDate)
    );

    if (!isAvailable) {
      return res
        .status(400)
        .json({ message: "Gown not available for selected dates" });
    }

    // Update the gown's availability
    gown.availability.push({ startDate, endDate });
    await gown.save();

    res.status(200).json({ message: "Gown booked successfully" });
  } catch (error) {
    console.error("Error booking gown:", error);
    res.status(500).json({ message: "Error booking gown", error });
  }
});

module.exports = router;
