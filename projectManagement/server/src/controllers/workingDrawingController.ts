import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse, ErrorCodes } from "../utils/root";
import '../models/association';
import WorkCategory from "../models/workCategory";
import WorkingDrawing from '../models/workingDrawing'
import WorkingDrawingImage from "../models/workingDrawingImage";
import fs from 'fs';
import path from 'path';
import DesignMaterialList from "../models/designMaterialList";
import Boqfeedback from "../models/boqfeedback";
import SaveMaterial from "../models/saveMaterial";
import { Sequelize } from "sequelize";
import upload from "../middleware/uploadMiddleware";
import ProductionWorkPlan from "../models/productionWorkPlan";
import axios from "axios";
import ProductionWorkUpdate from "../models/productionWorkUpdate";

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



        // Create the WorkCategory record
        const createWork = await WorkCategory.create({
            name,
            sisterConcernId
        });

        return res.status(201).json(
            ApiResponse.success('Work Category created successfully')
        );
    }
);

export const viewCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Get sisterConcernId from query parameters or request body
        const sisterConcernId = req.query.sisterConcernId;

        if (!sisterConcernId) {
            throw new ApiError('Sister Concern ID is required', 400, ErrorCodes.BAD_REQUEST.code);
        }

        // Convert sisterConcernId to a number
        const numericSisterConcernId = Number(sisterConcernId);
        if (isNaN(numericSisterConcernId)) {
            throw new ApiError('Invalid Sister Concern ID', 400, ErrorCodes.BAD_REQUEST.code);
        }

        // Fetch records where sisterConcernId matches the given value
        const viewWork = await WorkCategory.findAll({
            where: {
                sisterConcernId: numericSisterConcernId,  // Condition to match sisterConcernId
            },
        });



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
            unit, category, clientName, clientContact, projectAddress, projectName, sisterConcernId
        } = req.body;

        // Check if files are uploaded
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            throw new ApiError('No files uploaded', 400, 'BAD_REQUEST');
        }

        // Check for required fields
        if (!projectId || !itemName || !itemQuantity || !itemDescription ||
            !unit || !category || !clientName || !clientContact || !projectAddress || !projectName || !sisterConcernId) {
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
            sisterConcernId
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
        const { projectId } = req.params;

        // Calculate the offset for pagination
        const offset = (page - 1) * limit;

        const drawings = await WorkingDrawing.findAll({
            where: {
                projectId
            },
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



export const viewDrawingBySisterConcernId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { sisterConcernId, projectId } = req.params;

        // Find the working drawings by sisterConcernId and sort by projectName
        const drawings = await WorkingDrawing.findAll({
            where: { sisterConcernId, projectId }, // Filter by sisterConcernId

            order: [['projectName', 'ASC']], // Sort by projectName in ascending order
        });

        // Check if drawings are found
        if (!drawings || drawings.length === 0) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        return res.status(200).json(
            ApiResponse.success(drawings, 'Working Drawing retrieved successfully')
        );
    }
);
export const viewDrawingBySisterConcernId2 = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { sisterConcernId } = req.params;

        // Find the working drawings by sisterConcernId and sort by projectName
        const drawings = await WorkingDrawing.findAll({
            where: { sisterConcernId }, // Filter by sisterConcernId

            order: [['projectName', 'ASC']], // Sort by projectName in ascending order
        });

        // Check if drawings are found
        if (!drawings || drawings.length === 0) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        return res.status(200).json(
            ApiResponse.success(drawings, 'Working Drawing retrieved successfully')
        );
    }
);
// Route to update status
export const updateDrawingStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status field
        if (!status) {
            throw new ApiError('Status is required', 400, 'BAD_REQUEST');
        }

        const drawing = await WorkingDrawing.findByPk(id);
        if (!drawing) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        drawing.status = status;
        await drawing.save();

        return res.status(200).json(
            ApiResponse.success(drawing, 'Drawing status updated successfully')
        );
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
                {
                    model: DesignMaterialList,
                    as: "materialList", // Alias defined in the relationship
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

export const deleteWorkingDrawingImage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const image = await WorkingDrawingImage.findByPk(id);

        if (!image) {
            throw new ApiError('Image not found', 404, 'NOT_FOUND');
        }

        const imagePath = path.join(__dirname, '../../uploads', image.imageName);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the image file
        }

        await image.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Working Drawing Image deleted successfully')
        );
    }
);
export const addWorkingDrawingImage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { workingDrawingId } = req.body;

        if (!req.file) {
            throw new ApiError('No file uploaded', 400, 'BAD_REQUEST');
        }

        const file = req.file as Express.Multer.File;


        if (!workingDrawingId) {
            throw new ApiError('Working Drawing not found', 404, 'NOT_FOUND');
        }

        const newImage = await WorkingDrawingImage.create({
            imageName: file.filename,
            workingDrawingId,
        });

        return res.status(201).json(
            ApiResponse.success(newImage, 'Working Drawing Image added successfully')
        );
    }
);

// Create DesignMaterialList entry
export const createDesignMaterial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            projectId, brand, brandModel, category, clientContact, clientName,
            countryOfOrigin, productId, itemDescription, itemName, itemNeed,
            itemQuantity, mrpPrice, productName, ourProductCode, product_category,
            projectAddress, projectName, sourcePrice,
            supplierProductCode, unit, discountAmount, discountPercentage, sisterConcernId
        } = req.body;

        // Validate required fields
        if (!projectId || !brand || !category || !clientContact || !clientName || !countryOfOrigin || !productId || !sisterConcernId) {
            throw new ApiError('Required fields missing', 400, 'BAD_REQUEST');
        }

        // Create new record
        const material = await DesignMaterialList.create({
            projectId,
            brand,
            brandModel,
            category,
            clientContact,
            clientName,
            countryOfOrigin,
            productId,
            itemDescription,
            itemName,
            itemNeed,
            itemQuantity,
            mrpPrice,
            productName,
            ourProductCode,
            product_category,
            projectAddress,
            projectName,
            sourcePrice,
            supplierProductCode,
            unit,
            discountAmount,
            discountPercentage,
            sisterConcernId
        });

        return res.status(201).json(
            ApiResponse.success(material, 'Material created successfully')
        );
    }
);

// Get all materials by projectId
export const getMaterialsByProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;

        if (!projectId) {
            throw new ApiError('Project ID is required', 400, 'BAD_REQUEST');
        }

        const materials = await DesignMaterialList.findAll({ where: { projectId } });

        return res.status(200).json(
            ApiResponse.success(materials, 'Materials fetched successfully')
        );
    }
);
// Delete material by ID
export const deleteMaterial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Check if the record exists
        const material = await DesignMaterialList.findByPk(id);
        if (!material) {
            throw new ApiError('Material not found', 404, 'NOT_FOUND');
        }

        // Delete the record
        await material.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Material deleted successfully')
        );
    }
);



export const createDesignMaterialFeedback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            feedback, drawingId, sisterConcernId
        } = req.body;

        // Validate required fields
        if (!feedback || !drawingId || !sisterConcernId) {
            throw new ApiError('Required fields missing', 400, 'BAD_REQUEST');
        }

        // Create new record
        const material = await Boqfeedback.create({
            feedback,
            drawingId,
            sisterConcernId

        });

        return res.status(201).json(
            ApiResponse.success(material, 'Feedback created successfully')
        );
    }
);

// View a specific working drawing by ID
export const viewDesignMaterialFeedback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const drawings = await Boqfeedback.findAll({
            where: {
                sisterConcernId: id
            },
            include: [
                {
                    model: WorkingDrawing,
                    as: "workingDrawing", // Alias defined in the relationship
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        if (!drawings || drawings.length === 0) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        return res.status(200).json(
            ApiResponse.success(drawings, 'Working Drawing retrieved successfully')
        );
    }
);

export const updateFeedbackStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status field
        if (!status) {
            throw new ApiError('Status is required', 400, 'BAD_REQUEST');
        }

        const drawing = await Boqfeedback.findByPk(id);
        if (!drawing) {
            throw new ApiError('Drawing not found', 404, 'NOT_FOUND');
        }

        drawing.status = status;
        await drawing.save();

        return res.status(200).json(
            ApiResponse.success(drawing, 'Boq feed back status updated successfully')
        );
    }
);


// View all working drawings by Project ID
// export const viewDrawingsByProjectId = asyncHandler(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const { projectId } = req.params;

//         const drawings = await WorkingDrawing.findAll({
//             where: { projectId: projectId },
//             include: [
//                 {
//                     model: WorkingDrawingImage,
//                     as: "images", // Alias defined in the relationship
//                 },
//                 {
//                     model: DesignMaterialList,
//                     as: "materialList", // Alias defined in the relationship
//                 },
//             ],
//         });

//         if (!drawings || drawings.length === 0) {
//             throw new ApiError('No drawings found for the specified project', 404, 'NOT_FOUND');
//         }

//         return res.status(200).json(
//             ApiResponse.success(drawings, 'Working Drawings retrieved successfully')
//         );
//     }
// );


export const viewDrawingsByProjectId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { projectId } = req.params;

        const drawings = await WorkingDrawing.findAll({
            where: { projectId: projectId },
            include: [
                {
                    model: WorkingDrawingImage,
                    as: "images",
                },
                {
                    model: DesignMaterialList,
                    as: "materialList",
                },
            ],
        });

        if (!drawings || drawings.length === 0) {
            throw new ApiError('No drawings found for the specified project', 404, 'NOT_FOUND');
        }
        // Object to store product-wise total calculations
        const productSummary: Record<string, {
            productName: string;
            productCategory: string;
            totalNeed: number;
            perPiecePrice: number;
            totalPrice: number;
        }> = {};


        // Iterate through drawings and accumulate product-wise totals
        drawings.forEach(drawing => {
            if (drawing.materialList) {
                drawing.materialList.forEach(material => {
                    const productCode = material.ourProductCode?.trim(); // Ensure it's a valid string
                    const productName = material.productName?.trim(); // Ensure it's a valid string
                    const productCategory = material.product_category?.trim(); // Ensure it's a valid string

                    if (!productCode || !productName || !productCategory) return; // Skip if required fields are missing

                    const itemNeed = parseInt(material.itemNeed || '0'); // Default to 0 if undefined
                    const mrpPrice = parseFloat(material.mrpPrice || '0'); // Default to 0 if undefined

                    if (!productSummary[productCode]) {
                        productSummary[productCode] = {
                            productName,
                            productCategory,
                            totalNeed: 0,
                            perPiecePrice: mrpPrice,
                            totalPrice: 0
                        };
                    }

                    productSummary[productCode].totalNeed += itemNeed;
                    productSummary[productCode].totalPrice += mrpPrice * itemNeed;
                });
            }
        });
        // Convert productSummary object to an array
        const productSummaryArray = Object.keys(productSummary).map(productCode => ({
            productCode,
            productName: productSummary[productCode].productName,
            productCategory: productSummary[productCode].productCategory,
            totalNeed: productSummary[productCode].totalNeed,
            perPiecePrice: productSummary[productCode].perPiecePrice,
            totalPrice: productSummary[productCode].totalPrice
        }));


        return res.status(200).json(
            ApiResponse.success({ drawings, productSummary: productSummaryArray }, 'Working Drawings and material summary retrieved successfully')
        );
    }
);

export const getWorkingDrawingByProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const projects = await WorkingDrawing.findAll({
            where: { sisterConcernId: id },
            group: ['projectId'], // Group by project ID
        });

        if (!projects.length) {
            throw new ApiError('No projects found', 404, 'NOT_FOUND');
        }

        return res.status(200).json(
            ApiResponse.success(projects, 'Projects fetched successfully')
        );
    }
);


export const createSaveMaterials = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            projectId, productCode, productName, quantity, date, sisterConcernId
        } = req.body;

        // Validate required fields
        if (!projectId || !productCode || !productName || !quantity || !date || !sisterConcernId) {
            throw new ApiError('Required fields missing', 400, 'BAD_REQUEST');
        }

        // Create new record
        const material = await SaveMaterial.create({
            projectId,
            productCode,
            productName,
            quantity,
            date,
            sisterConcernId

        });

        return res.status(201).json(
            ApiResponse.success(material, 'Save Materials created successfully')
        );
    }
);
export const getSaveMaterialsByProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Fetch all materials with sorting logic
        const saveMaterials = await SaveMaterial.findAll({
            where: { projectId: id },
            order: [
                // First, get today's data
                [Sequelize.literal(`CASE WHEN date = '${today}' THEN 0 
                                        WHEN date > '${today}' THEN 1 
                                        ELSE 2 END`), 'ASC'],  // 0 = today, 1 = future, 2 = past
                // Then sort data by date in ascending order (earliest first)
                ['date', 'ASC']
            ],
        });

        if (!saveMaterials.length) {
            throw new ApiError('No Save Materials found', 404, 'NOT_FOUND');
        }

        return res.status(200).json(
            ApiResponse.success(saveMaterials, 'Save Materials fetched successfully')
        );
    }
);


// Update Save Materials by ID
export const updateSaveMaterial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const {
            quantity, date
        } = req.body;

        // Find the material by ID
        const material = await SaveMaterial.findByPk(id);

        if (!material) {
            throw new ApiError('Save Material not found', 404, 'NOT_FOUND');
        }

        // Update the material with the new data
        material.quantity = quantity || material.quantity;
        material.date = date || material.date;

        await material.save();

        return res.status(200).json(
            ApiResponse.success(material, 'Save Material updated successfully')
        );
    }
);
// Delete Save Material by ID
export const deleteSaveMaterial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Find the material by ID
        const material = await SaveMaterial.findByPk(id);

        if (!material) {
            throw new ApiError('Save Material not found', 404, 'NOT_FOUND');
        }

        // Delete the material
        await material.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Save Material deleted successfully')
        );
    }
);

export const updateSaveMaterialStatus = [
    upload.single("image"), // Use multer middleware

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status } = req.body;
        const image = req.file ? req.file.filename : null; // Get uploaded image filename

        // Find the material by ID
        const material = await SaveMaterial.findByPk(id);

        if (!material) {
            throw new ApiError("Save Material not found", 404, "NOT_FOUND");
        }

        // Update status if provided
        if (status) {
            material.status = status;
        }

        // Update image if a new one is uploaded
        if (image) {
            material.image = image;
        }

        await material.save();

        return res.status(200).json(
            ApiResponse.success(material, "Save Material updated successfully")
        );
    }),
];

export const updateSaveMaterialFeedback = [
    upload.array('feedbackFile', 10),  // Allow up to 10 files to be uploaded

    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { status, feedbackText } = req.body;
        const feedbackFile = req.files as Express.Multer.File[];

        // Find the material by ID
        const material = await SaveMaterial.findByPk(id);

        if (!material) {
            throw new ApiError("Save Material not found", 404, "NOT_FOUND");
        }

        // Update status if provided
        if (status) {
            material.status = status;
        }
        if (feedbackText) {
            material.feedbackText = feedbackText;

        }

        // Collect image filenames and update image field (if any files were uploaded)
        if (feedbackFile && feedbackFile.length > 0) {
            material.feedbackFile = feedbackFile.map(file => file.filename).join(', ');  // Join filenames with commas
        }

        await material.save();

        return res.status(200).json(
            ApiResponse.success(material, "Save Material updated successfully")
        );
    }),
];

export const createProductionWorkPlans = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            workingDrawingsId, assignee, workType, startDate, endDate, remarks, projectId
        } = req.body;

        // Validate required fields
        if (!workingDrawingsId || !assignee || !workType || !startDate || !endDate) {
            throw new ApiError('Required fields missing', 400, 'BAD_REQUEST');
        }

        // Create new record
        const material = await ProductionWorkPlan.create({
            workingDrawingsId,
            assignee,
            workType,
            startDate,
            endDate,
            remarks,
            projectId

        });

        return res.status(201).json(
            ApiResponse.success(material, 'Production WorkPlans created successfully')
        );
    }
);

export const getProductionWorkPlans = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { employeeId } = req.query as { employeeId?: string };

        // Fetch all production work plans for the given workingDrawingsId
        let projects = await ProductionWorkPlan.findAll({
            where: { workingDrawingsId: id },
            include: [
                {
                    model: ProductionWorkUpdate,
                    as: "productionWorkUpdate",
                },
            ],
        });

        if (!projects.length) {
            throw new ApiError("No ProductionWorkPlans found", 404, "NOT_FOUND");
        }

        // Fetch employee details for each project
        const updatedProjects = await Promise.all(
            projects.map(async (project) => {
                try {
                    const apiUrl = `${process.env.EXTERNAL_API_URL}sisterConcern/employeeById/${project.assignee}`;

                    if (!process.env.EXTERNAL_API_URL) {
                        console.error("EXTERNAL_API_URL is not defined in .env");
                        return { ...project.toJSON(), employeeName: "Unknown" };
                    }

                    const response = await axios.get(apiUrl);

                    const employeeName =
                        response.status === 200 && response.data ? response.data.name : "Unknown";

                    return {
                        ...project.toJSON(),
                        employeeName,
                    };
                } catch (error: any) {
                    console.error("Error fetching employee details:", error.message);
                    return {
                        ...project.toJSON(),
                        employeeName: "Unknown",
                    };
                }
            })
        );

        // Apply filter for employeeId if it is provided
        let filteredProjects = updatedProjects;
        if (employeeId) {
            console.log("okay")

            console.log(employeeId)
            filteredProjects = updatedProjects.filter((project) => {
                // Ensure both are of the same type, comparing them as strings or numbers
                return String(project.assignee) === String(employeeId);
            });
        }

        return res.status(200).json(
            ApiResponse.success(filteredProjects, "Production Work Plans fetched successfully")
        );
    }
);



// Delete material by ID
export const deleteProductionWorkPlans = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Check if the record exists
        const productionWorkPlans = await ProductionWorkPlan.findByPk(id);
        if (!productionWorkPlans) {
            throw new ApiError('Production Work Plan not found', 404, 'NOT_FOUND');
        }

        // Delete the record
        await productionWorkPlans.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Production Work Plans deleted successfully')
        );
    }
);

// Update production work plan by ID
export const updateProductionWorkPlans = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { workingDrawingsId, assignee, workType, startDate, endDate, remarks, completed, status } = req.body;

        // Find the existing production work plan
        const productionWorkPlan = await ProductionWorkPlan.findByPk(id);

        if (!productionWorkPlan) {
            throw new ApiError('Production Work Plan not found', 404, 'NOT_FOUND');
        }

        // Update the production work plan
        await productionWorkPlan.update({
            workingDrawingsId: workingDrawingsId || productionWorkPlan.workingDrawingsId,
            assignee: assignee || productionWorkPlan.assignee,
            workType: workType || productionWorkPlan.workType,
            startDate: startDate || productionWorkPlan.startDate,
            endDate: endDate || productionWorkPlan.endDate,
            remarks: remarks || productionWorkPlan.remarks,
            completed: completed || productionWorkPlan.completed,
            status: status || productionWorkPlan.status
        });

        return res.status(200).json(
            ApiResponse.success(productionWorkPlan, 'Production Work Plan updated successfully')
        );
    }
);

export const getProductionWorkPlans2 = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Fetch all production work plans for the given workingDrawingsId
        const projects = await ProductionWorkPlan.findAll({
            where: { projectId: id },
        });

        if (!projects.length) {
            throw new ApiError('No ProductionWorkPlans found', 404, 'NOT_FOUND');
        }

        // Fetch employee details for each project
        const updatedProjects = await Promise.all(
            projects.map(async (project) => {
                try {
                    const response = await axios.get(
                        `${process.env.EXTERNAL_API_URL}sisterConcern/employeeById/${project.assignee}`
                    );

                    if (response.status === 200 && response.data) {
                        return {
                            ...project.toJSON(),
                            employeeName: response.data.name, // Assuming `name` is in API response
                        };
                    } else {
                        return {
                            ...project.toJSON(),
                            employeeName: 'Unknown',
                        };
                    }
                } catch (error) {
                    return {
                        ...project.toJSON(),
                        employeeName: 'Unknown',
                    };
                }
            })
        );

        return res.status(200).json(
            ApiResponse.success(updatedProjects, 'Production Work Plans fetched successfully')
        );
    }
);

export const createProductionWorkUpdate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            workingDrawingsId, date, workUpdate, productionWorkPlansId
        } = req.body;

        // Validate required fields
        if (!workingDrawingsId || !date || !workUpdate || !productionWorkPlansId) {
            throw new ApiError('Required fields missing', 400, 'BAD_REQUEST');
        }

        // Create new record
        const material = await ProductionWorkUpdate.create({
            workingDrawingsId,
            date,
            workUpdate,
            productionWorkPlansId



        });

        return res.status(201).json(
            ApiResponse.success(material, 'Production WorkUpdate created successfully')
        );
    }
);

export const UpdateHandOverToAccounts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        // Find the record by ID
        const workPlan = await WorkingDrawing.findByPk(id);
        if (!workPlan) {
            return res.status(404).json({ message: 'Production Work Plan not found' });
        }

        // Update the handOverAccounts field to 1
        workPlan.handOverAccounts = 1;
        await workPlan.save();
        return res.status(200).json(
            ApiResponse.success(workPlan, 'Updated successfully')
        );

    })

export const UpdateMaterialHandOverToAccounts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        // Find the record by ID
        const workPlan = await WorkingDrawing.findByPk(id);
        if (!workPlan) {
            return res.status(404).json({ message: 'Production Work Plan not found' });
        }

        // Update the handOverAccounts field to 1
        workPlan.materialHandOver = 1;
        await workPlan.save();
        return res.status(200).json(
            ApiResponse.success(workPlan, 'Updated successfully')
        );

    })

export const UpdateVatTaxAccounts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { operatingExpense, vat, tax, margin } = req.body;

        // Find the record by ID
        const workPlan = await WorkingDrawing.findByPk(id);
        if (!workPlan) {
            return res.status(404).json({ message: 'Production Work Plan not found' });
        }

        // Update the fields correctly
        await workPlan.update({
            operatingExpense: operatingExpense ?? workPlan.operatingExpense,
            vat: vat ?? workPlan.vat,
            tax: tax ?? workPlan.tax,
            margin: margin ?? workPlan.margin,
        });

        return res.status(200).json(
            ApiResponse.success(workPlan, 'Updated successfully')
        );
    }
);
