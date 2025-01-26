import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createAssignedTo, createProject, deleteAssignedTo, deleteProject, getProject, getProjectAll, getProjectById, getProjectsPaginated, updateProject } from "../controllers/projectController";

const router = express.Router();

// Route to create a new project
router.post('/create-project', verifyJWT, createProject);
router.put("/project/:id",verifyJWT, updateProject); // Add update route

// Route to fetch all projects
router.get('/all-projects', getProject);
router.get('/view-all-projects', getProjectsPaginated);



// Route to fetch a specific project by ID
router.get('/project/:id', getProjectById);

// Route to delete a project by ID
router.delete('/delete-project/:id', verifyJWT, deleteProject);
router.delete('/delete-assigned/:id', verifyJWT, deleteAssignedTo);
router.post('/create-assignedTo', verifyJWT, createAssignedTo);




export default router;
