import express from "express";
import employeeRoute from "./employeeRoute";
import companyRoute from "./companyRoute";






const router = express.Router();

/**
 * Mount example routes under /api/v1/example
 */
router.use("/employee", employeeRoute);
router.use("/company", companyRoute);





export default router;
