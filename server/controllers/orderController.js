const Order = require("../models/Order");
const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Helper function to send email
const sendEmailNotification = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: `"GownCorner" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email notification");
  }
};

// Create an order
exports.createOrder = async (req, res) => {
  const { cartItems, totalPrice, shippingDetails } = req.body;

  try {
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
    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query).populate("userId", "email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// Update order status and send email
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id).populate("userId", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Send email notification
    const emailMessage = `
      Hi,

      Your order with ID ${updatedOrder._id} has been updated to status: ${status}.

      Thank you for choosing GownCorner!
    `;
    await sendEmailNotification(order.userId.email, "Order Status Update", emailMessage);

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};
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
// Update an order's status and notify the client
exports.updateOrderStatus = async (id, status) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId", "email name");

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    // Send email notification
    const clientEmail = updatedOrder.userId.email;
    const subject = `Order Status Updated to ${status}`;
    const message = `Dear ${updatedOrder.userId.name}, your order with ID ${updatedOrder._id} has been updated to: ${status}.`;

    await sendEmail(clientEmail, subject, message);

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
};
