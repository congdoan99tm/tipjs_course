import express from 'express';
import InventoryController from '../../controllers/inventory.controller';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import { authenticationV2 } from '../../auth/authUtils';

router.use(authenticationV2);
router.post('', asyncHandler(InventoryController.addStockToInventory));

export default router;
