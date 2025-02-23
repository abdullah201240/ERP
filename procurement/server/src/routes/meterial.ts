
import upload from "../middleware/uploadMiddleware";

import express from "express";
import {createMaterial, deleteMaterial, getMaterials, updateMaterial} from '../controllers/meterialController'
const router = express.Router();

router.post('/meterial',upload.single('image'), createMaterial);
router.get('/meterial', getMaterials);
router.put('/meterial/:id',upload.single('image'), updateMaterial);
router.delete('/meterial/:id', deleteMaterial);


export default router;
