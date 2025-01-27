
import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createPreProjectAssignedTo, createPreSiteVisitPlan, deleteAssignedToPreProject, deletePreSiteVisitPlan, getPreProjectSiteVisitPlan, updatePreProjectSiteVisitPlan, viewPreSiteVisitPlanById } from "../controllers/siteVisitPlan";
const router = express.Router();

router.post('/create-pre-site-visit-plan', verifyJWT, createPreSiteVisitPlan);
router.get('/view-all-pre-project-site-visit-plan',verifyJWT, getPreProjectSiteVisitPlan);

router.get("/pre-site-visit-plan/:id",verifyJWT, viewPreSiteVisitPlanById);


router.delete('/pre-site-visit-plan/:id', verifyJWT, deletePreSiteVisitPlan);

router.delete('/assignedToPreProject/:id', verifyJWT, deleteAssignedToPreProject);
router.post('/assignedToPreProject', verifyJWT, createPreProjectAssignedTo);
router.put("/pre-site-visit-plan/:id",verifyJWT, updatePreProjectSiteVisitPlan); // Add update route



export default router;
