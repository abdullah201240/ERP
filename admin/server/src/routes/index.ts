import express from "express";
import employeeRoute from "./employeeRoute";
import companyRoute from "./companyRoute";
import sisterConcernRoute from "./sisterConcernRoute";







const router = express.Router();

/**
 * Mount example routes under /api/v1/example
 */
router.use("/employee", employeeRoute);
router.use("/company", companyRoute);
router.use("/sisterConcern", sisterConcernRoute);






export default router;
