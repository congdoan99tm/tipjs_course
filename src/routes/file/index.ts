import express from 'express';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import fileController from '../../controllers/file.controller';

router.get('', asyncHandler(fileController.getCV));

export default router;
