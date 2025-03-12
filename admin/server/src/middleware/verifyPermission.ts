import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import EmployeeRole from "../models/employeeRole";
import { ApiError, ErrorCodes } from "../utils/root";
import Employee from "../models/employee";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET environment variable is required but not set.");
}

const verifyPermission = (requiredPermission: number) => {
    return async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
      try {
        const token =
          req.cookies?.accessToken ||
          req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
          return next(
            new ApiError(
              "Access Denied",
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
  
        // Check if the employee has access to the server
        const employeeAccess = await EmployeeRole.findOne({
          where: { employee_id: employee.id ,permission_id:requiredPermission},
        });
  
        if (!employeeAccess) {
          return res.status(403).json({ message: "Access Denied: No access to this server" });
        }
  
        
  
  
        next();
      } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
      }
    };
  };
  

export default verifyPermission;
