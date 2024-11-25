const Order = require("../models/Order");
const axios = require("axios");

exports.createOrder = async (req, res) => {
  const { cartItems, totalPrice, shippingDetails } = req.body;

  try {
    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }
    if (!totalPrice || !shippingDetails) {
      return res.status(400).json({ message: "Invalid or missing required fields" });
    }

    // Save the order to the database
    const newOrder = new Order({
      userId: req.user.id,
      items: cartItems.map((item) => ({
        gownId: item.gownId,
        price: item.price,
        startDate: item.startDate,
        endDate: item.endDate,
      })),
      totalPrice,
      shippingDetails,
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved to database:", savedOrder);

    // Prepare line_items for PayMongo
    const lineItems = cartItems.map((item) => ({
      name: `Gown ID: ${item.gownId}`,
      amount: item.price * 100, // Convert PHP to centavos
      currency: "PHP",
      quantity: 1,
    }));

    // Initiate PayMongo payment
    const paymentResponse = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            line_items: lineItems, // Updated for proper integration
            currency: "PHP",
            description: `Payment for Order ${savedOrder._id}`,
            payment_method_types: ["card", "gcash"], // Include GCash
            success_url: `http://localhost:3000/success?orderId=${savedOrder._id}`,
            cancel_url: `http://localhost:3000/cancel?orderId=${savedOrder._id}`,
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("PayMongo Response:", paymentResponse.data);

    // Respond with the checkout URL
    res.status(201).json({
      message: "Order created successfully",
      orderId: savedOrder._id,
      checkoutUrl: paymentResponse.data.data.attributes.checkout_url,
    });
  } catch (error) {
    console.error("Error creating order or initiating payment:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to create order or initiate payment.",
      error: error.response?.data || error.message,
    });
  }
};
