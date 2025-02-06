import express from "express";
import { verifyJWT } from "../middleware/companyAuth"; 
import { createCompany, getAllCompany, getProfile, loginCompany, logoutCompany } from "../controllers/companyController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();


router.post("/auth/company/signup", upload.single("logo"), createCompany);
router.post("/auth/company/login", loginCompany);
router.get("/auth/company/profile", verifyJWT, getProfile);
router.post("/auth/company/logout", verifyJWT, logoutCompany);
router.get("/company", verifyJWT, getAllCompany);



export default router;
