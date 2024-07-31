import express from 'express';
import discountController from '../../controllers/discount.controller';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import { authenticationV2 } from '../../auth/authUtils';

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get(
  '/list_product_code',
  asyncHandler(discountController.getAllDiscountCodesWithProducts)
);

// Authentication

router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));

export default router;
