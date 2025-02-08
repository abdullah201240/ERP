import express from "express";
import { verifyJWT } from "../middleware/companyAuth"; 
import {  createSister, deleteCompany, getAllCompany, getAllSisterConcern, getProfile, loginSister, logoutCompany, updateCompany } from "../controllers/companyController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();


router.post("/auth/sisterConcern/signup", upload.single("logo"), createSister);
router.post("/auth/sisterConcern/login", loginSister);
router.get("/auth/sisterConcern/profile", verifyJWT, getProfile);
router.post("/auth/sisterConcern/logout", verifyJWT, logoutCompany);
router.get("/sisterConcern/:id", getAllSisterConcern);

router.put("/auth/sisterConcern/edit/:id", verifyJWT, upload.single("logo"), updateCompany);
router.delete("/auth/sisterConcern/delete/:id", verifyJWT, deleteCompany);

export default router;
