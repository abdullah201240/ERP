import express from "express";
import { verifyJWT } from "../middleware/companyAuth"; 
import { createCompany, deleteCompany, getAllCompany, getProfile, loginCompany, logoutCompany, updateCompany } from "../controllers/companyController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();


router.post("/auth/company/signup", upload.single("logo"), createCompany);
router.post("/auth/company/login", loginCompany);
router.get("/auth/company/profile", verifyJWT, getProfile);
router.post("/auth/company/logout", verifyJWT, logoutCompany);
router.get("/company", getAllCompany);

router.put("/auth/company/edit/:id", verifyJWT, upload.single("logo"), updateCompany);
router.delete("/auth/company/delete/:id", verifyJWT, deleteCompany);

export default router;
