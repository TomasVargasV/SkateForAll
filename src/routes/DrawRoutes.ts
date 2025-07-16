import { Router } from "express";
import { DrawController } from "../controllers/DrawController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";
import { upload } from "../config/multer";

// Instantiate authentication middleware
const middleware = new AuthMiddleware();

// Create a new router instance
const router = Router();

/**
 * Protected route: Create a new draw with image upload
 * - Requires valid JWT in Authorization header
 * - 'image' field handled by multer
 */
router.post("/draws", middleware.authenticateToken, upload.single('image'), DrawController.create);
/**
 * Protected route: Check if current user is enrolled in a draw
 * - Returns { isEnrolled: boolean }
 */
router.get("/draws/:id/check-enrollment", middleware.authenticateToken, DrawController.checkEnrollment);
/**
 * Protected route: Get all draws created by the authenticated company
 */
router.get("/company/draws", middleware.authenticateToken, DrawController.getCompanyDraws);
/**
 * Protected route: Update a draw by ID
 */
router.put("/draws/:id", middleware.authenticateToken, DrawController.update);
/**
 * Protected route: Delete a draw by ID
 */
router.delete("/draws/:id", middleware.authenticateToken, DrawController.delete);
/**
 * Public route: Retrieve all draws with simplified data
 */
router.get("/draws", DrawController.getAll);
/**
 * Public route: Retrieve detailed draw info by ID
 */router.get("/draws/:id", DrawController.getById);
/**
 * Protected route: Enroll authenticated user in a draw
 */
router.post("/draws/:id/enroll", middleware.authenticateToken, DrawController.enroll);
/**
 * Protected route: Unenroll authenticated user from a draw
 */
router.delete("/draws/:id/unenroll", middleware.authenticateToken, DrawController.unenroll);
/**
 * Protected route: Execute winner selection for a draw
 * - Draws winners, deactivates the draw, and returns winner list
 */
router.post("/draws/:id/draw-winners", middleware.authenticateToken, DrawController.drawWinners);

export default router;
