import express from "express";
import employeeRoute from "./employeeRoute";
import projectRoute from "./projectRoute";
import siteVisitRoute from "./siteVisitRoute";



const router = express.Router();

/**
 * Mount example routes under /api/v1/example
 */
router.use("/employee", employeeRoute);
router.use("/projects", projectRoute);
router.use("/siteVisit", siteVisitRoute);



export default router;
