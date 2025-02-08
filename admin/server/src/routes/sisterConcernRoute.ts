import express from "express";
import { verifyJWT } from "../middleware/sisterConcernAuth"; 
import {  createSister, deleteCompany, deleteSister, getAllCompany, getAllSisterConcern, getProfile, getSisterConcernProfile, loginSister, logoutCompany, logoutSisterConcernCompany, updateCompany, updateSister } from "../controllers/companyController";
import upload from "../middleware/uploadMiddleware";
import { createEmployee, getAllEmployee, loginEmployee, logoutEmployee } from "../controllers/employeeController";

const router = express.Router();


router.post("/auth/sisterConcern/signup", upload.single("logo"), createSister);
router.post("/auth/sisterConcern/login", loginSister);
router.get("/auth/sisterConcern/profile", verifyJWT, getSisterConcernProfile);
router.post("/auth/sisterConcern/logout", verifyJWT, logoutSisterConcernCompany);
router.get("/sisterConcern/:id", getAllSisterConcern);

router.put("/auth/sisterConcern/edit/:id", verifyJWT, upload.single("logo"), updateSister);
router.delete("/auth/sisterConcern/delete/:id", verifyJWT, deleteSister);

router.post("/auth/signup",upload.single("photo"), createEmployee);
router.post("/auth/login", loginEmployee);
router.get("/auth/profile", verifyJWT, getProfile);
router.post("/auth/logout", verifyJWT, logoutEmployee);
router.get("/employee/:id", getAllEmployee);


export default router;
