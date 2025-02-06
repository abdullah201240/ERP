import express from "express";
import {createEmployee, getAllEmployee, getProfile, loginEmployee, logoutEmployee } from "../controllers/employeeController";
import { verifyJWT } from "../middleware/auth"; 

const router = express.Router();


router.post("/auth/signup", createEmployee);
router.post("/auth/login", loginEmployee);
router.get("/auth/profile", verifyJWT, getProfile);
router.post("/auth/logout", verifyJWT, logoutEmployee);
router.get("/employee", verifyJWT, getAllEmployee);



export default router;
