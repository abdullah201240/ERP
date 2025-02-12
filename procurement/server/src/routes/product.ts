import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createCategory, createProduct, createUnit, deleteCategory, deleteProduct, deleteUnit, getAllProduct, updateCategory, updateProduct, updateUnit, viewCategory, viewProductById, viewUnit } from "../controllers/productController";

const router = express.Router();


router.post("/category",verifyJWT, createCategory);
router.get("/category/:id",verifyJWT, viewCategory);
router.delete("/category/:id", verifyJWT, deleteCategory);
router.put("/category/:id", verifyJWT, updateCategory);

router.post("/unit",verifyJWT, createUnit);
router.get("/unit/:id", viewUnit);
router.delete("/unit/:id", verifyJWT, deleteUnit);
router.put("/unit/:id", verifyJWT, updateUnit);


router.post("/product",verifyJWT, createProduct);
router.get("/product/:id", getAllProduct);
router.delete("/product/:id", verifyJWT, deleteProduct);
router.get("/productById/:id",verifyJWT, viewProductById);
router.put("/product/:id",verifyJWT, updateProduct);



export default router;
