import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createCategory, createUploadDrawing, deleteCategory, updateCategory, viewCategory } from "../controllers/workingDrawingController";
import upload from "../middleware/uploadMiddleware";
const router = express.Router();


router.post("/category",verifyJWT, createCategory);
router.get("/category",verifyJWT, viewCategory);
router.delete("/category/:id", verifyJWT, deleteCategory);
router.put("/category/:id", verifyJWT, updateCategory);

router.post("/upload", upload.array("images", 15),verifyJWT, createUploadDrawing);


export default router;
