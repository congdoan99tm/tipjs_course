import express from 'express';
import uploadController from '../../controllers/upload.controller';
import asyncHandler from '../../helpers/asyncHandler';
import { uploadDisk } from '../../configs/multer.config';
const router = express.Router();

// const { authenticationV2 } = require('../../auth/authUtils')

// router.use(authenticationV2)
router.post('/product', asyncHandler(uploadController.uploadFile));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadFileThumb)
);

export default router;
