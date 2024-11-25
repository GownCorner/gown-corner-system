const Gown = require("../models/Gown");

// Get all gowns
exports.getAllGowns = async (req, res) => {
  try {
    const gowns = await Gown.find();
    res.status(200).json(gowns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gowns", error });
  }
};

// Get a single gown by ID
exports.getGownById = async (req, res) => {
  try {
    const gown = await Gown.findById(req.params.id);
    if (!gown) return res.status(404).json({ message: "Gown not found" });
    res.status(200).json(gown);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gown", error });
  }
};
