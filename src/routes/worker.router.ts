import { Router } from "express";
import {
    getWorker,
    loginWorker,
    logoutWorker,
    refreshAccessToken,
    changeCurrentPassword,
    getWorkerProfile,
    updateWorker,
    updateAvatar,
} from "../controllers/worker.controller";
import { verifyWorkerJWT } from "../middlewares/auth.middleware";
import { uploadFile } from "../middlewares/multer.middleware";
import { deleteOrder, getAllOrder, getOrder, placeOrder, updateOrder } from "../controllers/order.controller";
import { create } from "domain";

const router = Router();

/**
 * @route PATCH /api/worker
 * @desc update details of an existing worker
 * @access Private (requires authentication)
 */
router.route("/").patch(
    verifyWorkerJWT,  // Middleware to verify JWT
    updateWorker // Controller to handle update worker
);

/**
 * @route PATCH /api/worker
 * @desc update worker avatar
 * @access Private (requires authentication)
 */
router.route("/update-avatar").patch(
    verifyWorkerJWT,  // Middleware to verify JWT
    uploadFile.single('avatar'),  // Middleware to handle avatar file upload
    updateAvatar // Controller to handle update worker avatar
);

/**
 * @route PATCH /api/worker
 * @desc update worker avatar
 * @access Private (requires authentication)
 */
router.route("/change-password").patch(
    verifyWorkerJWT,  // Middleware to verify JWT
    changeCurrentPassword // Controller to handle update worker password
);


/**
 * @route GET /api/worker/:id
 * @desc get details of all existing workers
 * @access Private (requires worker authentication)
 */
router.route("/:id").get(
    verifyWorkerJWT,  // Middleware to verify JWT
    getWorker // Controller to handle get worker
);

/**
 * @route POST /api/worker/login
 * @desc Login a worker and return JWT
 * @access Public
 */
router.route("/login").post(
    loginWorker  // Controller to handle worker login
);

/**
 * @route POST /api/worker/logout
 * @desc Logout a worker and invalidate JWT
 * @access Private (requires authentication)
 */
router.route("/logout").post(
    verifyWorkerJWT,  // Middleware to verify JWT
    logoutWorker  // Controller to handle logout
);

/**
 * @route GET /api/worker/profile/:username
 * @desc Get the current worker's details
 * @access Private (requires authentication)
 */
router.route("/profile/:username").get(
    verifyWorkerJWT,  // Middleware to verify JWT
    getWorkerProfile // Controller to handle get worker profile
);

/**
 * @route POST /api/worker/refresh-token
 * @desc Refresh the access token for an authenticated worker
 * @access Public
 */
router.route("/refresh-token").post(
    refreshAccessToken  // Controller to handle token refresh
);


// route for order
/**
 * @route POST /api/worker/order
 * @desc add new order
 * @access Private (requires authentication)
 */
router.route("/order").post(
    verifyWorkerJWT,  // Middleware to verify JWT
    placeOrder // Controller to handle add new order
);

/**
 * @route GET /api/worker/order
 * @desc get the list of orders
 * @access Private (requires authentication)
 */
router.route("/order/list").get(
    verifyWorkerJWT,  // Middleware to verify JWT
    getAllOrder // Controller to get the list of orders
);

/**
 * @route GET /api/worker/order/:id
 * @desc get details of an order
 * @access Private (requires authentication)
 */
router.route("/order/:id").get(
    verifyWorkerJWT,  // Middleware to verify JWT
    getOrder // Controller to get an order
);

/**
 * @route PATCH /api/worker/order
 * @desc update details of an existing order
 * @access Private (requires authentication)
 */
router.route("/order").patch(
    verifyWorkerJWT,  // Middleware to verify JWT
    updateOrder // Controller to handle update order
);

/**
 * @route DELETE /api/worker/order/:id
 * @desc delete details of an existing order
 * @access Private (requires authentication)
 */
router.route("/order/:id").patch(
    verifyWorkerJWT,  // Middleware to verify JWT
    deleteOrder // Controller to handle delete order
);




export default router;
