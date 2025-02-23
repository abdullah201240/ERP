import express from "express";
import employeeRoute from "./employeeRoute";
import productRoute from "./product";

import meterialRoute from './meterial'



const router = express.Router();

/**
 * Mount example routes under /api/v1/example
 */
router.use("/employee", employeeRoute);
router.use("/product", productRoute);
router.use("/meterial", meterialRoute);




export default router;
