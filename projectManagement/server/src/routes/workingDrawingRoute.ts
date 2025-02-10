import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { addWorkingDrawingImage, createCategory, createUploadDrawing, deleteCategory, deleteDrawing, deleteWorkingDrawingImage, updateCategory, updateDrawing, viewAllDrawings, viewCategory, viewDrawingById } from "../controllers/workingDrawingController";
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

// Delete a working drawing by ID
router.delete('/drawing/:id', deleteDrawing);

// Update a working drawing by ID
router.put('/drawing/:id', updateDrawing);
// Route to delete a Working Drawing Image
router.delete('/working-drawing-image/:id', deleteWorkingDrawingImage);

// Route to add a Working Drawing Image
router.post('/working-drawing-image',upload.single('imageName'), addWorkingDrawingImage);


export default router;
