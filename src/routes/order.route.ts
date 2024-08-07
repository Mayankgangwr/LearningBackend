import { Router } from "express";
import { getAllOrder, getOrder, placeOrder, updateOrder } from "../controllers/order.controller";


const router = Router();

/**
 * @route POST /api/worker/order
 * @desc add new order
 * @access Private (requires authentication)
 */
router.route("/:restroId").post(
    placeOrder // Controller to handle add new order
);

/**
 * @route GET /api/worker/order/:id
 * @desc get details of an order
 * @access Private (requires authentication)
 */
router.route("/:id").get(
    getOrder // Controller to get an order
);

/**
 * @route PATCH /api/worker/order
 * @desc update details of an existing order
 * @access Private (requires authentication)
 */
router.route("/").patch(
    updateOrder // Controller to handle update order
);

export default router;