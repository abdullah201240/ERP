import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import ProductCategory from "../models/productCategory";
import ProductUnit from '../models/productUnit';
import Product from "../models/product";
import { Op } from "sequelize";

import redisClient from "../config/redisClient";
// Helper function to remove product-related caches
const clearProductsCache = async () => {
    try {
        let cursor = 0; // Cursor must be a number, not a string
        let totalKeysDeleted = 0;

        do {
            // Use SCAN to find all keys matching the pattern "employees:*"
            const reply = await redisClient.scan(cursor, {
                MATCH: 'products:*',
                COUNT: 100,
            });

            // Update the cursor for the next iteration
            cursor = reply.cursor;

            // Delete all matching keys
            const keys = reply.keys;
            if (keys.length > 0) {
                await redisClient.del(keys);
                totalKeysDeleted += keys.length;
                console.log(`Deleted ${keys.length} cache keys:`, keys);
            }
        } while (cursor !== 0); // Continue until the cursor returns to 0

        console.log(`Total employee-related cache keys cleared: ${totalKeysDeleted}`);
    } catch (error) {
        console.error("Failed to clear employee cache:", error);
    }
};


export const createCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const {
            name,
            sisterConcernId

        } = req.body;

        // Check for required fields
        if (!name || !sisterConcernId) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }



        // Create the ProductCategory record
        const createProduct = await ProductCategory.create({
            name,
            sisterConcernId
        });

        return res.status(201).json(
            ApiResponse.success('Product Category created successfully')
        );
    }
);

export const viewCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;



        const viewProduct = await ProductCategory.findAll({
            where: {
                sisterConcernId: id
            }
        });


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
        const { name, sisterConcernId } = req.body;

        const updateProduct = await ProductCategory.findByPk(id);

        if (!updateProduct) {
            throw new ApiError('Product Category not found', 404, 'NOT_FOUND');
        }

        // Update fields
        updateProduct.name = name || updateProduct.name;
        updateProduct.sisterConcernId = sisterConcernId || updateProduct.sisterConcernId;








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
            sisterConcernId

        } = req.body;

        // Check for required fields
        if (!name || !sisterConcernId) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }



        // Create the ProductUnit record
        const createUnit = await ProductUnit.create({
            name,
            sisterConcernId
        });

        return res.status(201).json(
            ApiResponse.success('Product Unit created successfully')
        );
    }
);

export const viewUnit = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params;


        const viewUnit = await ProductUnit.findAll({
            where: {
                sisterConcernId: id
            }
        });

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
        const { name, sisterConcernId } = req.body;

        const updateUnit = await ProductUnit.findByPk(id);

        if (!updateUnit) {
            throw new ApiError('Product Unit not found', 404, 'NOT_FOUND');
        }

        // Update fields
        updateUnit.name = name || updateUnit.name;
        updateUnit.sisterConcernId = sisterConcernId || updateUnit.sisterConcernId;







        await updateUnit.save();

        return res.status(200).json(
            ApiResponse.success(updateUnit, 'Product Unit updated successfully')
        );
    }
);



export const createProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Destructure required fields from the request body
        const {
            name,
            brand,
            countryOfOrigin,
            sizeAndDimension,
            category,
            supplierProductCode,
            ourProductCode,
            mrpPrice,
            discountPercentage,
            discountAmount,
            sourcePrice,
            unit,
            product_category,
            sisterConcernId
        } = req.body;

        // Check for required fields
        if (!name || !sisterConcernId || !brand || !countryOfOrigin || !sizeAndDimension || !category || !supplierProductCode || !ourProductCode || !mrpPrice || !discountPercentage || !discountAmount || !sourcePrice || !unit || !product_category) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }

        // Create the Product record
        const createdProduct = await Product.create({
            name,
            brand,
            countryOfOrigin,
            sizeAndDimension,
            category,
            supplierProductCode,
            ourProductCode,
            mrpPrice,
            discountPercentage,
            discountAmount,
            sourcePrice,
            unit,
            product_category,
            sisterConcernId
        });


        try {
            // Attempt to clear the cache
            await clearProductsCache();
            console.log("Cache cleared successfully"); // Log success
            return res.status(201).json({
                message: "Product created successfully",
                employee: createdProduct,
                cacheMessage: "Cache cleared successfully" // Indicate cache was cleared
            });
        } catch (error) {
            console.error("Failed to clear cache:", error); // Log the error
            return res.status(201).json({
                message: "Product created successfully",
                employee: createdProduct,
                cacheMessage: "Cache not cleared" // Indicate cache was not cleared
            });
        }

    }
);

export const getAllProductBySearch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, searchProduct = "" } = req.query;
        const { id } = req.params;

        // Parse page and limit as integers
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const cacheKey = `products:${id}:page=${pageNumber}:limit=${pageSize}:searchProduct=${searchProduct || "all"}`;

        // Try to fetch the data from Redis first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("Retrieving data from cache");
            return res.status(200).json(JSON.parse(cachedData));
        } else {
            console.log("MISS data from cache");
        }
        // Define where condition
        const whereCondition: any = { sisterConcernId: id };
        // Apply search filter if it's not empty
        if (searchProduct) {
            whereCondition.product_category = { [Op.like]: `%${searchProduct}%` }; // Case-insensitive search
        }
        // Fetch from DB if not cached
        const { rows: products, count: totalProducts } = await Product.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset,
            order: [["createdAt", "ASC"]],
        });

        const response = {
            success: true,
            data: {
                products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / pageSize),
                currentPage: pageNumber,
            },
            message: "Products retrieved successfully",
        };

        // Store response in Redis for 10 minutes
        await redisClient.setEx(cacheKey, 600, JSON.stringify(response));

        return res.status(200).json(response);
    }
);

export const getAllProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, search = "" } = req.query;
        const { id } = req.params;

        // Parse page and limit as integers
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const cacheKey = `products:${id}:page=${pageNumber}:limit=${pageSize}:search=${search || "all"}`;

        // Try to fetch the data from Redis first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("Retrieving data from cache");
            return res.status(200).json(JSON.parse(cachedData));
        } else {
            console.log("MISS data from cache");
        }
        // Define where condition
        const whereCondition: any = { sisterConcernId: id };
        // Apply search filter if it's not empty
        if (search) {
            whereCondition.name = { [Op.like]: `%${search}%` }; // Case-insensitive search
        }
        // Fetch from DB if not cached
        const { rows: products, count: totalProducts } = await Product.findAndCountAll({
            where: whereCondition,
            limit: pageSize,
            offset,
            order: [["createdAt", "ASC"]],
        });

        const response = {
            success: true,
            data: {
                products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / pageSize),
                currentPage: pageNumber,
            },
            message: "Products retrieved successfully",
        };

        // Store response in Redis for 10 minutes
        await redisClient.setEx(cacheKey, 600, JSON.stringify(response));

        return res.status(200).json(response);
    }
);


export const deleteProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deleteProduct = await Product.findByPk(id);

        if (!deleteProduct) {
            throw new ApiError('Product  not found', 404, 'NOT_FOUND');
        }

        await deleteProduct.destroy();
        // Clear cache for this product and all products
        await clearProductsCache();

        return res.status(200).json(
            ApiResponse.success(null, 'Product  deleted successfully')
        );
    }
);

export const viewProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Fetch from DB if not found in cache
    const product = await Product.findByPk(id);
    if (!product) {
        throw new ApiError("Product not found", 404, "NOT_FOUND");
    }


    return res.status(200).json({
        success: true,
        data: product,
        message: "Product retrieved successfully",
    });
});

export const updateProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Validate product existence
        const product = await Product.findByPk(id);
        if (!product) {
            throw new ApiError(`Product with ID ${id} not found`, 404, 'NOT_FOUND');
        }

        // Extract valid fields from the request body
        const {
            name,
            brand,
            countryOfOrigin,
            sizeAndDimension,
            category,
            supplierProductCode,
            ourProductCode,
            mrpPrice,
            discountPercentage,
            discountAmount,
            sourcePrice,
            unit,
            product_category,
            sisterConcernId
        } = req.body;

        // Update the product fields
        product.name = name || product.name;
        product.brand = brand || product.brand;
        product.countryOfOrigin = countryOfOrigin || product.countryOfOrigin;
        product.sizeAndDimension = sizeAndDimension || product.sizeAndDimension;
        product.category = category || product.category;
        product.supplierProductCode = supplierProductCode || product.supplierProductCode;
        product.ourProductCode = ourProductCode || product.ourProductCode;
        product.mrpPrice = mrpPrice || product.mrpPrice;
        product.discountPercentage = discountPercentage || product.discountPercentage;
        product.discountAmount = discountAmount || product.discountAmount;
        product.sourcePrice = sourcePrice || product.sourcePrice;
        product.unit = unit || product.unit;
        product.product_category = product_category || product.product_category;
        product.sisterConcernId = sisterConcernId || product.sisterConcernId;


        // Save the updated product to the database
        await product.save();
        await clearProductsCache();

        return res.status(200).json(
            ApiResponse.success(product, 'Product updated successfully')
        );
    }
);


