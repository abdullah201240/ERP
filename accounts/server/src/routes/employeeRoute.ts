import express from "express";
import {  getProfile, loginEmployee, logoutEmployee } from "../controllers/employeeController";
import { verifyJWT } from "../middleware/auth"; 

const router = express.Router();


router.post("/auth/login", loginEmployee);
router.get("/auth/profile", verifyJWT, getProfile);
router.post("/auth/logout", verifyJWT, logoutEmployee);



export default router;
