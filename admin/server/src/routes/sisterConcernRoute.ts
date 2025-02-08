import express from "express";
import { verifyJWT } from "../middleware/companyAuth"; 
import {  createSister, deleteCompany, deleteSister, getAllCompany, getAllSisterConcern, getProfile, getSisterConcernProfile, loginSister, logoutCompany, logoutSisterConcernCompany, updateCompany, updateSister } from "../controllers/companyController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();


router.post("/auth/sisterConcern/signup", upload.single("logo"), createSister);
router.post("/auth/sisterConcern/login", loginSister);
router.get("/auth/sisterConcern/profile", verifyJWT, getSisterConcernProfile);
router.post("/auth/sisterConcern/logout", verifyJWT, logoutSisterConcernCompany);
router.get("/sisterConcern/:id", getAllSisterConcern);

router.put("/auth/sisterConcern/edit/:id", verifyJWT, upload.single("logo"), updateSister);
router.delete("/auth/sisterConcern/delete/:id", verifyJWT, deleteSister);

export default router;
