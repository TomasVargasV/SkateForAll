import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";

// Instantiate authentication middleware
const middleware = new AuthMiddleware();

// Initialize Express router
const router = Router();
/**
 * Public route: Register a new user
 * - Expects name, email, password, phone, instagram, address, and state in the request body
 */
router.post('/register', UserController.register);
/**
 * Public route: User login endpoint
 * - Validates email and password, returns JWT token on success
 */
router.post('/login', UserController.login);
/**
 * Protected route: Retrieve all users
 * - Requires valid JWT in Authorization header
 */
router.get('/users/', middleware.authenticateToken, UserController.getAll);
/**
 * Protected route: Retrieve authenticated user's profile
 * - Excludes password field in response
 */
router.get('/user/me', middleware.authenticateToken, UserController.getMe);
/**
 * Protected route: Update authenticated user's data
 * - Allows updating name, email, password, phone, instagram, address, and state
 */
router.put('/user/me', middleware.authenticateToken, UserController.update);
/**
 * Protected route: Get draws associated with authenticated user
 */
router.get('/user/my-draws', middleware.authenticateToken, UserController.getUserDraws);
/**
 * Protected route: Delete authenticated user's account
 * - Removes user and returns a success message
 */
router.delete('/user/me', middleware.authenticateToken, UserController.deleteMe);

export default router;
