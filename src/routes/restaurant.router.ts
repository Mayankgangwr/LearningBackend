import { Router } from "express";
import { loginRestaurant, logoutRestaurant, refreshAccessToken, registerRestaurant } from "../controllers/restaurant.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/resgister").post(
    uploadFile.single('avatar'),
    registerRestaurant
);
router.route("/login").post(loginRestaurant);

// secured routes
router.route("/logout").post(verifyRestaurantJWT, logoutRestaurant);

router.route("/refresh-token").post(refreshAccessToken);

export default router;