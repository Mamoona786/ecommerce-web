import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getAdminStats,
  getAllOrdersForAdmin,
  getAllProductsForAdmin,
  getAllUsersForAdmin,
  getAllCartsForAdmin,
  createUserByAdmin,
  getUserByIdForAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getOrderByIdForAdmin,
  updateOrderByAdmin,
  deleteOrderByAdmin,
  getCartByIdForAdmin,
  updateCartByAdmin,
  deleteCartByAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getAdminStats);

router.get("/users", getAllUsersForAdmin);
router.get("/users/:id", getUserByIdForAdmin);
router.post("/users", createUserByAdmin);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);

router.get("/products", getAllProductsForAdmin);

router.get("/orders", getAllOrdersForAdmin);
router.get("/orders/:id", getOrderByIdForAdmin);
router.put("/orders/:id", updateOrderByAdmin);
router.delete("/orders/:id", deleteOrderByAdmin);

router.get("/carts", getAllCartsForAdmin);
router.get("/carts/:id", getCartByIdForAdmin);
router.put("/carts/:id", updateCartByAdmin);
router.delete("/carts/:id", deleteCartByAdmin);

export default router;
