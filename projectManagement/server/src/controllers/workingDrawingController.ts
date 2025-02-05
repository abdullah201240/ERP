import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import '../models/association';
import WorkCategory from "../models/workCategory";
import multer from 'multer'



export const createCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { 
            name, 
            
        } = req.body;

        // Check for required fields
        if (!name) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }

        

        // Create the WorkCategory record
        const createWork = await WorkCategory.create({
            name
        });

        return res.status(201).json(
            ApiResponse.success('Work Category created successfully')
        );
    }
);

export const viewCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        
       

        const viewWork = await WorkCategory.findAll();

        return res.status(200).json(
            ApiResponse.success(viewWork, 'View Work Category retrieved successfully')
        );
    }
);

export const deleteCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deleteWork = await WorkCategory.findByPk(id);

        if (!deleteWork) {
            throw new ApiError('Work Category not found', 404, 'NOT_FOUND');
        }

        await deleteWork.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Work Category deleted successfully')
        );
    }
);

export const updateCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name } = req.body;

        const updateWork = await WorkCategory.findByPk(id);

        if (!updateWork) {
            throw new ApiError('Work Category not found', 404, 'NOT_FOUND');
        }

        // Update fields
        updateWork.name = name || updateWork.name;
       






        await updateWork.save();

        return res.status(200).json(
            ApiResponse.success(updateWork, 'Work updated successfully')
        );
    }
);


export const createUploadDrawing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { 
            projectId, itemName, brandModel, itemQuantity, itemDescription, 
            unit, category, clientName, clientContact, projectAddress, projectName 
        } = req.body;

        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            throw new ApiError('No files uploaded', 400, 'BAD_REQUEST');
        }

        // Check for required fields
        if (!projectId || !itemName || !brandModel || !itemQuantity || !itemDescription || 
            !unit || !category || !clientName || !clientContact || !projectAddress || !projectName) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }

        // Creating the WorkCategory record (Assuming `category` is the name)
        const createWork = await WorkCategory.create({
            name: category
        });

        return res.status(201).json(
            ApiResponse.success('Work Category created successfully')
        );
    }
);