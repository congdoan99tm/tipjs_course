import express from 'express';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import userController from '../../controllers/user.controller';

router.post('/new_user', asyncHandler(userController.newUser));
router.get('/welcome-back', asyncHandler(userController.checkLoginEmailToken));

export default router;
