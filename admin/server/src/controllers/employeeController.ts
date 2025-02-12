import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import { employeeLoginValidator } from "../validators/employeeValidators";
import Employee from "../models/employee";
import bcrypt from 'bcryptjs';
import ERROR_MESSAGES from '../utils/errors/errorMassage'
import jwt, { SignOptions } from 'jsonwebtoken';
import { Op } from "sequelize";
import redisClient from "../config/redisClient";




// Helper function to remove product-related caches
const clearEmployeeCache = async () => {
  try {
    let cursor = 0; // Cursor must be a number, not a string
    let totalKeysDeleted = 0;

    do {
      // Use SCAN to find all keys matching the pattern "employees:*"
      const reply = await redisClient.scan(cursor, {
        MATCH: 'employees:*',
        COUNT: 100,
      });

      // Update the cursor for the next iteration
      cursor = reply.cursor;

      // Delete all matching keys
      const keys = reply.keys;
      if (keys.length > 0) {
        await redisClient.del(keys);
        totalKeysDeleted += keys.length;
        console.log(`Deleted ${keys.length} cache keys:`, keys);
      }
    } while (cursor !== 0); // Continue until the cursor returns to 0

    console.log(`Total employee-related cache keys cleared: ${totalKeysDeleted}`);
  } catch (error) {
    console.error("Failed to clear employee cache:", error);
  }
};

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

    try {
      // Attempt to clear the cache
      await clearEmployeeCache();
      console.log("Cache cleared successfully"); // Log success
      return res.status(201).json({ 
        message: "Employee created successfully", 
        employee: employeeResponse,
        cacheMessage: "Cache cleared successfully" // Indicate cache was cleared
      });
    } catch (error) {
      console.error("Failed to clear cache:", error); // Log the error
      return res.status(201).json({ 
        message: "Employee created successfully", 
        employee: employeeResponse,
        cacheMessage: "Cache not cleared" // Indicate cache was not cleared
      });
    }
    
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
    const { page = 1, limit = 10, search } = req.query;
    const { id } = req.params; // Get sisterConcernId from params

    // Parse page and limit as integers
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;

    // Ensure search is a string and handle null or undefined
    const searchQuery = search ? String(search).trim() : "";

    // Generate a unique cache key based on query parameters and sisterConcernId
    const cacheKey = `employees:${id}:page=${pageNumber}:limit=${pageSize}:search=${searchQuery || "all"}`;

    // Try to fetch the data from Redis first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Retrieving data from cache");
      return res.status(200).json(JSON.parse(cachedData));
    } else {
      console.log("MISS data from cache");
    }

    // Define where condition
    const whereCondition: any = { sisterConcernId: id };

    // Apply search filter if it's not empty
    if (searchQuery) {
      whereCondition.name = { [Op.like]: `%${searchQuery}%` }; // Case-insensitive search
    }

    // Fetch data from the database
    const { rows: employees, count: totalEmployees } = await Employee.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });

    // Prepare response
    const response = {
      success: true,
      data: {
        employees,
        totalEmployees,
        totalPages: Math.ceil(totalEmployees / pageSize),
        currentPage: pageNumber,
      },
      message: "Employees retrieved successfully",
    };

    // Store the data in Redis, set an expiration time as needed
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // Expires in 1 hour

    return res.status(200).json(response);
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
    // Clear cached product list
    await clearEmployeeCache();
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
    // Clear cached product list
    await clearEmployeeCache();
    return res.status(200).json({
      message: "Employee deleted successfully",
    });
  }
);


export const loginEmployeeOthersPlatform = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
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

    // If all is okay, return employee data (excluding password)
    const { password: _, ...employeeData } = employee.toJSON();

    return res.status(200).json({
      message: "Employee logged in successfully",
      data: employeeData
    });

  }
);

export const getEmployeeByEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params; // Extract email from URL params

    // Validate email (basic check)
    if (!email || !email.includes("@")) {
      return next(
        new ApiError(
          "Invalid email address",
          400,
          ErrorCodes.BAD_REQUEST.code
        )
      );
    }

    // Generate a unique cache key using the email
    const cacheKey = `employees:email:${email}`;

    // Try to fetch the data from Redis first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Retrieving data from cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from database
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return next(
        new ApiError(
          "Employee not found",
          404,
          ErrorCodes.NOT_FOUND.code
        )
      );
    }

    // Exclude the password from the response
    const { password: _, ...employeeData } = employee.toJSON();

    // Store the data in Redis, set an expiration time as needed
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(employeeData)); // Expires in 1 hour

    return res.status(200).json(
      ApiResponse.success(
        employeeData,
        "Employee retrieved successfully"
      )
    );
  }
);


export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError("Invalid id", 400, ErrorCodes.BAD_REQUEST.code));
    }

    // Try to fetch the data from Redis first
    const cacheKey = `employees:${id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Retrieving data from cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from database
    const employee = await Employee.findOne({ where: { id } });
    if (!employee) {
      return next(new ApiError("Employee not found", 404, ErrorCodes.NOT_FOUND.code));
    }

    // Exclude the password from the response
    const { password: _, ...employeeData } = employee.toJSON();

    // Store the data in Redis, set an expiration time as needed
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(employeeData)); // Expires in 1 hour

    return res.status(200).json(
      ApiResponse.success(
        employeeData,
        "Employee retrieved successfully"
      )
    );
  }
);




export const getEmployees = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { employeeIds } = req.body;

    if (!employeeIds || !Array.isArray(employeeIds)) {
      return res.status(400).json({ success: false, message: "Invalid employeeIds format" });
    }

    const employees = [];
    const missingIds = [];

    // Check cache for each employee ID
    for (const id of employeeIds) {
      const cacheKey = `employees:${id}`;
      const cachedEmployee = await redisClient.get(cacheKey);
      if (cachedEmployee) {
        employees.push(JSON.parse(cachedEmployee));
      } else {
        missingIds.push(id);
      }
    }

    // Fetch missing employees from the database
    if (missingIds.length > 0) {
      const fetchedEmployees = await Employee.findAll({
        where: { id: missingIds },
      });

      // Cache newly fetched employees and add them to the response array
      for (const employee of fetchedEmployees) {
        const { password: _, ...employeeData } = employee.toJSON();
        const cacheKey = `employees:${employee.id}`;
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(employeeData)); // Expires in 1 hour
        employees.push(employeeData);
      }
    }

    return res.status(200).json({ success: true, employees });
  }
);