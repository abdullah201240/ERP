import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import { AssignedToSchema, DesignPlanUpdateValidator, DesignPlanValidator, ProjectSchema } from "../validators/projectValidators";
import ERROR_MESSAGES from "../utils/errors/errorMassage";
import Project from "../models/project";
import Employee from "../models/employee";

import '../models/association';
import Assigned from "../models/assigned";
import { Op } from "sequelize";
import DesignPlan from "../models/designPlan";
import Service from "../models/service";
import DegineBOQ from "../models/degineBOQ";


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
        const search = req.query.search as string || '';


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
            order: [["createdAt", "DESC"]],
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

export const getProjectAll = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        

        // Fetch projects with pagination
        const projects = await Project.findAll({
            include: [
                {
                    model: Assigned,
                    as: "assigned", // Alias defined in the relationship
                },
            ],
            
        });

        return res.status(200).json({
            success: true,
            data: {
                projects: projects,
            },
            message: "Projects retrieved successfully",
        });
    }
);

export const getProjectsPaginated = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, search = "" } = req.query;

        // Parse page and limit as integers
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;

        // Fetch projects with pagination and search
        const { rows: projects, count: totalProjects } = await Project.findAndCountAll({
            where: search
                ? {
                      projectName: {
                          [Op.like]: `%${search}%`, // Case-sensitive search for MariaDB/MySQL
                      },
                  }
                : {},
            include: [
                {
                    model: Assigned,
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
                projects,
                totalProjects,
                totalPages: Math.ceil(totalProjects / pageSize),
                currentPage: pageNumber,
            },
            message: "Projects retrieved successfully",
        });
    }
);





// Create Project Controller
export const createDesignPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = DesignPlanValidator.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "All fields are required",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        const { projectId, assignee, stepName, stepType, startDate, endDate, remarks } = req.body;


        // Check if employee or not
        const existingEmployee = await Employee.findOne({ where: { id: assignee } });
        if (!existingEmployee) {
            throw new ApiError(
                ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
                404,
                ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
            );
        }
        // Check if project or not
        const existingProject = await Project.findOne({ where: { id: projectId } });
        if (!existingProject) {
            throw new ApiError(
                ERROR_MESSAGES.PROJECT_NOT_FOUND,
                404,
                ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
            );
        }

        // Create the new project in the database
        const newDesignPlan = await DesignPlan.create({
            projectId,
            assignee,
            stepName,
            stepType,
            startDate,
            endDate,
            remarks,
        });

        if (!newDesignPlan) {
            throw new ApiError(
                "Internal error occurred",
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }
        return res.status(201).json(
            ApiResponse.success(newDesignPlan, "DesignPlan created successfully")
        );
    });

    export const getDesignPlans = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { projectId, stepType } = req.query as { projectId: string; stepType: string };
    
            // Check if the project exists
            const existingProject = await Project.findOne({ where: { id: projectId } });
            if (!existingProject) {
                return next(
                    new ApiError(
                        ERROR_MESSAGES.PROJECT_NOT_FOUND,
                        404,
                        ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
                    )
                );
            }
    
            const designPlans = await DesignPlan.findAll({
                where: { stepType, projectId },
                include: [
                    {
                        model: Project,
                        as: 'project', // Use the alias specified in the association
                        attributes: ['projectName'], // Include only the project name
                    },
                    {
                        model: Employee,
                        as: 'employee', // Use the alias specified in the association
                        attributes: ['name'], // Include only the employee name
                    },
                ],
            });
            
    
            // Respond with the fetched design plans
            return res
                .status(200)
                .json(
                    ApiResponse.success(
                        designPlans,
                        `${stepType} Design Plans fetched successfully`
                    )
                );
        }
    );
    

    // Delete Design Plan
export const deleteDesignPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Check if the design plan exists
        const existingDesignPlan = await DesignPlan.findOne({ where: { id } });
        if (!existingDesignPlan) {
            return next(
                new ApiError(
                    ERROR_MESSAGES.DESIGN_PLAN_NOT_FOUND,
                    404,
                    ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
                )
            );
        }

        // Delete the design plan
        await existingDesignPlan.destroy();

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    null,
                    "Design Plan deleted successfully"
                )
            );
    }
);

// Update Design Plan
export const updateDesignPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        

        // Validate the request body
        const result = DesignPlanUpdateValidator.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((error) => error.message).join(", ");
            throw new ApiError(
                "Invalid input data",
                400,
                ErrorCodes.BAD_REQUEST.code,
                errors
            );
        }

        // Check if the design plan exists
        const existingDesignPlan = await DesignPlan.findOne({ where: { id } });
        if (!existingDesignPlan) {
            return next(
                new ApiError(
                    ERROR_MESSAGES.DESIGN_PLAN_NOT_FOUND,
                    404,
                    ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
                )
            );
        }

        // Update the design plan
        const updatedData = req.body;
        await existingDesignPlan.update(updatedData);

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    existingDesignPlan,
                    "Design Plan updated successfully"
                )
            );
    }
);

// Update Completion Percentage API
export const updateCompletionPercentage = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { completed } = req.body;

        // Validate the "completed" percentage
        if (typeof completed !== 'string' || !/^\d+$/.test(completed) || parseInt(completed) < 0 || parseInt(completed) > 100) {
            return next(
                new ApiError(
                    "Invalid percentage value. It should be between 0 and 100.",
                    400,
                    ErrorCodes.BAD_REQUEST.code
                )
            );
        }

        // Check if the design plan exists
        const existingDesignPlan = await DesignPlan.findOne({ where: { id } });
        if (!existingDesignPlan) {
            return next(
                new ApiError(
                    ERROR_MESSAGES.DESIGN_PLAN_NOT_FOUND,
                    404,
                    ErrorCodes.NOT_FOUND?.code || "NOT_FOUND"
                )
            );
        }

        // Update the completion percentage
        await existingDesignPlan.update({ completed });

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    existingDesignPlan,
                    "Design Plan completion percentage updated successfully"
                )
            );
    }
);


// Create a new service
export const createService = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, description } = req.body;

        if (!name || !description) {
            throw new ApiError('Name and description are required', 400, ErrorCodes.BAD_REQUEST.code);
        }

        const service = await Service.create({ name, description });

        return res.status(201).json(
            ApiResponse.success(service, 'Service created successfully')
        );
    }
);

// Get all services
export const viewAllServices = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const services = await Service.findAll();

        return res.status(200).json(
            ApiResponse.success(services, 'Services retrieved successfully')
        );
    }
);

// Get a service by ID
export const viewServiceById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const service = await Service.findByPk(id);

        if (!service) {
            throw new ApiError(
                `Service with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        return res.status(200).json(
            ApiResponse.success(service, 'Service retrieved successfully')
        );
    }
);

// Update a service by ID
export const updateService = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name, description } = req.body;

        const service = await Service.findByPk(id);

        if (!service) {
            throw new ApiError(
                `Service with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        // Update fields
        service.name = name || service.name;
        service.description = description || service.description;

        await service.save();

        return res.status(200).json(
            ApiResponse.success(service, 'Service updated successfully')
        );
    }
);

// Delete a service by ID
export const deleteService = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const service = await Service.findByPk(id);

        if (!service) {
            throw new ApiError(
                `Service with ID ${id} not found`,
                404,
                ErrorCodes.NOT_FOUND.code
            );
        }

        await service.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'Service deleted successfully')
        );
    }
);


export const createDegineBOQ = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {projectId, projectName, clientName, clientContact, projectAddress, totalArea, inputPerSftFees, totalFees, termsCondition,signName, designation } = req.body;

        if (!projectId || !projectName || !clientName || !clientContact || !projectAddress || !totalArea || !inputPerSftFees || !totalFees || !termsCondition || !designation || !signName) {
            throw new ApiError('All fields are required', 400, 'BAD_REQUEST');
        }

        const degineBOQ = await DegineBOQ.create({
            projectId,
            projectName,
            clientName,
            clientContact,
            projectAddress,
            totalArea,
            inputPerSftFees,
            totalFees,
            termsCondition,
            signName,
            designation
        });

        return res.status(201).json(
            ApiResponse.success(degineBOQ, 'DegineBOQ created successfully')
        );
    }
);

export const viewAllDegineBOQs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const degineBOQs = await DegineBOQ.findAll();

        return res.status(200).json(
            ApiResponse.success(degineBOQs, 'DegineBOQs retrieved successfully')
        );
    }
);

export const viewDegineBOQById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const degineBOQ = await DegineBOQ.findByPk(id);

        if (!degineBOQ) {
            throw new ApiError('DegineBOQ not found', 404, 'NOT_FOUND');
        }

        return res.status(200).json(
            ApiResponse.success(degineBOQ, 'DegineBOQ retrieved successfully')
        );
    }
);
export const updateDegineBOQById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { signName, designation,  inputPerSftFees, totalFees, termsCondition } = req.body;

        const degineBOQ = await DegineBOQ.findByPk(id);

        if (!degineBOQ) {
            throw new ApiError('DegineBOQ not found', 404, 'NOT_FOUND');
        }

        // Update fields
        degineBOQ.inputPerSftFees = inputPerSftFees || degineBOQ.inputPerSftFees;
        degineBOQ.totalFees = totalFees || degineBOQ.totalFees;
        degineBOQ.termsCondition = termsCondition || degineBOQ.termsCondition;
        degineBOQ.signName = signName || degineBOQ.signName;

        degineBOQ.designation = designation || degineBOQ.designation;

        
        

        await degineBOQ.save();

        return res.status(200).json(
            ApiResponse.success(degineBOQ, 'DegineBOQ updated successfully')
        );
    }
);
export const deleteDegineBOQById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const degineBOQ = await DegineBOQ.findByPk(id);

        if (!degineBOQ) {
            throw new ApiError('DegineBOQ not found', 404, 'NOT_FOUND');
        }

        await degineBOQ.destroy();

        return res.status(200).json(
            ApiResponse.success(null, 'DegineBOQ deleted successfully')
        );
    }
);


