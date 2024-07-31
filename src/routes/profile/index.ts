import express from 'express';
const router = express.Router();
import grantAccess from '../../middleware/rbac';
import ProfileController from '../../controllers/profile.controller';

// admin

router.get('/viewAny', grantAccess('readAny', 'profile'), ProfileController.profiles);

// shop

router.get('/viewOwn', grantAccess('readOwn', 'profile'), ProfileController.profile);

export default router;
