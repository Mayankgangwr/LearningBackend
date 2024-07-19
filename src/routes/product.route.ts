import express from "express";
import { verifyRestaurantJWT } from "../middlewares/auth.middleware"; // Adjust the path as needed
import { addProduct } from "../controllers/product.controller";
import { uploadFile } from "../middlewares/multer.middleware";

const router = express.Router();

router.post(
  "/add",
  verifyRestaurantJWT, // Middleware to verify JWT
  uploadFile.single("avatar"), // Middleware to handle avatar file upload
  addProduct // Controller to handle insert product
);


export default router;
