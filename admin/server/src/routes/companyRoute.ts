import express from "express";
import { verifyJWT } from "../middleware/companyAuth"; 
import { createCompany, getAllCompany, getProfile, loginCompany, logoutCompany } from "../controllers/companyController";

const router = express.Router();


router.post("/auth/signup", createCompany);
router.post("/auth/login", loginCompany);
router.get("/auth/profile", verifyJWT, getProfile);
router.post("/auth/logout", verifyJWT, logoutCompany);
router.get("/company", verifyJWT, getAllCompany);



export default router;
