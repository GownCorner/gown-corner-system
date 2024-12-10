const express = require("express");
const router = express.Router();

// Example Webhook Handler for PayMongo
router.post("/", async (req, res) => {
  try {
    const rawPayload = req.body; // Raw JSON payload from PayMongo
    const signature = req.headers["x-signature"]; // Header signature (if applicable)

    // Validate signature (if required by PayMongo)
    // Example: verifySignature(rawPayload, signature);

    console.log("Webhook payload received:", rawPayload);

    // Handle event types
    const { data, type } = rawPayload;
    switch (type) {
      case "payment.paid":
        console.log("Payment was successful:", data);
        // Update database or send notifications
        break;
      case "payment.failed":
        console.log("Payment failed:", data);
        // Handle payment failure
        break;
      default:
        console.log("Unhandled event type:", type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    res.status(500).json({ message: "Webhook error", error: error.message });
  }
});

module.exports = router;
