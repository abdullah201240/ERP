
import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createPreSiteVisitPlan } from "../controllers/siteVisitPlan";
const router = express.Router();

router.post('/create-pre-site-visit-plan', verifyJWT, createPreSiteVisitPlan);

export default router;
