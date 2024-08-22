import express from 'express';
import checkoutController from '../../controllers/checkout.controller';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';

router.post('/review', asyncHandler(checkoutController.checkoutReview));

export default router;
