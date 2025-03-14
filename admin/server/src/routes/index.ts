import express from "express";
import companyRoute from "./companyRoute";
import sisterConcernRoute from "./sisterConcernRoute";
import accessRoutes from "./accessRoutes";







const router = express.Router();

/**
 * Mount example routes under /api/v1/example
 */
router.use("/company", companyRoute);
router.use("/sisterConcern", sisterConcernRoute);

router.use("/access", accessRoutes);





export default router;
