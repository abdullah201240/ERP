import { Request, Response, NextFunction } from 'express';
import EmployeeRole from '../models/employeeRole';
import asyncHandler from '../utils/asyncHandler';
import { ApiError, ErrorCodes } from '../utils/root';

// Assign access to an employee
export const assignAccess = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employee_id, permission_id } = req.body;

        if (!employee_id || !permission_id) {
            return next(new ApiError('Missing required fields: employee_id or permission_id', 400, ErrorCodes.BAD_REQUEST.code));
        }

        const existingAccess = await EmployeeRole.findOne({ where: { employee_id, permission_id } });

        if (existingAccess) {
            return next(new ApiError('Employee already has access to this role', 409, ErrorCodes.CONFLICT.code));
        }

        const newAccess = await EmployeeRole.create({ employee_id, permission_id });

        return res.status(201).json({
            message: 'Access assigned successfully',
            data: newAccess,
        });
    }
);

// Revoke access from an employee
export const revokeAccess = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employee_id, permission_id } = req.body;

        if (!employee_id || !permission_id) {
            return next(new ApiError('Missing required fields: employee_id or permission_id', 400, ErrorCodes.BAD_REQUEST.code));
        }

        const access = await EmployeeRole.findOne({ where: { employee_id, permission_id } });

        if (!access) {
            return next(new ApiError('Access record not found', 404, ErrorCodes.NOT_FOUND.code));
        }

        await access.destroy();

        return res.status(200).json({
            message: 'Access revoked successfully',
        });
    }
);

// View all access records
export const viewAllAccess = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employee_id } = req.params;
        if (!employee_id) {
            return res.status(400).json({
                message: 'Employee ID is required',
            });
        }

        // Fetch access records
        const accessRecords = await EmployeeRole.findAll({
            where: { employee_id },
        });
      // If no records are found, respond with a 404
      if (!accessRecords.length) {
        return res.status(404).json({
          message: 'No access records found for this employee',
        });
      }


        // Return the access records
      return res.status(200).json({
        message: 'Access records fetched successfully',
        data: accessRecords,
      });
    }
);

// View access by employee_id and permission_id
export const viewAccessById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { employee_id, permission_id } = req.params;

        const access = await EmployeeRole.findOne({
            where: { employee_id, permission_id },
        });

        if (!access) {
            return next(new ApiError('Access record not found', 404, ErrorCodes.NOT_FOUND.code));
        }

        return res.status(200).json({
            message: 'Access record fetched successfully',
            data: access,
        });
    }
);
