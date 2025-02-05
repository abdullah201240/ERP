import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import '../models/association';
import WorkCategory from "../models/workCategory";
import WorkingDrawing from '../models/workingDrawing'
import WorkingDrawingImage from "../models/workingDrawingImage";
import fs from 'fs';
import path from 'path';

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


// API Endpoint for uploading drawing and related data
export const createUploadDrawing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            projectId, itemName, brandModel, itemQuantity, itemDescription,
            unit, category, clientName, clientContact, projectAddress, projectName
        } = req.body;

        // Check if files are uploaded
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            throw new ApiError('No files uploaded', 400, 'BAD_REQUEST');
        }

        // Check for required fields
        if (!projectId || !itemName  || !itemQuantity || !itemDescription ||
            !unit || !category || !clientName || !clientContact || !projectAddress || !projectName) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }

        // Create the WorkingDrawing record
        const workingDrawing = await WorkingDrawing.create({
            projectId,
            itemName,
            brandModel,
            itemQuantity,
            itemDescription,
            unit,
            category,
            clientName,
            clientContact,
            projectAddress,
            projectName,
        });

        // Upload the images and create WorkingDrawingImage records
        const files = req.files as Express.Multer.File[];
        const imageRecords = files.map((file) => {
            return {
                imageName: file.filename,
                workingDrawingId: workingDrawing.id,
            };
        });

        // Create associated WorkingDrawingImage records
        await WorkingDrawingImage.bulkCreate(imageRecords);

        return res.status(201).json(
            ApiResponse.success(workingDrawing, 'Working Drawing and images uploaded successfully')
        );
    }
);

// View all working drawings
export const viewAllDrawings = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        // Get the page and limit from query parameters, default to page 1 and limit 10
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        // Calculate the offset for pagination
        const offset = (page - 1) * limit;

        const drawings = await WorkingDrawing.findAll({
            include: [
                {
                    model: WorkingDrawingImage,
                    as: "images", // Alias defined in the relationship
                },
            ],
            limit: limit, // Limit to 10 records per page
            offset: offset, // Apply offset for pagination
            order: [["createdAt", "DESC"]],
        });
        // Get the total number of projects to calculate the total pages
        const totalDrawings = await WorkingDrawing.count();

        if (!drawings || drawings.length === 0) {
            throw new ApiError('No drawings found', 404, 'NOT_FOUND');
        }
        return res.status(200).json({
            success: true,
            data: {
                drawings: drawings,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalDrawings / limit),
                    totalDrawings: totalDrawings,
                },
            },
            message: "Drawings retrieved successfully",
        });

    }
);



// View a specific working drawing by ID
export const viewDrawingById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const drawing = await WorkingDrawing.findByPk(id, {
            include: [
                {
                    model: WorkingDrawingImage,
                    as: "images", // Alias defined in the relationship
                },
            ],
        });

        if (!drawing) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        return res.status(200).json(
            ApiResponse.success(drawing, 'Working Drawing retrieved successfully')
        );
    }
);




export const deleteDrawing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Find the drawing by ID
        const drawing = await WorkingDrawing.findByPk(id);

        if (!drawing) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        // Fetch associated images from the database
        const images = await WorkingDrawingImage.findAll({
            where: { workingDrawingId: drawing.id }
        });

        let deletionResults: string[] = [];

        if (images.length > 0) {
            images.forEach(image => {
                const imagePath = path.join(__dirname, '../../uploads', image.imageName);
                console.log('Image Path:', imagePath); // Log the constructed file path

                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath); // Delete the image file
                        deletionResults.push(`Deleted: ${imagePath}`);
                    } catch (error: any) {
                        deletionResults.push(`Failed to delete ${imagePath}: ${error.message}`);
                    }
                } else {
                    deletionResults.push(`File not found: ${imagePath}`);
                }
            });
        } else {
            deletionResults.push('No associated images found.');
        }

        // Now delete the images from the database
        await WorkingDrawingImage.destroy({
            where: { workingDrawingId: drawing.id }
        });

        // Now delete the drawing itself from the database
        await drawing.destroy();

        // Return success response with deletion results
        return res.status(200).json(
            ApiResponse.success(
                { deletionResults },
                'Working Drawing and associated images deleted successfully'
            )
        );
    }
);



// Edit (update) a working drawing by ID
export const updateDrawing = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const {
            projectId, itemName, brandModel, itemQuantity, itemDescription,
            unit, category, clientName, clientContact, projectAddress, projectName
        } = req.body;

        const drawing = await WorkingDrawing.findByPk(id);

        if (!drawing) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        // Update fields only if provided, otherwise keep the existing value
        drawing.projectId = projectId || drawing.projectId;
        drawing.itemName = itemName || drawing.itemName;
        drawing.brandModel = brandModel || drawing.brandModel;
        drawing.itemQuantity = itemQuantity || drawing.itemQuantity;
        drawing.itemDescription = itemDescription || drawing.itemDescription;
        drawing.unit = unit || drawing.unit;
        drawing.category = category || drawing.category;
        drawing.clientName = clientName || drawing.clientName;
        drawing.clientContact = clientContact || drawing.clientContact;
        drawing.projectAddress = projectAddress || drawing.projectAddress;
        drawing.projectName = projectName || drawing.projectName;

        await drawing.save();

        return res.status(200).json(
            ApiResponse.success(drawing, 'Working Drawing updated successfully')
        );
    }
);