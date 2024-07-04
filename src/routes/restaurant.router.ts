import { Router } from "express";
import { registerRestaurant } from "../controllers/restaurant.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import multer from "multer";

const router = Router();
const upload = multer({ dest: './public/temp/' }); // Configure multer for file storage

router.route("/resgister").post(
    uploadFile.single('avatar'),
    registerRestaurant
);

export default router;