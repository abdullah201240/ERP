import { Request, Response, NextFunction } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ApiError, ErrorCodes } from "../utils/root";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET environment variable is required but not set.");
}

// Extend the Express Request type
interface CustomRequest extends Request {
  apiData?: any; // Define the new property, adjust the type as necessary
}

const verifyAllPermission = () => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!process.env.EXTERNAL_API_URL) {
        throw new Error("EXTERNAL_API_URL is not defined");
      }
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
      // Call the first API hosted on another server
      const response = await axios.get(
        `${process.env.EXTERNAL_API_URL}access/view-all/${payload.id}`
      );

      if (response.status !== 200) {
        throw new Error("Invalid response from external API");
      }
      // Store the response data in the request object
      req.apiData = response.data.data;
      console.log(req.apiData)

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

export default verifyAllPermission;