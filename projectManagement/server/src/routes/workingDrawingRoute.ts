import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { addWorkingDrawingImage, createCategory, createDesignMaterial, createDesignMaterialFeedback, createUploadDrawing, deleteCategory, deleteDrawing, deleteMaterial, deleteWorkingDrawingImage, getMaterialsByProject, getWorkingDrawingByProject, updateCategory, updateDrawing, updateDrawingStatus, updateFeedbackStatus, viewAllDrawings, viewCategory, viewDesignMaterialFeedback, viewDrawingById, viewDrawingBySisterConcernId, viewDrawingsByProjectId } from "../controllers/workingDrawingController";
import upload from "../middleware/uploadMiddleware";
const router = express.Router();


router.post("/category",verifyJWT, createCategory);
router.get("/category",verifyJWT, viewCategory);
router.delete("/category/:id", verifyJWT, deleteCategory);
router.put("/category/:id", verifyJWT, updateCategory);

router.post("/drawing", upload.array("designDrawings", 15), createUploadDrawing);
// View all working drawings
router.get('/drawingAll/:projectId', viewAllDrawings);

// View a specific working drawing by ID
router.get('/drawing/:id', viewDrawingById);
router.get('/drawingSisterConcernId/:sisterConcernId', viewDrawingBySisterConcernId);


// Delete a working drawing by ID
router.delete('/drawing/:id', deleteDrawing);

// Update a working drawing by ID
router.put('/drawing/:id', updateDrawing);
router.put('/updateDrawingStatus/:id', updateDrawingStatus);

// Route to delete a Working Drawing Image
router.delete('/working-drawing-image/:id', deleteWorkingDrawingImage);

// Route to add a Working Drawing Image
router.post('/working-drawing-image',upload.single('imageName'), addWorkingDrawingImage);

router.post('/material', createDesignMaterial);
router.get('/material/:projectId', getMaterialsByProject);
router.delete('/material/:id', deleteMaterial);
router.post('/feedback', createDesignMaterialFeedback);
router.get('/feedback/:id', viewDesignMaterialFeedback);

router.put('/feedback/:id', updateFeedbackStatus);

router.get('/viewDrawingsByProjectId/:projectId', viewDrawingsByProjectId);
router.get('/getWorkingDrawingByProject/:id', getWorkingDrawingByProject);



export default router;
