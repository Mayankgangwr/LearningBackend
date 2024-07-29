import { Router } from "express";
import {
    insertRole,
    getAllWorkerRole,
    getWorkerRole,
    updateWorkerRole,
    deleteWorkerRole
} from "../controllers/workerRole.controller";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route POST /api/roles
 * @desc Insert a new worker role
 * @access Private (requires authentication)
 */
router.post(
    '/',
    verifyRestaurantJWT,   // Middleware to verify JWT
    insertRole              // Controller to handle inserting a worker role
);

/**
 * @route GET /api/roles/list/:restroId
 * @desc Fetch all worker roles for a specific restaurant
 * @access Private (requires authentication)
 */
router.get(
    '/list/:restroId',
    verifyRestaurantJWT,   // Middleware to verify JWT
    getAllWorkerRole       // Controller to fetch all worker roles for the restaurant
);

/**
 * @route GET /api/roles/:id
 * @desc Fetch a specific worker role by ID
 * @access Private (requires authentication)
 */
router.get(
    '/:id',
    verifyRestaurantJWT,   // Middleware to verify JWT
    getWorkerRole          // Controller to fetch a specific worker role
);

/**
 * @route PATCH /api/roles/:id
 * @desc Update a specific worker role by ID
 * @access Private (requires authentication)
 */
router.patch(
    '/:id',
    verifyRestaurantJWT,   // Middleware to verify JWT
    updateWorkerRole       // Controller to update a specific worker role
);

/**
 * @route DELETE /api/roles/:id
 * @desc Delete a specific worker role by ID
 * @access Private (requires authentication)
 */
router.delete(
    '/:id',
    verifyRestaurantJWT,   // Middleware to verify JWT
    deleteWorkerRole       // Controller to delete a specific worker role
);

export default router;
