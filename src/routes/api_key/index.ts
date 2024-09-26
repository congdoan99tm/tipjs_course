import express from 'express';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import apiKeyController from '../../controllers/apiKey.controller';

router.post('/create', asyncHandler(apiKeyController.create));

export default router;
