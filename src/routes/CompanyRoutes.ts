import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";

// Instantiate authentication middleware
const middleware = new AuthMiddleware();

// Create a new router instance
const router = Router();

// Public route: Register a new company
router.post("/registerc", CompanyController.register);
// Public route: Company login endpoint
router.post("/loginc", CompanyController.login);
// Protected route: Get current authenticated company profile
router.get("/company/me", middleware.authenticateToken, CompanyController.getMe);
// Protected route: Update current authenticated company profile
router.put("/company/me", middleware.authenticateToken, CompanyController.updateMe);
// Public route: Retrieve all companies
router.get("/company", CompanyController.getAll);
// Public route: Retrieve a company by its ID
router.get("/company/:id", CompanyController.getById);
// Public route: Update a company by its ID
router.put("/company/:id", CompanyController.update);
// Protected route: Delete a company (requires authentication)
router.delete("/company/:id", middleware.authenticateToken, CompanyController.delete);

export default router;
