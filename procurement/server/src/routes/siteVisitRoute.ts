
import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createPreProjectAssignedTo, createPreSiteVisitPlan, createProjectAssignedTo, createProjectSiteVisitPlan, createSupervisionAssignedTo, createSupervisionSiteVisitPlan, deleteAssignedToPreProject, deleteAssignedToProject, deleteAssignedToSupervision, deletePreSiteVisitPlan, deleteProjectSiteVisitPlan, deleteSupervisionSiteVisitPlan, getPreProjectSiteVisitPlan, getProjectSiteVisitPlan, getSupervisionSiteVisitPlan, updatePreProjectSiteVisitPlan, updateProjectSiteVisitPlan, updateSupervisionSiteVisitPlan, viewPreSiteVisitPlanById, viewProjectSiteVisitPlanById, viewSupervisionSiteVisitPlanById } from "../controllers/siteVisitPlan";
const router = express.Router();

router.post('/create-pre-site-visit-plan', verifyJWT, createPreSiteVisitPlan);
router.get('/view-all-pre-project-site-visit-plan',verifyJWT, getPreProjectSiteVisitPlan);

router.get("/pre-site-visit-plan/:id",verifyJWT, viewPreSiteVisitPlanById);


router.delete('/pre-site-visit-plan/:id', verifyJWT, deletePreSiteVisitPlan);

router.delete('/assignedToPreProject/:id', verifyJWT, deleteAssignedToPreProject);
router.post('/assignedToPreProject', verifyJWT, createPreProjectAssignedTo);
router.put("/pre-site-visit-plan/:id",verifyJWT, updatePreProjectSiteVisitPlan); // Add update route




router.post('/create-project-site-visit-plan', verifyJWT, createProjectSiteVisitPlan);
router.get('/view-all-project-site-visit-plan',verifyJWT, getProjectSiteVisitPlan);

router.get("/project-site-visit-plan/:id",verifyJWT, viewProjectSiteVisitPlanById);


router.delete('/project-site-visit-plan/:id', verifyJWT, deleteProjectSiteVisitPlan);

router.delete('/assignedToProject/:id', verifyJWT, deleteAssignedToProject);
router.post('/assignedToProject', verifyJWT, createProjectAssignedTo);
router.put("/project-site-visit-plan/:id",verifyJWT, updateProjectSiteVisitPlan); // Add update route




router.post('/create-supervision-site-visit-plan', verifyJWT, createSupervisionSiteVisitPlan);
router.get('/view-all-supervision-site-visit-plan',verifyJWT, getSupervisionSiteVisitPlan);

router.get("/supervision-site-visit-plan/:id",verifyJWT, viewSupervisionSiteVisitPlanById);


router.delete('/supervision-site-visit-plan/:id', verifyJWT, deleteSupervisionSiteVisitPlan);

router.delete('/assignedToSupervision/:id', verifyJWT, deleteAssignedToSupervision);
router.post('/assignedToSupervision', verifyJWT, createSupervisionAssignedTo);
router.put("/supervision-site-visit-plan/:id",verifyJWT, updateSupervisionSiteVisitPlan); // Add update route


export default router;
