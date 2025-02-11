import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import ERROR_MESSAGES from "../utils/errors/errorMassage";

import '../models/association';
import { AssignedToPreProjectSchema, AssignedToProjectSchema, AssignedToSupervisionSchema, preSiteVisitPlanSchema, preSiteVisitPlanUpateSchema, projectSiteVisitPlanSchema, projectSiteVisitPlanUpateSchema, SupervisionSiteVisitPlanSchema, SupervisionSiteVisitPlanUpateSchema } from "../validators/siteVisitValidators";
import { AssignedPreSiteVisitPlan, AssignedSupervisionSiteVisitPlan, PreSiteVisitPlan, Project } from "../models/association";
import { Op } from "sequelize";
import ProjectSiteVisitPlan from "../models/projectSiteVisitPlan";
import AssignedProjectSiteVisitPlan from "../models/assignedProjectSiteVisitPlan";
import SupervisionSiteVisitPlan from "../models/supervisionSiteVisitPlan"

export const createPreSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const result = preSiteVisitPlanSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { projectName, projectId, projectAddress, clientContact, clientName, visitDateTime } = req.body;


        // Check if employee or not
        const existingProject = await Project.findOne({ where: { id: projectId } });
        if (!existingProject) {
            throw new ApiError(
                ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
                404,
                ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
            );
        }

        // Create the new project in the database
        const newPreSiteVisitPlan = await PreSiteVisitPlan.create({
            projectId,
            projectName,
            clientNumber: clientContact,
            clientName,
            visitDateTime,
            ProjectAddress: projectAddress,
        });

        if (!newPreSiteVisitPlan) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newPreSiteVisitPlan, "New Pre Site VisitPlan created successfully")
        );
    });



    export const getPreProjectSiteVisitPlan = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { page = 1, limit = 10, search = "" } = req.query;
            const { projectId } = req.params;
    
            // Parse page and limit as integers
            const pageNumber = parseInt(page as string, 10);
            const pageSize = parseInt(limit as string, 10);
            const offset = (pageNumber - 1) * pageSize;
    
            // Fetch projects with pagination, search, and filtering by projectId
            const { rows: preProjectSiteVisitPlan, count: totalPreSiteVisitPlan } = await PreSiteVisitPlan.findAndCountAll({
                where: {
                    projectId, // Filter by projectId
                    ...(search && {
                        projectName: {
                            [Op.like]: `%${search}%`, // Case-sensitive search for MariaDB/MySQL
                        },
                    }),
                },
                include: [
                    {
                        model: AssignedPreSiteVisitPlan,
                        as: "assigned", // Alias defined in the relationship
                    },
                ],
                limit: pageSize,
                offset: offset,
                order: [["createdAt", "DESC"]], // Sort by most recent
            });
    
            return res.status(200).json({
                success: true,
                data: {
                    preProjectSiteVisitPlan,
                    totalPreSiteVisitPlan,
                    totalPages: Math.ceil(totalPreSiteVisitPlan / pageSize),
                    currentPage: pageNumber,
                },
                message: "Pre Project Site Visit Plan retrieved successfully",
            });
        }
    );
    


export const deletePreSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Check if the PreSiteVisitPlan exists
        const existingPlan = await PreSiteVisitPlan.findByPk(id, {
            include: [
                {
                    model: AssignedPreSiteVisitPlan,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
        });

        if (!existingPlan) {
            throw new ApiError(
                "Pre Site Visit Plan not found",
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Delete all associated AssignedPreSiteVisitPlan records
        if (existingPlan.assigned && existingPlan.assigned.length > 0) {
            await AssignedPreSiteVisitPlan.destroy({
                where: { preSiteVisitPlanId: id }, // Assuming this is the foreign key in AssignedPreSiteVisitPlan
            });
        }

        // Delete the PreSiteVisitPlan
        await existingPlan.destroy();

        return res.status(200).json(
            ApiResponse.success(null, "Pre Site Visit Plan and associated records deleted successfully")
        );
    }
);


export const viewPreSiteVisitPlanById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Fetch the PreSiteVisitPlan by ID
        const preSiteVisitPlan = await PreSiteVisitPlan.findByPk(id, {
            include: [
                {
                    model: AssignedPreSiteVisitPlan,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
        });

        if (!preSiteVisitPlan) {
            throw new ApiError(
                "Pre Site Visit Plan not found",
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        return res.status(200).json(
            ApiResponse.success(preSiteVisitPlan, "Pre Site Visit Plan retrieved successfully")
        );
    }
);



// Create Project Controller
export const createPreProjectAssignedTo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = AssignedToPreProjectSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { eid, preSiteVisitPlanId, eName } = req.body;

        // Create the new project in the database
        const newAssigned = await AssignedPreSiteVisitPlan.create({
            eid,
            preSiteVisitPlanId,
            eName,
        });

        if (!newAssigned) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newAssigned, "Assigned created successfully")
        );
    });

// Delete Project Controller
export const deleteAssignedToPreProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const assignedTo = await AssignedPreSiteVisitPlan.findByPk(id);

        if (!assignedTo) {
            throw new ApiError(
                `assignedTo with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        await assignedTo.destroy();

        return res.status(200).json(ApiResponse.success(null, "Assigned deleted successfully"));
    }
);



export const updatePreProjectSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        // Validate project existence
        const project = await PreSiteVisitPlan.findByPk(id);
        if (!project) {
            throw new ApiError(
                `Project with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Validate the provided data using ProjectSchema
        const result = preSiteVisitPlanUpateSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "Invalid project data",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        // Extract valid fields from the request body
        const {

            projectName,

            ProjectAddress,
            clientName,

            clientNumber,
            visitDateTime,

        } = req.body;

        // Update the project fields
        project.projectName = projectName || project.projectName;
        project.ProjectAddress = ProjectAddress || project.ProjectAddress;
        project.clientName = clientName || project.clientName;
        project.clientNumber = clientNumber || project.clientNumber;
        project.visitDateTime = visitDateTime || project.visitDateTime;






        // Save the updated project to the database
        await project.save();

        return res
            .status(200)
            .json(ApiResponse.success(project, "Project updated successfully"));
    }
);





















export const createSupervisionSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const result = SupervisionSiteVisitPlanSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { projectName, projectId, projectAddress, clientContact, clientName, visitDateTime } = req.body;


        // Check if employee or not
        const existingProject = await Project.findOne({ where: { id: projectId } });
        if (!existingProject) {
            throw new ApiError(
                ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
                404,
                ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
            );
        }

        // Create the new project in the database
        const newProjectSiteVisitPlan = await SupervisionSiteVisitPlan.create({
            projectId,
            projectName,
            clientNumber: clientContact,
            clientName,
            visitDateTime,
            projectAddress: projectAddress,
        });

        if (!newProjectSiteVisitPlan) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newProjectSiteVisitPlan, "New Supervision Site VisitPlan created successfully")
        );
    });



    export const getSupervisionSiteVisitPlan = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { page = 1, limit = 10, search = "" } = req.query;
            const { projectId } = req.params;
    
            // Parse page and limit as integers
            const pageNumber = parseInt(page as string, 10);
            const pageSize = parseInt(limit as string, 10);
            const offset = (pageNumber - 1) * pageSize;
    
            // Fetch supervision site visit plans with pagination, search, and filtering by projectId
            const { rows: supervisionSiteVisitPlan, count: totalSupervisionSiteVisitPlan } = await SupervisionSiteVisitPlan.findAndCountAll({
                where: {
                    projectId, // Filter by projectId
                    ...(search && {
                        projectName: {
                            [Op.like]: `%${search}%`, // Case-sensitive search for MariaDB/MySQL
                        },
                    }),
                },
                include: [
                    {
                        model: AssignedSupervisionSiteVisitPlan,
                        as: "assigned", // Alias defined in the relationship
                    },
                ],
                limit: pageSize,
                offset: offset,
                order: [["createdAt", "DESC"]], // Sort by most recent
            });
    
            return res.status(200).json({
                success: true,
                data: {
                    supervisionSiteVisitPlan,
                    totalSupervisionSiteVisitPlan,
                    totalPages: Math.ceil(totalSupervisionSiteVisitPlan / pageSize),
                    currentPage: pageNumber,
                },
                message: "Supervision Site Visit Plan retrieved successfully",
            });
        }
    );
    

export const deleteSupervisionSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Check if the PreSiteVisitPlan exists
        const existingPlan = await SupervisionSiteVisitPlan.findByPk(id, {
            include: [
                {
                    model: AssignedSupervisionSiteVisitPlan,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
        });

        if (!existingPlan) {
            throw new ApiError(
                "Supervision Site Visit Plan not found",
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Delete all associated AssignedPreSiteVisitPlan records
        if (existingPlan.assigned && existingPlan.assigned.length > 0) {
            await AssignedSupervisionSiteVisitPlan.destroy({
                where: { supervisionSiteVisitPlanId: id }, // Assuming this is the foreign key in AssignedPreSiteVisitPlan
            });
        }

        // Delete the PreSiteVisitPlan
        await existingPlan.destroy();

        return res.status(200).json(
            ApiResponse.success(null, "Supervision Site Visit Plan and associated records deleted successfully")
        );
    }
);


export const viewSupervisionSiteVisitPlanById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Fetch the PreSiteVisitPlan by ID
        const preSiteVisitPlan = await SupervisionSiteVisitPlan.findByPk(id, {
            include: [
                {
                    model: AssignedSupervisionSiteVisitPlan,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
        });

        if (!preSiteVisitPlan) {
            throw new ApiError(
                "Supervision Site Visit Plan not found",
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        return res.status(200).json(
            ApiResponse.success(preSiteVisitPlan, "Supervision Site Visit Plan retrieved successfully")
        );
    }
);



// Create Project Controller
export const createSupervisionAssignedTo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = AssignedToSupervisionSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { eid, supervisionSiteVisitPlanId, eName } = req.body;

        // Create the new project in the database
        const newAssigned = await AssignedSupervisionSiteVisitPlan.create({
            eid,
            supervisionSiteVisitPlanId,
            eName,
        });

        if (!newAssigned) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newAssigned, "Assigned created successfully")
        );
    });

// Delete Project Controller
export const deleteAssignedToSupervision = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const assignedTo = await AssignedSupervisionSiteVisitPlan.findByPk(id);

        if (!assignedTo) {
            throw new ApiError(
                `assignedTo with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        await assignedTo.destroy();

        return res.status(200).json(ApiResponse.success(null, "Assigned deleted successfully"));
    }
);



export const updateSupervisionSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        console.log(req.body)
        // Validate project existence
        const project = await SupervisionSiteVisitPlan.findByPk(id);
        if (!project) {
            throw new ApiError(
                `Supervision with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Validate the provided data using ProjectSchema
        const result = SupervisionSiteVisitPlanUpateSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "Invalid project data",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        // Extract valid fields from the request body
        const {

            projectName,

            projectAddress,
            clientName,

            clientNumber,
            visitDateTime,

        } = req.body;

        // Update the project fields
        project.projectName = projectName || project.projectName;
        project.projectAddress = projectAddress || project.projectAddress;
        project.clientName = clientName || project.clientName;
        project.clientNumber = clientNumber || project.clientNumber;
        project.visitDateTime = visitDateTime || project.visitDateTime;






        // Save the updated project to the database
        await project.save();

        return res
            .status(200)
            .json(ApiResponse.success(project, "Project updated successfully"));
    }
);














export const createProjectSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const result = projectSiteVisitPlanSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { projectName, projectId, projectAddress, clientContact, clientName, visitDateTime } = req.body;


        // Check if employee or not
        const existingProject = await Project.findOne({ where: { id: projectId } });
        if (!existingProject) {
            throw new ApiError(
                ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
                404,
                ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
            );
        }

        // Create the new project in the database
        const newProjectSiteVisitPlan = await ProjectSiteVisitPlan.create({
            projectId,
            projectName,
            clientNumber: clientContact,
            clientName,
            visitDateTime,
            projectAddress: projectAddress,
        });

        if (!newProjectSiteVisitPlan) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newProjectSiteVisitPlan, "New Project Site VisitPlan created successfully")
        );
    });



    export const getProjectSiteVisitPlan = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { page = 1, limit = 10, search = "" } = req.query;
            const { projectId } = req.params;
    
            // Parse page and limit as integers
            const pageNumber = parseInt(page as string, 10);
            const pageSize = parseInt(limit as string, 10);
            const offset = (pageNumber - 1) * pageSize;
    
            // Fetch projects with pagination, search, and filtering by projectId
            const { rows: projectSiteVisitPlan, count: totalProjectSiteVisitPlan } = await ProjectSiteVisitPlan.findAndCountAll({
                where: {
                    projectId, // Filter by projectId
                    ...(search && {
                        projectName: {
                            [Op.like]: `%${search}%`, // Case-sensitive search for MariaDB/MySQL
                        },
                    }),
                },
                include: [
                    {
                        model: AssignedProjectSiteVisitPlan,
                        as: "assigned", // Alias defined in the relationship
                    },
                ],
                limit: pageSize,
                offset: offset,
                order: [["createdAt", "DESC"]], // Sort by most recent
            });
    
            return res.status(200).json({
                success: true,
                data: {
                    projectSiteVisitPlan,
                    totalProjectSiteVisitPlan,
                    totalPages: Math.ceil(totalProjectSiteVisitPlan / pageSize),
                    currentPage: pageNumber,
                },
                message: "Project Site Visit Plan retrieved successfully",
            });
        }
    );
    


export const deleteProjectSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Check if the PreSiteVisitPlan exists
        const existingPlan = await ProjectSiteVisitPlan.findByPk(id, {
            include: [
                {
                    model: AssignedProjectSiteVisitPlan,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
        });

        if (!existingPlan) {
            throw new ApiError(
                "Project Site Visit Plan not found",
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Delete all associated AssignedPreSiteVisitPlan records
        if (existingPlan.assigned && existingPlan.assigned.length > 0) {
            await AssignedProjectSiteVisitPlan.destroy({
                where: { projectSiteVisitPlanId: id }, // Assuming this is the foreign key in AssignedPreSiteVisitPlan
            });
        }

        // Delete the PreSiteVisitPlan
        await existingPlan.destroy();

        return res.status(200).json(
            ApiResponse.success(null, "Pre Site Visit Plan and associated records deleted successfully")
        );
    }
);


export const viewProjectSiteVisitPlanById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Fetch the PreSiteVisitPlan by ID
        const preSiteVisitPlan = await ProjectSiteVisitPlan.findByPk(id, {
            include: [
                {
                    model: AssignedProjectSiteVisitPlan,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
        });

        if (!preSiteVisitPlan) {
            throw new ApiError(
                "Pre Site Visit Plan not found",
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        return res.status(200).json(
            ApiResponse.success(preSiteVisitPlan, "Pre Site Visit Plan retrieved successfully")
        );
    }
);



// Create Project Controller
export const createProjectAssignedTo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = AssignedToProjectSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { eid, projectSiteVisitPlanId, eName } = req.body;

        // Create the new project in the database
        const newAssigned = await AssignedProjectSiteVisitPlan.create({
            eid,
            projectSiteVisitPlanId,
            eName,
        });

        if (!newAssigned) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newAssigned, "Assigned created successfully")
        );
    });

// Delete Project Controller
export const deleteAssignedToProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const assignedTo = await AssignedProjectSiteVisitPlan.findByPk(id);

        if (!assignedTo) {
            throw new ApiError(
                `assignedTo with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        await assignedTo.destroy();

        return res.status(200).json(ApiResponse.success(null, "Assigned deleted successfully"));
    }
);



export const updateProjectSiteVisitPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        console.log(req.body)
        // Validate project existence
        const project = await ProjectSiteVisitPlan.findByPk(id);
        if (!project) {
            throw new ApiError(
                `Project with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Validate the provided data using ProjectSchema
        const result = projectSiteVisitPlanUpateSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "Invalid project data",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        // Extract valid fields from the request body
        const {

            projectName,

            projectAddress,
            clientName,

            clientNumber,
            visitDateTime,

        } = req.body;

        // Update the project fields
        project.projectName = projectName || project.projectName;
        project.projectAddress = projectAddress || project.projectAddress;
        project.clientName = clientName || project.clientName;
        project.clientNumber = clientNumber || project.clientNumber;
        project.visitDateTime = visitDateTime || project.visitDateTime;






        // Save the updated project to the database
        await project.save();

        return res
            .status(200)
            .json(ApiResponse.success(project, "Project updated successfully"));
    }
);



















