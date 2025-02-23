import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import ApprovedMaterial from "../models/approvedMeterial"; // Corrected typo in model name

export const createMaterial = [
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { projectId, projectName, materialName, description } = req.body;

        // Check if all required fields are present
        if (!projectId || !projectName || !materialName || !description) {
            return next(new ApiError("All fields are required", 400, "BAD_REQUEST"));
        }

        // Check if a file was uploaded
        if (!req.file) {
            return next(new ApiError('No file uploaded', 400, 'BAD_REQUEST'));
        }

        // Get the uploaded file path or URL
        const imagePath = req.file.filename; // Assuming you're using Multer and the file path is stored in `path`

        // Create the ApprovedMaterial record
        const newMaterial = await ApprovedMaterial.create({
            projectId,
            projectName,
            materialName,
            description,
            image: imagePath, // Store the file path or URL
        });

        return res.status(201).json(ApiResponse.success(newMaterial, "Material created successfully"));
    }),
];

// Get All Materials (GET)
export const getMaterials = asyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    let { projectId } = req.query;

    if (Array.isArray(projectId)) {
        projectId = projectId[0]; // Take the first element if it's an array
    }

    if (typeof projectId !== "string") {
        return next(new ApiError('Invalid projectId', 404, 'NOT_FOUND'));

    }
    const materials = await ApprovedMaterial.findAll({ where: { projectId } });
    return res.status(200).json(ApiResponse.success(materials, "Materials retrieved successfully"));
});

// Update Material (PUT)
export const updateMaterial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { materialName, description } = req.body;
    const material = await ApprovedMaterial.findByPk(id);

    if (!material) {
        return next(new ApiError("Material not found", 404, "NOT_FOUND"));
    }

    material.materialName = materialName || material.materialName;
    material.description = description || material.description;

    if (req.file) {
        material.image = req.file.filename;
    }

    await material.save();

    return res.status(200).json(ApiResponse.success(material, "Material updated successfully"));
});

// Delete Material (DELETE)
export const deleteMaterial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const material = await ApprovedMaterial.findByPk(id);

    if (!material) {
        return next(new ApiError("Material not found", 404, "NOT_FOUND"));
    }

    await material.destroy();

    return res.status(200).json(ApiResponse.success(null, "Material deleted successfully"));
});

function next(arg0: ApiError): any {
    throw new Error("Function not implemented.");
}
