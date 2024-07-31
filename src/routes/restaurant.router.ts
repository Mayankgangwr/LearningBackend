import { Router } from "express";
import {
    registerRestaurant,
    loginRestaurant,
    logoutRestaurant,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentRestaurant,
    updateRestaurantDetails,
    updateRestaurantAvatar,
    getRestaurantProfile
} from "../controllers/restaurant.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";
import { changeCurrentPasswordByRestaurant, deleteWorker, getAllWorkers, getWorker, insertWorker, updateWorkerByRestaurant } from "../controllers/worker.controller";

const router = Router();

/**
 * @route POST /api/restaurant/register
 * @desc Register a new restaurant
 * @access Public
 */
router.route("/register").post(
    uploadFile.single('avatar'),  // Middleware to handle avatar file upload
    registerRestaurant  // Controller to handle registration
);

/**
 * @route POST /api/restaurant/login
 * @desc Login a restaurant and return JWT
 * @access Public
 */
router.route("/login").post(
    loginRestaurant  // Controller to handle restaurant login
);

/**
 * @route POST /api/restaurant/logout
 * @desc Logout a restaurant and invalidate JWT
 * @access Private (requires authentication)
 */
router.route("/logout").post(
    verifyRestaurantJWT,  // Middleware to verify JWT
    logoutRestaurant  // Controller to handle logout
);

/**
 * @route POST /api/restaurant/refresh-token
 * @desc Refresh the access token for an authenticated restaurant
 * @access Public
 */
router.route("/refresh-token").post(
    refreshAccessToken  // Controller to handle token refresh
);

/**
 * @route GET /api/restaurant/me
 * @desc Get the current restaurant's details
 * @access Private (requires authentication)
 */
router.route("/me").get(
    verifyRestaurantJWT,  // Middleware to verify JWT
    getCurrentRestaurant  // Controller to get current restaurant details
);

/**
 * @route PUT /api/restaurant/change-password
 * @desc Change the current restaurant's password
 * @access Private (requires authentication)
 */
router.route("/change-password").put(
    verifyRestaurantJWT,  // Middleware to verify JWT
    changeCurrentPassword  // Controller to handle password change
);

/**
 * @route PATCH /api/restaurant/update-details
 * @desc Update the current restaurant's details
 * @access Private (requires authentication)
 */
router.route("/update-details").patch(
    verifyRestaurantJWT,  // Middleware to verify JWT
    updateRestaurantDetails  // Controller to handle details update
);

/**
 * @route PATCH /api/restaurant/update-avatar
 * @desc Update the current restaurant's avatar
 * @access Private (requires authentication)
 */
router.route("/update-avatar").patch(
    verifyRestaurantJWT,  // Middleware to verify JWT
    uploadFile.single('avatar'),  // Middleware to handle avatar file upload
    updateRestaurantAvatar  // Controller to handle avatar update
);

/**
 * @route GET /api/restaurant/profile/:username
 * @desc Get the current restaurant's details
 * @access Private (requires authentication)
 */
router.route("/profile/:username").get(
    verifyRestaurantJWT,  // Middleware to verify JWT
    getRestaurantProfile // Controller to handle get restaurant profile
)

// route for worker

/**
 * @route POST /api/v1/restaurant/worker
 * @desc Insert a new worker
 * @access Private (requires authentication)
 */
router.route('/worker').post(
    verifyRestaurantJWT,   // Middleware to verify JWT
    uploadFile.single('avatar'),  // Middleware to handle avatar file upload
    insertWorker              // Controller to handle inserting a worker
);

/**
 * @route GET /api/restaurant/worker/list
 * @desc get details of all existing workers
 * @access Private (requires authentication)
 */
router.route("/worker/list").get(
    verifyRestaurantJWT,  // Middleware to verify JWT
    getAllWorkers // Controller to handle get all workers
);

/**
 * @route GET /api/restaurant/worker/:id
 * @desc get details of an existing worker
 * @access Private (requires authentication)
 */
router.route("/worker/:id").get(
    verifyRestaurantJWT,  // Middleware to verify JWT
    getWorker // Controller to handle get worker
);


/**
 * @route PATCH /api/restaurant/worker/:id
 * @desc update details of an existing worker
 * @access Private (requires authentication)
 */
router.route("/worker/").patch(
    verifyRestaurantJWT,  // Middleware to verify JWT
    updateWorkerByRestaurant // Controller to handle update worker
);

/**
 * @route PATCH /api/restaurant/worker/:id
 * @desc update details of an existing worker
 * @access Private (requires authentication)
 */
router.route("/worker/change-password").patch(
    verifyRestaurantJWT,  // Middleware to verify JWT
    changeCurrentPasswordByRestaurant // Controller to handle update worker
);

/**
 * @route DELETE /api/restaurant/worker/:id
 * @desc get details of all existing workers
 * @access Private (requires authentication)
 */
router.route("/worker/:id").delete(
    verifyRestaurantJWT,  // Middleware to verify JWT
    deleteWorker // Controller to delete worker
);

export default router;
