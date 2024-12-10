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

// Create a new gown
exports.createGown = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    const newGown = new Gown({
      name,
      category,
      price,
    });

    const savedGown = await newGown.save();
    res.status(201).json(savedGown);
  } catch (error) {
    res.status(500).json({ message: "Error creating gown", error });
  }
};

// Update an existing gown
exports.updateGown = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;

    const updatedGown = await Gown.findByIdAndUpdate(
      id,
      { name, category, price },
      { new: true } // Return the updated document
    );

    if (!updatedGown) {
      return res.status(404).json({ message: "Gown not found" });
    }

    res.status(200).json(updatedGown);
  } catch (error) {
    res.status(500).json({ message: "Error updating gown", error });
  }
};

// Delete a gown
exports.deleteGown = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGown = await Gown.findByIdAndDelete(id);

    if (!deletedGown) {
      return res.status(404).json({ message: "Gown not found" });
    }

    res.status(200).json({ message: "Gown deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gown", error });
  }
};
