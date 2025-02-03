import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import ERROR_MESSAGES from '../utils/errors/errorMassage'
import ProductCategory from "../models/productCategory";



export const createProduct = asyncHandler(
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

export const viewProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        
       

        const viewProduct = await ProductCategory.findAll();

        return res.status(200).json(
            ApiResponse.success(viewProduct, 'View Product retrieved successfully')
        );
    }
);

export const deleteProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deleteProduct = await ProductCategory.findByPk(id);

        if (!deleteProduct) {
            throw new ApiError('Product not found', 404, 'NOT_FOUND');
        }

        await deleteProduct.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Product deleted successfully')
        );
    }
);

export const updateProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name } = req.body;

        const updateProduct = await ProductCategory.findByPk(id);

        if (!updateProduct) {
            throw new ApiError('Product not found', 404, 'NOT_FOUND');
        }

        // Update fields
        updateProduct.name = name || updateProduct.name;
       






        await updateProduct.save();

        return res.status(200).json(
            ApiResponse.success(updateProduct, 'Product updated successfully')
        );
    }
);