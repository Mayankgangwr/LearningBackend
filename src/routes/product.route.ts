import express from "express";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware"; // Middleware to verify JWT
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/product.controller"; // Product controllers
import { uploadFile } from "../middlewares/multer.middleware"; // Middleware to handle file uploads

const router = express.Router();

/**
 * @route POST /api/product
 * @desc Add a new product to the inventory
 * @access Private (requires authentication)
 */
router.route("/").post(
  verifyRestaurantJWT, // Middleware to verify restaurant JWT
  uploadFile.single("avatar"), // Middleware to handle single file upload for the product image
  addProduct // Controller to handle product insertion
);

/**
 * @route GET /api/product/list/:restroId
 * @desc get details of all existing products
 * @access Public 
 */
router.route("/list/:restroId").get(
  getAllProducts // Controller to handle get all products
);

/**
 * @route GET /api/product/:id
 * @desc get details of an existing product
 * @access Public
 */
router.route("/:id").get(
  getProduct // Controller to handle get details of an existing product
);

/**
 * @route PATCH /api/product/:id
 * @desc Update details of an existing product
 * @access Private (requires authentication)
 */
router.route("/:id").patch(
  verifyRestaurantJWT, // Middleware to verify restaurant JWT
  updateProduct // Controller to handle update product
);

/**
 * @route DELETE /api/product/:id
 * @desc Update details of an existing product
 * @access Private (requires authentication)
 */
router.route("/:id").delete(
  verifyRestaurantJWT, // Middleware to verify restaurant JWT
  deleteProduct // Controller to handle delete product
);

export default router;
