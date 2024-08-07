import { Router } from "express";
import {
    insertOrderStatus,
    getAllOrderStatus,
    getOrderStatus,
    updateOrderStatus,
    deleteOrderStatus
} from "../controllers/orderStatus.controller";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route POST /api/v1/order-status
 * @desc Insert a new order status
 * @access Private (requires authentication)
 */
router.post(
    '/',
    verifyRestaurantJWT,   // Middleware to verify JWT
    insertOrderStatus       // Controller to handle inserting an order status
);

/**
 * @route GET /api/v1/order-status/list/:restroId
 * @desc Fetch all order statuses for a specific restaurant
 * @access Private (requires authentication)
 */
router.get(
    '/list/',
    verifyRestaurantJWT,   // Middleware to verify JWT
    getAllOrderStatus       // Controller to fetch all order statuses for the restaurant
);

/**
 * @route GET /api/v1/order-status/:id
 * @desc Fetch a specific order status by ID
 * @access Private (requires authentication)
 */
router.get(
    '/:id',
    verifyRestaurantJWT,   // Middleware to verify JWT
    getOrderStatus          // Controller to fetch a specific order status
);

/**
 * @route PATCH /api/v1/order-status/
 * @desc Update a specific order status by ID
 * @access Private (requires authentication)
 */
router.patch(
    '/',
    verifyRestaurantJWT,   // Middleware to verify JWT
    updateOrderStatus       // Controller to update a specific order status
);

/**
 * @route DELETE /api/v1/order-status/:id
 * @desc Delete a specific order status by ID
 * @access Private (requires authentication)
 */
router.delete(
    '/:id',
    verifyRestaurantJWT,   // Middleware to verify JWT
    deleteOrderStatus       // Controller to delete a specific order status
);

export default router;
