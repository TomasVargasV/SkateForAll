import { Router } from "express";
import { CompanyController } from "../controllers/CompanyController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";
import { compareSync } from "bcryptjs";

const middleware = new AuthMiddleware()

const router = Router();

router.post('/registerc', CompanyController.register);
router.post('/loginc', CompanyController.login);
router.get('/companys/', middleware.authenticateToken, CompanyController.getAll);

export default router;