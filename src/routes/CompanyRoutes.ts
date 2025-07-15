import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";
import { compareSync } from "bcryptjs";

const middleware = new AuthMiddleware()

const router = Router();

router.post("/registerc", CompanyController.register);
router.post("/loginc", CompanyController.login);
router.get("/company/me", middleware.authenticateToken, CompanyController.getMe);
router.put("/company/me", middleware.authenticateToken, CompanyController.updateMe);
router.get("/company", CompanyController.getAll);
router.get("/company/:id", CompanyController.getById);
router.put("/company/:id", CompanyController.update);
router.delete("/company/:id", CompanyController.delete);

export default router;