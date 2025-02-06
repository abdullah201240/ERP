import express from "express";
import employeeRoute from "./employeeRoute";





const router = express.Router();

/**
 * Mount example routes under /api/v1/example
 */
router.use("/employee", employeeRoute);




export default router;
