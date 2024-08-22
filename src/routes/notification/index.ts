import express from 'express';
import notificationController from '../../controllers/notification.controller';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import { authenticationV2 } from '../../auth/authUtils';
// Here not login
// Authentication

router.use(authenticationV2);

router.get('', asyncHandler(notificationController.listNotiByUser));

export default router;
