import express from 'express'
import accessController from '../../controllers/access.controller'
const router = express.Router()
import asyncHandler from '../../helpers/asyncHandler'
import { authenticationV2 } from '../../auth/authUtils'

router.post('/shop/login', asyncHandler(accessController.login));

router.post('/shop/signup', asyncHandler(accessController.signUp));

// Authentication

router.use(authenticationV2);

router.post('/shop/logout', asyncHandler(accessController.logout));

router.post(
  '/shop/handleRefreshToken',
  asyncHandler(accessController.handleRefreshToken)
);

export default router;
