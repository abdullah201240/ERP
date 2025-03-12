import express from 'express';
import { assignAccess, revokeAccess,viewAllAccess,viewAccessById } from '../controllers/accessController';

const router = express.Router();

router.post('/assign',  assignAccess);
router.post('/revoke', revokeAccess);
// View all access records
router.get('/view-all/:employee_id', viewAllAccess);

// View access by employee_id and permission_id
router.get('/view/:employee_id/:permission_id', viewAccessById);

export default router;
