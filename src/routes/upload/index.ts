import express from 'express';
import uploadController from '../../controllers/upload.controller';
import asyncHandler from '../../helpers/asyncHandler';
const router = express.Router();

// const { authenticationV2 } = require('../../auth/authUtils')

// router.use(authenticationV2)
router.post('/product', asyncHandler(uploadController.uploadFile));

export default router;
