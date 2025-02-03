import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createProduct, deleteProduct, updateProduct, viewProduct } from "../controllers/productController";

const router = express.Router();


router.post("/product",verifyJWT, createProduct);
router.get("/product", viewProduct);
router.delete("/product", verifyJWT, deleteProduct);
router.put("/product", verifyJWT, updateProduct);



export default router;
