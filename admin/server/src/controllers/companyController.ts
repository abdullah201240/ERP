import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler, ApiError, ApiResponse } from "../utils/root";
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import bcrypt from 'bcryptjs';
import ERROR_MESSAGES from '../utils/errors/errorMassage'
import jwt, { SignOptions } from 'jsonwebtoken';
import { Op } from "sequelize";
import { companyLoginValidator, companyRegisterValidator } from "../validators/companyValidators";
import Company from "../models/company";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "LD9cv1kBfgRHVIg9GG_OGzh9TUkcyqgZAaM0o3DmVkx08MCFRSzMocyO3UtNdDNtoCJ0X0-5nLwK7fdO"; // Fallback to a hardcoded secret if not in env
if (!ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
}


export const createCompany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = companyRegisterValidator.safeParse(req.body);

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

        const { name, email, password, phone } = req.body;

        // Check for missing fields
        if (!name || !email || !password || !phone) {
            throw new ApiError(
                ERROR_MESSAGES.MISSING_FIELDS,
                400,
                ErrorCodes.BAD_REQUEST.code
            );
        }
        // Handle file upload for logo
        const file = req.file;
        if (!file) {
            throw new ApiError("Logo file is required", 400, ErrorCodes.BAD_REQUEST.code);
        }
        const logo = file.filename;

        // Check if Company already exists
        const existingCompany = await Company.findOne({ where: { email } });
        if (existingCompany) {
            throw new ApiError(
                ERROR_MESSAGES.EMPLOYEE_EXISTS,
                409,
                ErrorCodes.CONFLICT?.code || "CONFLICT"
            );
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new Company in the database
        const newCompany = await Company.create({
            name,
            email,
            password: hashedPassword,
            phone,
            logo,
        });




        if (!newCompany) {
            throw new ApiError(
                ERROR_MESSAGES.INTERNAL_ERROR,
                500,
                ErrorCodes.INTERNAL_SERVER_ERROR.code
            );
        }

        // Exclude the password from the response
        const { password: _, ...CompanyResponse } = newCompany.toJSON();

        return res
            .status(201)
            .json({ message: "Company created successfully", company: CompanyResponse });
    }
);

export const loginCompany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // Validate request body with Zod
        const validationResult = companyLoginValidator.safeParse(req.body);

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

        // Find Company by email
        const company = await Company.findOne({ where: { email } });
        if (!company) {
            return next(
                new ApiError(
                    "company does not exist",
                    404,
                    ErrorCodes.NOT_FOUND.code
                )
            );
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, company.password);
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
            { id: company.id, email: company.email, name: company.name }, // Payload
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
        const company = req as Request & { company: Company }; // Manually cast the request type


        if (!company) {
            return next(
                new ApiError(
                    "company not found",
                    404,
                    ErrorCodes.NOT_FOUND.code
                )
            );
        }
        const { id, name, email, phone , logo } = company.company.dataValues; // Extract only required fields


        // Return the employee details
        return res.status(200).json(
            ApiResponse.success(
                {
                    id,
                    name,
                    email,
                    phone,
                    logo
                },
                "Profile retrieved successfully"
            )
        );
    }
);

export const logoutCompany = asyncHandler(
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
                "company logged out successfully"
            )
        );
    }
);




export const getAllCompany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { page = 1, limit = 10, search = "" } = req.query;
        // Parse page and limit as integers
        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const offset = (pageNumber - 1) * pageSize;

        // Fetch Company with pagination and search
        const { rows: company, count: totalCompany } = await Company.findAndCountAll({
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
                company,  // Fixed this to 'employees' instead of 'projects'
                totalCompany,  // Fixed this to 'totalEmployees' instead of 'totalProjects'
                totalPages: Math.ceil(totalCompany / pageSize),  // Fixed this to use 'totalEmployees'
                currentPage: pageNumber,
            },
            message: "company retrieved successfully",  // Updated the message
        });
    }
);


export const updateCompany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const file = req.file;
        
        // Find company by ID
        const company = await Company.findByPk(id);
        if (!company) {
            return next(
                new ApiError(
                    "Company not found",
                    404,
                    ErrorCodes.NOT_FOUND.code
                )
            );
        }
        
        // Update fields if provided
        if (name) company.name = name;
        if (email) company.email = email;
        if (phone) company.phone = phone;
        if (file) company.logo = file.filename;

        // Save the updated company
        await company.save();
        
        return res.status(200).json(
            ApiResponse.success(company, "Company updated successfully")
        );
    }
);

export const deleteCompany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        
        // Find company by ID
        const company = await Company.findByPk(id);
        if (!company) {
            return next(
                new ApiError(
                    "Company not found",
                    404,
                    ErrorCodes.NOT_FOUND.code
                )
            );
        }
        
        // Delete company
        await company.destroy();
        
        return res.status(200).json(
            ApiResponse.success(null, "Company deleted successfully")
        );
    }
);
