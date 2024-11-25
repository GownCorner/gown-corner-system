const mongoose = require("mongoose");
const Gown = require("./models/Gown");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedGowns = async () => {
  const gowns = [
    {
      name: "Red Gown",
      category: "evening",
      price: 1000,
      image: "/assets/redgown.jpg",
      availableDates: [],
    },
    {
      name: "Blue Gown",
      category: "formal",
      price: 1000,
      image: "/assets/bluegown.jpg",
      availableDates: [],
    },
    {
      name: "Black Gown",
      category: "casual",
      price: 1000,
      image: "/assets/blackgown.jpg",
      availableDates: [],
    },
  ];

  try {
    await Gown.insertMany(gowns);
    console.log("Gowns added successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding gowns:", error);
    mongoose.connection.close();
  }
};

seedGowns();
