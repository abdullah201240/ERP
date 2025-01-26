import { NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import ERROR_MESSAGES from "../utils/errors/errorMassage";

import '../models/association';
import { preSiteVisitPlanSchema } from "../validators/siteVisitValidators";
import { PreSiteVisitPlan, Project } from "../models/association";


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

        const { projectName, projectId, projectAddress, clientContact,clientName, visitDateTime} = req.body;


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
            clientNumber:clientContact,
            clientName,
            visitDateTime,
            ProjectAddress:projectAddress,
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