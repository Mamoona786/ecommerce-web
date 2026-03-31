import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const getAdminStats = async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username email")
      .select("-__v");

    const totalRevenueAgg = await Order.aggregate([
      {
        $match: {
          status: { $in: ["pending", "paid", "processing", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    res.status(200).json({
      usersCount,
      productsCount,
      ordersCount,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error.message);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserByIdForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to create user:", error.message);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!username?.trim() || !email?.trim()) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({
      _id: { $ne: req.params.id },
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({ message: "Another user already uses this email" });
    }

    user.username = username.trim();
    user.email = email.trim().toLowerCase();
    user.role = role;

    if (password?.trim()) {
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to update user:", error.message);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Cart.deleteMany({ user: user._id });
    await Order.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "category_name description")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({ products });
  } catch (error) {
    console.error("Failed to fetch products for admin:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email role")
      .populate("items.product", "name image price stock")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders for admin:", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrderByIdForAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email role")
      .populate("items.product", "name image price stock")
      .select("-__v");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Failed to fetch order:", error.message);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const updateOrderByAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Failed to update order:", error.message);
    res.status(500).json({ message: "Failed to update order" });
  }
};

export const deleteOrderByAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete order:", error.message);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export const getAllCartsForAdmin = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("user", "username email role")
      .populate("items.product", "name image price stock")
      .sort({ updatedAt: -1 })
      .select("-__v");

    res.status(200).json({ carts });
  } catch (error) {
    console.error("Failed to fetch carts for admin:", error.message);
    res.status(500).json({ message: "Failed to fetch carts" });
  }
};

export const getCartByIdForAdmin = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("user", "username email role")
      .populate("items.product", "name image price stock")
      .select("-__v");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Failed to fetch cart:", error.message);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const updateCartByAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["active", "checked_out", "abandoned"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid cart status" });
    }

    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.status = status;
    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Failed to update cart:", error.message);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

export const deleteCartByAdmin = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete cart:", error.message);
    res.status(500).json({ message: "Failed to delete cart" });
  }
};
