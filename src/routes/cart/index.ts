import express from 'express'
import cartController from '../../controllers/cart.controller'
const router = express.Router()
import asyncHandler from '../../helpers/asyncHandler'


router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.listToCart))

export default router
