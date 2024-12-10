require("dotenv").config(); // Load environment variables
const axios = require("axios");

exports.createCheckoutSession = async (req, res) => {
  const { amount, currency, description, shippingDetails, cartItems } = req.body;

  // Load the secret key from the environment variables
  const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

  // Debug: Check if environment variables are loaded
  console.log("PayMongo Secret Key:", PAYMONGO_SECRET_KEY ? "Loaded" : "Not Found");

  // Validate required fields
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid or missing 'amount'" });
  }
  if (!currency) {
    return res.status(400).json({ message: "Currency is required" });
  }
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  if (
    !shippingDetails ||
    !shippingDetails.addressLine1 ||
    !shippingDetails.city ||
    !shippingDetails.country ||
    !shippingDetails.phoneNumber
  ) {
    return res.status(400).json({ message: "Incomplete shipping details" });
  }
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart items are required" });
  }

  try {
    // Prepare line_items for PayMongo
    const lineItems = cartItems.map((item) => ({
      name: `Gown ID: ${item.gownId}`,
      amount: item.price * 100, // Convert PHP to centavos
      currency: "PHP",
      quantity: 1,
    }));

    // Make an API call to PayMongo to create a checkout session
    const response = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            line_items: lineItems,
            currency,
            description,
            payment_method_types: ["card", "gcash"], // Include GCash
            success_url: "http://localhost:3000/success", // Update as needed
            cancel_url: "http://localhost:3000/cancel", // Update as needed
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Debug: Log the response from PayMongo
    console.log("PayMongo Response:", response.data);

    // Return the checkout URL to the client
    res.status(200).json({ checkoutUrl: response.data.data.attributes.checkout_url });
  } catch (error) {
    // Handle errors from PayMongo API
    const errorMessage = error.response?.data || error.message;
    console.error("PayMongo Payment Error:", errorMessage);

    res.status(500).json({
      message: "Payment initiation failed.",
      error: errorMessage,
    });
  }
};
