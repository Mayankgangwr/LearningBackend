import { Router } from "express";
import { verifySuperAdminJWT } from "../middlewares/auth.middleware";
import { deletePlan, getAllPlans, getPlan, insertPlan, updatePlan } from "../controllers/plan.controller";

const router = Router();

/**
 * @route POST /api/plans
 * @desc Insert a new plan
 * @access Private (requires Super Admin authentication)
 */
router.post(
  '/',
  verifySuperAdminJWT,  // Middleware to verify Super Admin JWT
  insertPlan            // Controller to handle plan insertion
);

/**
 * @route GET /api/plans
 * @desc Fetch all plans
 * @access Public
 */
router.get(
  '/',
  getAllPlans           // Controller to handle fetching all plans
);

/**
 * @route GET /api/plans/:id
 * @desc Fetch a specific plan by ID
 * @access Public
 */
router.get(
  '/:id',
  getPlan               // Controller to handle fetching a specific plan by ID
);

/**
 * @route PATCH /api/plans/:id
 * @desc Update an existing plan by ID
 * @access Private (requires Super Admin authentication)
 */
router.patch(
  '/:id',
  verifySuperAdminJWT,  // Middleware to verify Super Admin JWT
  updatePlan            // Controller to handle updating a specific plan by ID
);

/**
 * @route DELETE /api/plans/:id
 * @desc Delete an existing plan by ID
 * @access Private (requires Super Admin authentication)
 */
router.delete(
  '/:id',
  verifySuperAdminJWT,  // Middleware to verify Super Admin JWT
  deletePlan            // Controller to handle deleting a specific plan by ID
);

export default router;
