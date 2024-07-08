import { Router } from "express";
import { loginRestaurant, logoutRestaurant, refreshAccessToken, registerRestaurant } from "../controllers/restaurant.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route POST /register
 * @desc Register a new restaurant
 * @access Public
 */
router.route("/register").post(
    uploadFile.single('avatar'),  // Middleware to handle file upload
    registerRestaurant  // Controller to handle registration
);

/**
 * @route POST /login
 * @desc Login a restaurant
 * @access Public
 */
router.route("/login").post(loginRestaurant);

/**
 * @route POST /logout
 * @desc Logout a restaurant (invalidate JWT)
 * @access Private (requires authentication)
 */
router.route("/logout").post(
    verifyRestaurantJWT,  // Middleware to verify JWT
    logoutRestaurant  // Controller to handle logout
);

/**
 * @route POST /refresh-token
 * @desc Refresh the access token for a restaurant
 * @access Public
 */
router.route("/refresh-token").post(refreshAccessToken);

export default router;
