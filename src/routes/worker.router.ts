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

export default router;
