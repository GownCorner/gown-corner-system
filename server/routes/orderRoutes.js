const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

// Route to create an order
router.post("/", authMiddleware, createOrder);

// Route to fetch all orders (with optional status filter)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query; // Optional status filter
    const orders = await getAllOrders(status);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// Route to update an order's status and notify the client
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required to update an order" });
  }

  try {
    const updatedOrder = await updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
});

// Route to delete an order
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await deleteOrder(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
});


module.exports = router;
