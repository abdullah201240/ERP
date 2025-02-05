import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import '../models/association';
import WorkCategory from "../models/workCategory";




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
