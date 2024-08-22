import express from 'express';
import commentController from '../../controllers/comment.controller';
const router = express.Router();
import asyncHandler from '../../helpers/asyncHandler';
import { authenticationV2 } from '../../auth/authUtils';

// Authentication

router.use(authenticationV2);

router.post('', asyncHandler(commentController.createComment));
router.get('', asyncHandler(commentController.getCommentsByParentId));

export default router;
