import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentRestaurant,
    loginRestaurant,
    logoutRestaurant,
    refreshAccessToken,
    registerRestaurant,
    updateRestaurantAvatar,
    updateRestaurantDetails
} from "../controllers/restaurant.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route POST /api/restaurants/register
 * @desc Register a new restaurant
 * @access Public
 */
router.post("/register", 
    uploadFile.single('avatar'),  // Middleware to handle avatar file upload
    registerRestaurant  // Controller to handle registration
);

/**
 * @route POST /api/restaurants/login
 * @desc Login a restaurant and return JWT
 * @access Public
 */
router.post("/login", 
    loginRestaurant  // Controller to handle restaurant login
);

/**
 * @route POST /api/restaurants/logout
 * @desc Logout a restaurant and invalidate JWT
 * @access Private (requires authentication)
 */
router.post("/logout", 
    verifyRestaurantJWT,  // Middleware to verify JWT
    logoutRestaurant  // Controller to handle logout
);

/**
 * @route POST /api/restaurants/refresh-token
 * @desc Refresh the access token for an authenticated restaurant
 * @access Public
 */
router.post("/refresh-token", 
    refreshAccessToken  // Controller to handle token refresh
);

/**
 * @route GET /api/restaurants/me
 * @desc Get the current restaurant's details
 * @access Private (requires authentication)
 */
router.get("/me", 
    verifyRestaurantJWT,  // Middleware to verify JWT
    getCurrentRestaurant  // Controller to get current restaurant details
);

export default router;
