import { Router } from "express";
import {
    insertShift,
    getAllWorkerShifts,
    getWorkerShift,
    updateWorkerShift,
    deleteWorkerShift
} from "../controllers/workerShift.controller";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route POST /api/v1/worker-shft
 * @desc Insert a new worker shift
 * @access Private (requires authentication)
 */
router.post(
    '/',
    verifyRestaurantJWT,   // Middleware to verify JWT
    insertShift              // Controller to handle inserting a worker shift
);

/**
 * @route GET /api/v1/worker-shft/list/:restroId
 * @desc Fetch all worker shifts for a specific restaurant
 * @access Private (requires authentication)
 */
router.get(
    '/list/:restroId',
    verifyRestaurantJWT,   // Middleware to verify JWT
    getAllWorkerShifts       // Controller to fetch all worker shifts for the restaurant
);

/**
 * @route GET /api/v1/worker-shft/:id
 * @desc Fetch a specific worker shift by ID
 * @access Private (requires authentication)
 */
router.get(
    '/:id',
    verifyRestaurantJWT,   // Middleware to verify JWT
    getWorkerShift          // Controller to fetch a specific worker shift
);

/**
 * @route PATCH /api/v1/worker-shft/
 * @desc Update a specific worker shift by ID
 * @access Private (requires authentication)
 */
router.patch(
    '/',
    verifyRestaurantJWT,   // Middleware to verify JWT
    updateWorkerShift       // Controller to update a specific worker shift
);

/**
 * @route DELETE /api/v1/worker-shft/:id
 * @desc Delete a specific worker shift by ID
 * @access Private (requires authentication)
 */
router.delete(
    '/:id',
    verifyRestaurantJWT,   // Middleware to verify JWT
    deleteWorkerShift       // Controller to delete a specific worker shift
);

export default router;
