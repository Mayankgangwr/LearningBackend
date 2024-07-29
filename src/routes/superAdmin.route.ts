import { Router } from "express";
import {
    registerSuperAdmin,
    loginSuperAdmin,
    logoutSuperAdmin,
    updateSuperAdminDetails,
    changeCurrentPassword,
    refreshAccessToken
} from "../controllers/superAdmin.controller";
import { verifySuperAdminJWT } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @route POST /api/superadmin
 * @desc Register a new super admin
 * @access Public
 */
router.post(
    '/',
    registerSuperAdmin   // Controller to handle super admin registration
);

/**
 * @route POST /api/superadmin/login
 * @desc Login a super admin
 * @access Public
 */
router.post(
    '/login',
    loginSuperAdmin     // Controller to handle super admin login
);

/**
 * @route POST /api/superadmin/logout
 * @desc Logout a super admin
 * @access Private (requires authentication)
 */
router.post(
    '/logout',
    verifySuperAdminJWT,  // Middleware to verify JWT
    logoutSuperAdmin      // Controller to handle super admin logout
);

/**
 * @route PATCH /api/superadmin/update
 * @desc Update super admin details
 * @access Private (requires authentication)
 */
router.patch(
    '/update',
    verifySuperAdminJWT,  // Middleware to verify JWT
    updateSuperAdminDetails // Controller to handle updating super admin details
);

/**
 * @route PUT /api/superadmin/change-password
 * @desc Change the current super admin password
 * @access Private (requires authentication)
 */
router.put(
    '/change-password',
    verifySuperAdminJWT,  // Middleware to verify JWT
    changeCurrentPassword // Controller to handle changing the super admin password
);

/**
 * @route POST /api/superadmin/refresh-token
 * @desc Refresh the access token
 * @access Public
 */
router.post(
    '/refresh-token',
    refreshAccessToken   // Controller to handle refreshing the access token
);

export default router;
