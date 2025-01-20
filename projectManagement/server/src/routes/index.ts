import express from "express";
import employeeRoute from "./employeeRoute";
import projectRoute from "./projectRoute";


const router = express.Router();

/**
 * Mount example routes under /api/v1/example
 */
router.use("/employee", employeeRoute);
router.use("/projects", projectRoute);


export default router;
