import express from "express";
import { verifyJWT } from "../middleware/auth"; 
import { createAssignedTo, createDegineBOQ, createDesignPlan, createProject, createService, degineBOQPart, degineInvoiceCreate, deleteAssignedTo, deleteDegineBOQById, deleteDegineBOQPartById, deleteDesignInvoice, deleteDesignPlan, deleteProject, deleteService, getAllBOQ, getDesignPlans, getDesignPlansProject, getProjectById, getProjectsPaginated, updateCompletionPercentage, updateDegineBOQById, updateDesignPlan, updateProject, updateService, viewAllDegineBOQPart, viewAllDegineBOQs, viewAllDegineInvoice, viewAllDegineInvoiceById, viewAllServices, viewDegineBOQById, viewServiceById } from "../controllers/projectController";

const router = express.Router();

// Route to create a new project
router.post('/create-project', verifyJWT, createProject);
router.put("/project/:id",verifyJWT, updateProject); // Add update route

// Route to fetch all projects
router.get('/view-all-projects/:id', getProjectsPaginated);



// Route to fetch a specific project by ID
router.get('/project/:id',verifyJWT, getProjectById);

// Route to delete a project by ID
router.delete('/delete-project/:id', verifyJWT, deleteProject);
router.delete('/delete-assigned/:id', verifyJWT, deleteAssignedTo);
router.post('/create-assignedTo', verifyJWT, createAssignedTo);

router.post('/designPlan', verifyJWT, createDesignPlan);
router.get('/designPlan',verifyJWT, getDesignPlans);
router.get('/designPlanProject', getDesignPlansProject);



// Delete Design Plan
router.delete("/designPlan/:id",verifyJWT, deleteDesignPlan);
router.delete("/designBoqPart/:id",verifyJWT, deleteDegineBOQPartById);


// Update Design Plan
router.put("/designPlan/:id",verifyJWT, updateDesignPlan);

router.put('/designplans/:id',verifyJWT, updateCompletionPercentage);

// Route to create a new service
router.post('/services',verifyJWT, createService);

// Route to get all services
router.get('/services', viewAllServices);

// Route to get a service by ID
router.get('/services/:id',verifyJWT, viewServiceById);

// Route to update a service by ID
router.put('/services/:id', verifyJWT,updateService);

// Route to delete a service by ID
router.delete('/services/:id', verifyJWT,deleteService);


// Route to create a new DegineBOQ
router.post('/degineBOQ',verifyJWT, createDegineBOQ);

// Route to get all DegineBOQs
router.get('/degineBOQ', viewAllDegineBOQs);

router.get('/getAllBOQ/:id', getAllBOQ);




// Route to get a single DegineBOQ by ID
router.get('/degineBOQ/:id', viewDegineBOQById);

// Route to update a DegineBOQ by ID
router.put('/degineBOQ/:id', verifyJWT,updateDegineBOQById);

// Route to delete a DegineBOQ by ID
router.delete('/degineBOQ/:id',verifyJWT, deleteDegineBOQById);



router.post('/degineBOQPart',verifyJWT, degineBOQPart);
router.get('/degineBOQPart/:boqId', viewAllDegineBOQPart);

router.post('/degineInvoice',verifyJWT, degineInvoiceCreate);

router.get('/degineInvoice/:boqId', viewAllDegineInvoice);

router.get('/degineInvoiceById/:id', viewAllDegineInvoiceById);

router.delete('/degineInvoice/:id', deleteDesignInvoice);



export default router;
