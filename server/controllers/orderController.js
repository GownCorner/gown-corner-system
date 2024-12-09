const Order = require("../models/Order");
const axios = require("axios");
const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use any other email service provider if needed
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// Function to send email notifications
const sendEmailNotification = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: `"GownCorner" <${process.env.EMAIL_USERNAME}>`, // Sender email
      to: email, // Recipient email
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email notification");
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const { cartItems, totalPrice, shippingDetails } = req.body;

  try {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    if (!totalPrice || !shippingDetails) {
      return res.status(400).json({ message: "Invalid or missing required fields" });
    }

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

    const lineItems = cartItems.map((item) => ({
      name: `Gown ID: ${item.gownId}`,
      amount: item.price * 100, // Convert PHP to centavos
      currency: "PHP",
      quantity: 1,
    }));

    const paymentResponse = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            line_items: lineItems,
            currency: "PHP",
            description: `Payment for Order ${savedOrder._id}`,
            payment_method_types: ["card", "gcash"],
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

    // Send email notification
    const emailMessage = `
      Hi ${shippingDetails.name},

      Your order with ID ${savedOrder._id} totaling ₱${totalPrice} is pending.
      Please complete your payment via the following link:

      ${paymentResponse.data.data.attributes.checkout_url}

      Thank you for choosing GownCorner!

      Best regards,
      GownCorner Team
    `;

    await sendEmailNotification(
      shippingDetails.email,
      "Your Pending Payment with GownCorner",
      emailMessage
    );

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

// Fetch all orders with optional status filter
exports.getAllOrders = async (status) => {
  try {
    const query = status ? { status } : {};
    const orders = await Order.find(query).populate("userId", "email");
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw new Error("Error fetching orders");
  }
};

// Update an order's status
exports.updateOrderStatus = async (id, status) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
};

// Delete an order by ID
exports.deleteOrder = async (id) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    return deletedOrder;
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw error;
  }
};

// Export email notification for reuse in other controllers
exports.sendEmailNotification = sendEmailNotification;
