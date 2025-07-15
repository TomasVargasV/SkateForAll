import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";

const middleware = new AuthMiddleware()

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/users/', middleware.authenticateToken, UserController.getAll);
router.get('/user/me', middleware.authenticateToken, UserController.getMe);
router.put('/user/me', middleware.authenticateToken, UserController.update);
router.get('/user/my-draws', middleware.authenticateToken, UserController.getUserDraws);


export default router;