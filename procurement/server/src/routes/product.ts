import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createCategory, createUnit, deleteCategory, deleteUnit, updateCategory, updateUnit, viewCategory, viewUnit } from "../controllers/productController";

const router = express.Router();


router.post("/category",verifyJWT, createCategory);
router.get("/category",verifyJWT, viewCategory);
router.delete("/category/:id", verifyJWT, deleteCategory);
router.put("/category/:id", verifyJWT, updateCategory);

router.post("/unit",verifyJWT, createUnit);
router.get("/unit",verifyJWT, viewUnit);
router.delete("/unit/:id", verifyJWT, deleteUnit);
router.put("/unit/:id", verifyJWT, updateUnit);

export default router;
