import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import { employeeLoginValidator, employeeRegisterValidator } from "../validators/employeeValidators";
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";
import dotenv from 'dotenv';
import axios from "axios";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "LD9cv1kBfgRHVIg9GG_OGzh9TUkcyqgZAaM0o3DmVkx08MCFRSzMocyO3UtNdDNtoCJ0X0-5nLwK7fdO"; // Fallback to a hardcoded secret if not in env

dotenv.config();



export const loginEmployee = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!process.env.EXTERNAL_API_URL) {
      throw new Error("EXTERNAL_API_URL is not defined");
    }
    
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

    
    // Call the first API hosted on another server
    const response = await axios.post(
      `${process.env.EXTERNAL_API_URL}sisterConcern/others/auth/login`,
      { email, password }
    );
    
    if (response.status !== 200 || !response.data || !response.data.data) {
      throw new Error("Invalid response from external API");
    }
    // Extract employee data
    const employeeData = response.data.data;



    // Generate access token
    const accessToken = jwt.sign(
      { id: employeeData.id, email: employeeData.email, name: employeeData.name ,companyId: employeeData.companyId , sisterConcernId: employeeData.sisterConcernId , photo: employeeData.photo ,dob: employeeData.dob , gender: employeeData.gender,phone: employeeData.phone,employeeId: employeeData.employeeId },
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
    // Extract user from the request (added by verifyJWT middleware)
    const user = req as Request & { user: jwt.JwtPayload }; // Access 'user' set by verifyJWT

    if (!user) {
      return next(
        new ApiError(
          "User not found",
          404,
          ErrorCodes.NOT_FOUND.code
        )
      );
    }

    // Assuming the JWT payload contains all the required fields directly
    const { id, name, email, phone, dob, gender ,companyId , sisterConcernId ,photo,employeeId } = user.user; // Extract from the payload

    // Return the user profile details
    return res.status(200).json(
      ApiResponse.success(
        {
          id,
          name,
          email,
          phone,
          dob,
          gender,
          companyId,
          sisterConcernId,
          photo,
          employeeId
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












