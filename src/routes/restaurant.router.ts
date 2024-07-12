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

const router = Router();

/**
 * @route POST /api/restaurants/register
 * @desc Register a new restaurant
 * @access Public
 */
router.route("/register").post(
    uploadFile.single('avatar'),  // Middleware to handle avatar file upload
    registerRestaurant  // Controller to handle registration
);

/**
 * @route POST /api/restaurants/login
 * @desc Login a restaurant and return JWT
 * @access Public
 */
router.route("/login").post(
    loginRestaurant  // Controller to handle restaurant login
);

/**
 * @route POST /api/restaurants/logout
 * @desc Logout a restaurant and invalidate JWT
 * @access Private (requires authentication)
 */
router.route("/logout").post(
    verifyRestaurantJWT,  // Middleware to verify JWT
    logoutRestaurant  // Controller to handle logout
);

/**
 * @route POST /api/restaurants/refresh-token
 * @desc Refresh the access token for an authenticated restaurant
 * @access Public
 */
router.route("/refresh-token").post(
    refreshAccessToken  // Controller to handle token refresh
);

/**
 * @route GET /api/restaurants/me
 * @desc Get the current restaurant's details
 * @access Private (requires authentication)
 */
router.route("/me").get(
    verifyRestaurantJWT,  // Middleware to verify JWT
    getCurrentRestaurant  // Controller to get current restaurant details
);

/**
 * @route PUT /api/restaurants/change-password
 * @desc Change the current restaurant's password
 * @access Private (requires authentication)
 */
router.route("/change-password").put(
    verifyRestaurantJWT,  // Middleware to verify JWT
    changeCurrentPassword  // Controller to handle password change
);

/**
 * @route PATCH /api/restaurants/update-details
 * @desc Update the current restaurant's details
 * @access Private (requires authentication)
 */
router.route("/update-details").patch(
    verifyRestaurantJWT,  // Middleware to verify JWT
    updateRestaurantDetails  // Controller to handle details update
);

/**
 * @route PATCH /api/restaurants/update-avatar
 * @desc Update the current restaurant's avatar
 * @access Private (requires authentication)
 */
router.route("/update-avatar").patch(
    verifyRestaurantJWT,  // Middleware to verify JWT
    uploadFile.single('avatar'),  // Middleware to handle avatar file upload
    updateRestaurantAvatar  // Controller to handle avatar update
);

/**
 * @route GET /api/restaurants/me
 * @desc Get the current restaurant's details
 * @access Private (requires authentication)
 */
router.route("/profile/:username").get(
    verifyRestaurantJWT,
    getRestaurantProfile
)

router.route

export default router;
