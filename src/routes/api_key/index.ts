import express from 'express';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import ApiKeyController from '../../controllers/apiKey.controller';

router.post('/create', asyncHandler(ApiKeyController.create));

export default router;
