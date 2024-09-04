import express from 'express';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import emailController from '../../controllers/email.controller';

router.post('/new_template', asyncHandler(emailController.newTemplate));

export default router;
