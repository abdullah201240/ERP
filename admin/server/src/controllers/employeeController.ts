import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import { employeeLoginValidator } from "../validators/employeeValidators";
import Employee from "../models/employee";
import bcrypt from 'bcryptjs';
import ERROR_MESSAGES from '../utils/errors/errorMassage'
import jwt, { SignOptions } from 'jsonwebtoken';
import { Op } from "sequelize";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "LD9cv1kBfgRHVIg9GG_OGzh9TUkcyqgZAaM0o3DmVkx08MCFRSzMocyO3UtNdDNtoCJ0X0-5nLwK7fdO"; // Fallback to a hardcoded secret if not in env
if (!ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
}


export const createEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {


    const { name, email, password, phone, employeeId, dob, gender } = req.body;
    const companyId = parseInt(req.body.companyId, 10);
    const sisterConcernId = parseInt(req.body.sisterConcernId, 10);
    // Check for missing fields
    if (!name || !email || !password || !phone || !dob || !gender) {
      throw new ApiError(
        ERROR_MESSAGES.MISSING_FIELDS,
        400,
        ErrorCodes.BAD_REQUEST.code
      );
    }
    // Handle file upload for logo
    if (!req.file) {
      return next(new ApiError("Photo file is required", 400, ErrorCodes.BAD_REQUEST.code));
    }
    const photo = req.file.filename;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      throw new ApiError(
        ERROR_MESSAGES.EMPLOYEE_EXISTS,
        409,
        ErrorCodes.CONFLICT?.code || "CONFLICT"
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new employee in the database
    const newEmployee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      phone,
      dob,
      gender,
      companyId,
      employeeId,
      sisterConcernId,
      photo
    });




    if (!newEmployee) {
      throw new ApiError(
        ERROR_MESSAGES.INTERNAL_ERROR,
        500,
        ErrorCodes.INTERNAL_SERVER_ERROR.code
      );
    }



    // Exclude the password from the response
    const { password: _, ...employeeResponse } = newEmployee.toJSON();

    return res
      .status(201)
      .json({ message: "Employee created successfully", employee: employeeResponse });
  }
);

export const loginEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate request body with Zod
    const validationResult = employeeLoginValidator.safeParse(req.body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map((err) => err.message);
      return next(
        new ApiError(
          "Validation Error",
          400,
          ErrorCodes.VALIDATION_ERROR.code,
          errorMessages.join(", ")
        )
      );
    }

    const { email, password } = validationResult.data;

    // Find employee by email
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return next(
        new ApiError(
          "Employee does not exist",
          404,
          ErrorCodes.NOT_FOUND.code
        )
      );
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return next(
        new ApiError(
          "Invalid email or password",
          401,
          ErrorCodes.UNAUTHORIZED.code
        )
      );
    }

    // Generate access token
    const accessToken = jwt.sign(
      { id: employee.id, email: employee.email, name: employee.name }, // Payload
      ACCESS_TOKEN_SECRET, // Secret key
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" } as SignOptions // Explicitly cast as SignOptions
    );
    console.log('Access Token:', accessToken);



    // Set the access token in a secure, HTTP-only cookie
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "strict" as "strict", // CSRF protection
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    };
    res.cookie("accessToken", accessToken, cookieOptions);


    return res.status(200).json(
      ApiResponse.success(
        { accessToken },
        "Employee logged in successfully"
      )
    );
  }
);

export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract employee from the request (added by verifyJWT middleware)
    const employee = req as Request & { employee: Employee }; // Manually cast the request type


    if (!employee) {
      return next(
        new ApiError(
          "Employee not found",
          404,
          ErrorCodes.NOT_FOUND.code
        )
      );
    }
    const { id, name, email, phone, dob, gender } = employee.employee.dataValues; // Extract only required fields


    // Return the employee details
    return res.status(200).json(
      ApiResponse.success(
        {
          id,
          name,
          email,
          phone,
          dob,
          gender
        },
        "Profile retrieved successfully"
      )
    );
  }
);

export const logoutEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Clear the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "strict" as "strict", // CSRF protection
      maxAge: 0, // Expire cookie immediately
    });

    // Return a success response
    return res.status(200).json(
      ApiResponse.success(
        null,
        "Employee logged out successfully"
      )
    );
  }
);




export const getAllEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const { id } = req.params; // Get sisterConcernId from params

    // Parse page and limit as integers
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;

    // Fetch employees with pagination, search, and filtering by sisterConcernId
    const { rows: employees, count: totalEmployees } = await Employee.findAndCountAll({
      where: {
        sisterConcernId: id, // Filter by sisterConcernId
        ...(search && {
          name: {
            [Op.like]: `%${search}%`, // Case-insensitive search
          },
        }),
      },
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "ASC"]], // Sort by most recent
    });

    return res.status(200).json({
      success: true,
      data: {
        employees,
        totalEmployees,
        totalPages: Math.ceil(totalEmployees / pageSize),
        currentPage: pageNumber,
      },
      message: "Employees retrieved successfully",
    });
  }
);



export const updateEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Employee ID from URL params
    const { name, email, phone, dob, gender, companyId, sisterConcernId } = req.body;

    // Convert companyId and sisterConcernId to integers if provided
    const updatedCompanyId = companyId ? parseInt(companyId, 10) : undefined;
    const updatedSisterConcernId = sisterConcernId ? parseInt(sisterConcernId, 10) : undefined;

    // Find the employee by ID
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return next(new ApiError("Employee not found", 404, ErrorCodes.NOT_FOUND.code));
    }

    // Check if the email is being updated and ensure it's not taken by another employee
    if (email && email !== employee.email) {
      const existingEmployee = await Employee.findOne({ where: { email } });
      if (existingEmployee) {
        return next(new ApiError("Email already in use", 409, ErrorCodes.CONFLICT.code));
      }
    }

    // Handle file upload if a new photo is provided
    let photo = employee.photo;
    if (req.file) {
      photo = req.file.filename; // Update photo filename
    }

    // Update employee information
    await employee.update({
      name: name || employee.name,
      email: email || employee.email,
      phone: phone || employee.phone,
      dob: dob || employee.dob,
      gender: gender || employee.gender,
      companyId: updatedCompanyId ?? employee.companyId,
      sisterConcernId: updatedSisterConcernId ?? employee.sisterConcernId,
      photo,
    });

    return res.status(200).json({
      message: "Employee updated successfully",
      employee: employee.toJSON(),
    });
  }
);

export const deleteEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // Employee ID from URL params

    // Find the employee by ID
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return next(new ApiError("Employee not found", 404, ErrorCodes.NOT_FOUND.code));
    }

    // Delete the employee from the database
    await employee.destroy();

    return res.status(200).json({
      message: "Employee deleted successfully",
    });
  }
);
