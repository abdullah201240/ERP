import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import { AssignedToSchema, ProjectSchema } from "../validators/projectValidators";
import ERROR_MESSAGES from "../utils/errors/errorMassage";
import Project from "../models/project";
import Employee from "../models/employee";

import '../models/association';
import Assigned from "../models/assigned";


// Create Project Controller
export const createProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = ProjectSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { projectType, projectName, totalArea, projectAddress, clientName, clientAddress, clientContact, clientEmail, creatorName, creatorEmail, requirementDetails } = req.body;


        // Check if employee or not
        const existingEmployee = await Employee.findOne({ where: { email: creatorEmail } });
        if (!existingEmployee) {
            throw new ApiError(
                ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
                404,
                ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
            );
        }

        // Create the new project in the database
        const newProject = await Project.create({
            projectType,
            projectName,
            totalArea,
            projectAddress,
            clientName,
            clientAddress,
            clientContact,
            clientEmail,
            creatorName,
            creatorEmail,
            requirementDetails,
        });

        if (!newProject) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newProject, "Project created successfully")
        );
    });
// View Project 
export const getProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Get the page and limit from query parameters, default to page 1 and limit 10
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Calculate the offset for pagination
        const offset = (page - 1) * limit;

        // Fetch projects with pagination
        const projects = await Project.findAll({
            include: [
                {
                    model: Assigned,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
            limit: limit, // Limit to 10 records per page
            offset: offset, // Apply offset for pagination
        });

        // Get the total number of projects to calculate the total pages
        const totalProjects = await Project.count();

        return res.status(200).json({
            success: true,
            data: {
                projects: projects,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalProjects / limit),
                    totalProjects: totalProjects,
                },
            },
            message: "Projects retrieved successfully",
        });
    }
);


// View Project by ID Controller
export const getProjectById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;


        // Fetch the project by ID with its assigned data
        const project = await Project.findByPk(id, {
            include: [
                {
                    model: Assigned,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
        });

        if (!project) {
            throw new ApiError(
                `Project with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        return res
            .status(200)
            .json(ApiResponse.success(project, "Project retrieved successfully"));

    }
);
// Delete Project Controller
export const deleteProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const project = await Project.findByPk(id);

        if (!project) {
            throw new ApiError(
                `Project with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        await project.destroy();

        return res.status(200).json(ApiResponse.success(null, "Project deleted successfully"));
    }
);



// Update Project Controller
export const updateProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Validate project existence
        const project = await Project.findByPk(id);
        if (!project) {
            throw new ApiError(
                `Project with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Validate the provided data using ProjectSchema
        const result = ProjectSchema.safeParse(req.body);
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
            projectType,
            projectName,
            totalArea,
            projectAddress,
            clientName,
            clientAddress,
            clientContact,
            clientEmail,
            creatorName,
            creatorEmail,
            requirementDetails,
            supervisorName,
            supervisorEmail, // Add optional fields
            startDate,
            endDate,
            projectDeadline,
            estimatedBudget,
        } = req.body;

        // Update the project fields
        project.projectType = projectType || project.projectType;
        project.projectName = projectName || project.projectName;
        project.totalArea = totalArea || project.totalArea;
        project.projectAddress = projectAddress || project.projectAddress;
        project.clientName = clientName || project.clientName;
        project.clientAddress = clientAddress || project.clientAddress;
        project.clientContact = clientContact || project.clientContact;
        project.clientEmail = clientEmail || project.clientEmail;
        project.creatorName = creatorName || project.creatorName;
        project.creatorEmail = creatorEmail || project.creatorEmail;
        project.requirementDetails = requirementDetails || project.requirementDetails;
        project.supervisorName = supervisorName || project.supervisorName;
        project.supervisorEmail = supervisorEmail || project.supervisorEmail;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;
        project.projectDeadline = projectDeadline || project.projectDeadline;
        project.estimatedBudget = estimatedBudget || project.estimatedBudget;


        
        

        // Save the updated project to the database
        await project.save();

        return res
            .status(200)
            .json(ApiResponse.success(project, "Project updated successfully"));
    }
);



// Create Project Controller
export const createAssignedTo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = AssignedToSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { eid, pid, eName } = req.body;

        // Create the new project in the database
        const newAssigned = await Assigned.create({
            eid,
            pid,
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
export const deleteAssignedTo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const assignedTo = await Assigned.findByPk(id);

        if (!assignedTo) {
            throw new ApiError(
                `assignedTo with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        await assignedTo.destroy();

        return res.status(200).json(ApiResponse.success(null, "Project deleted successfully"));
    }
);