import { CookieOptions, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Employee from "../models/employee";
import { asyncHandler, ApiError, ApiResponse, ErrorCodes } from "../utils/root";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET environment variable is required but not set.");
}

export const verifyJWT = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Extract token from cookies or Authorization header
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return next(
                new ApiError(
                    "Unauthorized request: No token provided",
                    401,
                    ErrorCodes.UNAUTHORIZED.code
                )
            );
        }

        try {
            // Verify the token and decode its payload
            const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;


            if (!payload || typeof payload.id !== "number") {
                return next(
                    new ApiError(
                        "Unauthorized request: Invalid token payload",
                        401,
                        ErrorCodes.UNAUTHORIZED.code
                    )
                );
            }

            // Check if the token has expired
            const currentTime = Math.floor(Date.now() / 1000); // current timestamp in seconds
            if (payload.exp && payload.exp < currentTime) {
                return next(
                    new ApiError(
                        "Unauthorized request: Token has expired",
                        401,
                        ErrorCodes.UNAUTHORIZED.code
                    )
                );
            }

            // Find the employee using the decoded ID
            const employee = await Employee.findOne({ where: { id: payload.id } });

            if (!employee) {
                return next(
                    new ApiError(
                        "Unauthorized request: Employee not found",
                        401,
                        ErrorCodes.UNAUTHORIZED.code
                    )
                );
            }

            // Attach the employee object to the request
            (req as Request & { employee: Employee }).employee = employee;

            // Proceed to the next middleware
            next();
        } catch (error) {
            console.error("Error during token verification:", error);
            return next(
                new ApiError(
                    "Invalid access token",
                    401,
                    ErrorCodes.UNAUTHORIZED.code
                )
            );
        }
    }
);
