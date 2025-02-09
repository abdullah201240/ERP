import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import ProductCategory from "../models/productCategory";
import ProductUnit from '../models/productUnit';
import Product from "../models/product";
import { Op } from "sequelize";

import redisClient from "../config/redisClient";
const PRODUCT_CACHE_KEY = "all_products";

// Helper function to remove product-related caches
const clearProductCache = async () => {
    await redisClient.del(PRODUCT_CACHE_KEY);
};

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
            product_category
        } = req.body;

        // Check for required fields
        if (!name || !brand || !countryOfOrigin || !sizeAndDimension || !category || !supplierProductCode || !ourProductCode || !mrpPrice || !discountPercentage || !discountAmount || !sourcePrice || !unit || !product_category) {
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
            product_category
        });

        // Clear cached product list
        await clearProductCache();

        // Return success response
        return res.status(201).json(
            ApiResponse.success('Product created successfully')
        );
    }
);



export const getAllProduct = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, search = "" } = req.query;

        // Parse page and limit as integers
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;
        const cacheKey = `${PRODUCT_CACHE_KEY}_${pageNumber}_${pageSize}_${search}`;
        // Check if products exist in Redis cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        // Fetch from DB if not cached
        const { rows: products, count: totalProducts } = await Product.findAndCountAll({
            where: search
                ? { name: { [Op.like]: `%${search}%` } }
                : {},
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
        await redisClient.del(`product_${id}`);
        await clearProductCache();
        return res.status(200).json(
            ApiResponse.success(null, 'Product  deleted successfully')
        );
    }
);

export const viewProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const cacheKey = `product_${id}`;

    // Check Redis cache first
    const cachedProduct = await redisClient.get(cacheKey);
    if (cachedProduct) {
        return res.status(200).json(JSON.parse(cachedProduct));
    }

    // Fetch from DB if not found in cache
    const product = await Product.findByPk(id);
    if (!product) {
        throw new ApiError("Product not found", 404, "NOT_FOUND");
    }

    // Store in Redis for 30 minutes
    await redisClient.setEx(cacheKey, 1800, JSON.stringify({
        success: true,
        data: product,
        message: "Product retrieved successfully",
    }));

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
            product_category
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

        // Save the updated product to the database
        await product.save();
        // Clear cache for this product and all products
        await redisClient.del(`product_${id}`);
        await clearProductCache();

        return res.status(200).json(
            ApiResponse.success(product, 'Product updated successfully')
        );
    }
);


