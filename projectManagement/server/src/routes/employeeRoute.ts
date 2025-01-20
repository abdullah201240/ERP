import express from "express";
import {createEmployee, getProfile, loginEmployee, logoutEmployee } from "../controllers/employeeController";
import { verifyJWT } from "../middleware/auth"; 

const router = express.Router();


router.post("/auth/signup", createEmployee);
router.post("/auth/login", loginEmployee);
router.get("/auth/profile", verifyJWT, getProfile);
router.post("/auth/logout", verifyJWT, logoutEmployee);



export default router;
