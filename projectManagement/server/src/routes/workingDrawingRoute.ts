import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createCategory, deleteCategory, updateCategory, viewCategory } from "../controllers/workingDrawingController";
const router = express.Router();


router.post("/category",verifyJWT, createCategory);
router.get("/category",verifyJWT, viewCategory);
router.delete("/category/:id", verifyJWT, deleteCategory);
router.put("/category/:id", verifyJWT, updateCategory);

export default router;
