import { Router } from "express";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";
import {
    addProductCategory,
    deleteProductCategory,
    getAllProductCategories,
    getProductCategory,
    updateProductCategory
} from "../controllers/productCategory.controller";

const router = Router();

/**
 * @route POST /api/category
 * @desc Insert a new product category
 * @access Private (requires authentication)
 */
router.post(
    '/',
    verifyRestaurantJWT,  // Middleware to verify JWT
    addProductCategory     // Controller to handle inserting a product category
);

/**
 * @route GET /api/category/list/:restroId
 * @desc Fetch all product categories for a specific restaurant
 * @access Public
 */
router.get(
    '/list/:restroId',
    getAllProductCategories  // Controller to fetch all product categories
);

/**
 * @route GET /api/category/:id
 * @desc Fetch a specific product category
 * @access Public
 */
router.get(
    '/:id',
    getProductCategory       // Controller to fetch a specific product category
);

/**
 * @route PATCH /api/category/:id
 * @desc Update a specific product category
 * @access Private (requires authentication)
 */
router.patch(
    '/:id',
    verifyRestaurantJWT,     // Middleware to verify JWT
    updateProductCategory    // Controller to update a product category
);

/**
 * @route DELETE /api/category/:id
 * @desc Delete a specific product category
 * @access Private (requires authentication)
 */
router.delete(
    '/:id',
    verifyRestaurantJWT,     // Middleware to verify JWT
    deleteProductCategory    // Controller to delete a product category
);

export default router;
