import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createAssignedTo, createDesignPlan, createProject, deleteAssignedTo, deleteDesignPlan, deleteProject, getDesignPlans, getProject, getProjectAll, getProjectById, getProjectsPaginated, updateDesignPlan, updateProject } from "../controllers/projectController";

const router = express.Router();

// Route to create a new project
router.post('/create-project', verifyJWT, createProject);
router.put("/project/:id",verifyJWT, updateProject); // Add update route

// Route to fetch all projects
router.get('/all-projects', verifyJWT,getProject);
router.get('/view-all-projects',verifyJWT, getProjectsPaginated);



// Route to fetch a specific project by ID
router.get('/project/:id',verifyJWT, getProjectById);

// Route to delete a project by ID
router.delete('/delete-project/:id', verifyJWT, deleteProject);
router.delete('/delete-assigned/:id', verifyJWT, deleteAssignedTo);
router.post('/create-assignedTo', verifyJWT, createAssignedTo);

router.post('/designPlan', verifyJWT, createDesignPlan);
router.get('/designPlan', getDesignPlans);
// Delete Design Plan
router.delete("/designPlan/:id", deleteDesignPlan);

// Update Design Plan
router.put("/designPlan/:id", updateDesignPlan);



export default router;
