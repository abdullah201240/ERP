import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import { employeeLoginValidator, employeeRegisterValidator } from "../validators/employeeValidators";
import Employee from "../models/employee";
import bcrypt from 'bcryptjs';
import ERROR_MESSAGES from '../utils/errors/errorMassage'
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";
import dotenv from 'dotenv';

import { getChannel } from '../utils/rabbitmq';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "LD9cv1kBfgRHVIg9GG_OGzh9TUkcyqgZAaM0o3DmVkx08MCFRSzMocyO3UtNdDNtoCJ0X0-5nLwK7fdO"; // Fallback to a hardcoded secret if not in env

dotenv.config();


export const createEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = employeeRegisterValidator.safeParse(req.body);

    if (!result.success) {
      // ZodError includes an array of issues, format them for a response
      const errors = result.error.errors.map((error) => error.message).join(", ");
      throw new ApiError(
        "All fields are required",
        400,
        ErrorCodes.BAD_REQUEST.code,
        errors
      );
    }

    const { name, email, password, phone, dob, gender } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !phone || !dob || !gender) {
      throw new ApiError(
        ERROR_MESSAGES.MISSING_FIELDS,
        400,
        ErrorCodes.BAD_REQUEST.code
      );
    }

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
      { id: employee.id, email: employee.email, name: employee.name },
      ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
    );



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
    // Parse page and limit as integers
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;

    // Fetch employees with pagination and search
    const { rows: employees, count: totalEmployees } = await Employee.findAndCountAll({
      where: search
        ? {
          name: {
            [Op.like]: `%${search}%`, // Case-sensitive search for MariaDB/MySQL
          },
        }
        : {},
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "ASC"]], // Sort by most recent
    });

    return res.status(200).json({
      success: true,
      data: {
        employees,  // Fixed this to 'employees' instead of 'projects'
        totalEmployees,  // Fixed this to 'totalEmployees' instead of 'totalProjects'
        totalPages: Math.ceil(totalEmployees / pageSize),  // Fixed this to use 'totalEmployees'
        currentPage: pageNumber,
      },
      message: "Employees retrieved successfully",  // Updated the message
    });
  }
);




// Function to process received employee data (from RabbitMQ)
export const processEmployeeData = async (data: string) => {
  try {
    const employee = JSON.parse(data); // Parse received data
    console.log("Received Employee Data:", employee);

    // Validate the employee data
    const result = employeeRegisterValidator.safeParse(employee);
    if (!result.success) {
      const errors = result.error.errors.map((error) => error.message).join(", ");
      throw new ApiError(
        "Validation failed",
        400,
        ErrorCodes.BAD_REQUEST.code,
        errors
      );
    }

    const { name, email, password, phone, dob, gender } = employee;

    // Check for missing fields
    if (!name || !email || !password || !phone || !dob || !gender) {
      throw new ApiError(
        ERROR_MESSAGES.MISSING_FIELDS,
        400,
        ErrorCodes.BAD_REQUEST.code
      );
    }

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
    });

    if (!newEmployee) {
      throw new ApiError(
        ERROR_MESSAGES.INTERNAL_ERROR,
        500,
        ErrorCodes.INTERNAL_SERVER_ERROR.code
      );
    }

    console.log("✅ Employee created successfully:", newEmployee.toJSON());
  } catch (error) {
    console.error("❌ Error processing employee data:", error);
    // You may want to rethrow the error or handle it differently
    throw new ApiError(
      ERROR_MESSAGES.INTERNAL_ERROR,
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR.code,
      
    );
  }
};

// Express handler for processing employee data (with req and res)
export const processEmployeeHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body.data; // Assuming the data is in the body under 'data'
      if (!data) {
        throw new ApiError("No data provided", 400, ErrorCodes.BAD_REQUEST.code);
      }

      await processEmployeeData(data); // Process the employee data
      res.status(200).json({ message: "Employee data processed successfully" });
    } catch (error) {
      next(error); // Pass error to the next middleware
    }
  }
);

// Function to start the consumer (for RabbitMQ)
export const startConsumer = () => {
  const channel = getChannel();
  const queue = 'employee_created';
  channel.assertQueue(queue, { durable: false });

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.consume(queue, async (msg) => {
    if (msg) {
      const messageContent = msg.content.toString();
      try {
        await processEmployeeData(messageContent); // Await the processing of the data
      } catch (error) {
        console.error("Error processing message:", error);
      }
      channel.ack(msg); // Acknowledge message (removes from queue)
    }
  });
};

