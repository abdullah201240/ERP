import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import ERROR_MESSAGES from '../utils/errors/errorMassage'
import ProductCategory from "../models/productCategory";
import ProductUnit from '../models/productUnit';



export const createCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { 
            name, 
            
        } = req.body;

        // Check for required fields
        if (!name) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }

        

        // Create the ProductCategory record
        const createProduct = await ProductCategory.create({
            name
        });

        return res.status(201).json(
            ApiResponse.success('Product Category created successfully')
        );
    }
);

export const viewCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        
       

        const viewProduct = await ProductCategory.findAll();

        return res.status(200).json(
            ApiResponse.success(viewProduct, 'View Product Category retrieved successfully')
        );
    }
);

export const deleteCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deleteProduct = await ProductCategory.findByPk(id);

        if (!deleteProduct) {
            throw new ApiError('Product Category not found', 404, 'NOT_FOUND');
        }

        await deleteProduct.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Product Category deleted successfully')
        );
    }
);

export const updateCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name } = req.body;

        const updateProduct = await ProductCategory.findByPk(id);

        if (!updateProduct) {
            throw new ApiError('Product Category not found', 404, 'NOT_FOUND');
        }

        // Update fields
        updateProduct.name = name || updateProduct.name;
       






        await updateProduct.save();

        return res.status(200).json(
            ApiResponse.success(updateProduct, 'Product updated successfully')
        );
    }
);



export const createUnit = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { 
            name, 
            
        } = req.body;
        console.log(req.body)

        // Check for required fields
        if (!name) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }

        

        // Create the ProductUnit record
        const createUnit = await ProductUnit.create({
            name
        });

        return res.status(201).json(
            ApiResponse.success('Product Unit created successfully')
        );
    }
);

export const viewUnit = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        
       

        const viewUnit = await ProductUnit.findAll();

        return res.status(200).json(
            ApiResponse.success(viewUnit, 'View Product Category retrieved successfully')
        );
    }
);

export const deleteUnit = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deleteProduct = await ProductUnit.findByPk(id);

        if (!deleteProduct) {
            throw new ApiError('Product Unit not found', 404, 'NOT_FOUND');
        }

        await deleteProduct.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Product Unit deleted successfully')
        );
    }
);

export const updateUnit = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name } = req.body;

        const updateUnit = await ProductUnit.findByPk(id);

        if (!updateUnit) {
            throw new ApiError('Product Unit not found', 404, 'NOT_FOUND');
        }

        // Update fields
        updateUnit.name = name || updateUnit.name;
       






        await updateUnit.save();

        return res.status(200).json(
            ApiResponse.success(updateUnit, 'Product Unit updated successfully')
        );
    }
);