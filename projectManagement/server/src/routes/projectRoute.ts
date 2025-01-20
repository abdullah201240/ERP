import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createProject, deleteProject, getProject, getProjectById } from "../controllers/projectController";

const router = express.Router();

// Route to create a new project
router.post('/create-project', verifyJWT, createProject);

// Route to fetch all projects
router.get('/all-projects', verifyJWT, getProject);

// Route to fetch a specific project by ID
router.get('/project/:id', verifyJWT, getProjectById);

// Route to delete a project by ID
router.delete('/delete-project/:id', verifyJWT, deleteProject);

export default router;
