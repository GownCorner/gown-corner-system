const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const { gownId, startDate, endDate, price } = req.body;
  const userId = req.user?.id; // Ensure userId exists

  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    cart.items.push({ gownId, startDate, endDate, price });
    cart.totalPrice += price;

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ cartItems: [], totalPrice: 0 });
    }
    res.status(200).json({ cartItems: cart.items, totalPrice: cart.totalPrice });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.removeFromCart = async (req, res) => {
  const userId = req.user?.id;
  const { gownId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.gownId !== gownId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
