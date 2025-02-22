import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { addWorkingDrawingImage, createCategory, createDesignMaterial, createDesignMaterialFeedback, createProductionWorkPlans, createProductionWorkUpdate, createSaveMaterials, createUploadDrawing, deleteCategory, deleteDrawing, deleteMaterial, deleteProductionWorkPlans, deleteSaveMaterial, deleteWorkingDrawingImage, getMaterialsByProject, getProductionWorkPlans, getProductionWorkPlans2, getSaveMaterialsByProject, getWorkingDrawingByProject, updateCategory, updateDrawing, updateDrawingStatus, updateFeedbackStatus, UpdateHandOverToAccounts, updateProductionWorkPlans, updateSaveMaterial, updateSaveMaterialFeedback, updateSaveMaterialStatus, viewAllDrawings, viewCategory, viewDesignMaterialFeedback, viewDrawingById, viewDrawingBySisterConcernId, viewDrawingsByProjectId } from "../controllers/workingDrawingController";
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
router.get('/drawingSisterConcernId/:sisterConcernId/:projectId', viewDrawingBySisterConcernId);


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
router.post('/saveMaterials', createSaveMaterials);
router.get('/saveMaterials/:id', getSaveMaterialsByProject);

router.put('/saveMaterials/:id', updateSaveMaterial);
router.put('/saveMaterialsStatus/:id', updateSaveMaterialStatus);
router.delete('/saveMaterials/:id', deleteSaveMaterial);
router.put('/updateSaveMaterialFeedback/:id', updateSaveMaterialFeedback);

router.post('/productionWorkPlan', createProductionWorkPlans);
router.get('/productionWorkPlan/:id', getProductionWorkPlans);
router.delete('/productionWorkPlan/:id', deleteProductionWorkPlans);


router.put('/productionWorkPlan/:id', updateProductionWorkPlans);
router.get('/productionWorkPlan2/:id', getProductionWorkPlans2);


router.post('/productionWorkUpdate', createProductionWorkUpdate);
router.put('/update-hand-over/:id', UpdateHandOverToAccounts);


export default router;
