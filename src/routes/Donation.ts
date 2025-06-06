import { Router } from "express";
import { DonationController } from "../controllers/DonationController";
import { AuthMiddleware } from "../middlewares/AuthMiddlewares";
import multer from "multer";
import uploadConfig from "../config/uploadConfig";

const middleware = new AuthMiddleware()


const router = Router();
const upload = multer(uploadConfig)


router.post(
    "/donations",
    upload.single("image"),
    DonationController.create.bind
  );
router.get('/donations', DonationController.findAll.bind);
router.get('/donations/:id', DonationController.findMine.bind);
router.put('/donations/:id', DonationController.update.bind);
router.delete('/donations/:id', DonationController.delete.bind);

export default router;