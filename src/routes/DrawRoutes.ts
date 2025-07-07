import { Router } from "express";
import { DrawController } from "../controllers/DrawController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";

const middleware = new AuthMiddleware();

const router = Router();

router.post("/draws", middleware.authenticateToken, DrawController.create);
router.get("/company/draws", middleware.authenticateToken, DrawController.getCompanyDraws);
router.put("/draws/:id", middleware.authenticateToken, DrawController.update);
router.delete("/draws/:id", middleware.authenticateToken, DrawController.delete);

router.get("/draws", DrawController.getAll);
router.get("/draws/:id", DrawController.getById);

router.post("/draws/:id/enroll", middleware.authenticateToken, DrawController.enroll);

export default router;