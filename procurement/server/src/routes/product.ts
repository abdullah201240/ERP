import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createProduct, deleteProduct, updateProduct, viewProduct } from "../controllers/productController";

const router = express.Router();


router.post("/category",verifyJWT, createProduct);
router.get("/category", viewProduct);
router.delete("/category/:id", verifyJWT, deleteProduct);
router.put("/category/:id", verifyJWT, updateProduct);



export default router;
