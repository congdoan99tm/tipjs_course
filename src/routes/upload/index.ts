import express from 'express';
import uploadController from '../../controllers/upload.controller';
import asyncHandler from '../../helpers/asyncHandler';
import { uploadDisk, uploadMemory } from '../../configs/multer.config';
const router = express.Router();

// const { authenticationV2 } = require('../../auth/authUtils')

// router.use(authenticationV2)
router.post('/product', asyncHandler(uploadController.uploadFile));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandler(uploadController.uploadFileThumb)
);
router.post(
  '/product/multiple',
  uploadDisk.array('file'),
  asyncHandler(uploadController.uploadMultiFile)
);
router.post(
  '/product/bucket',
  uploadMemory.single('file'),
  asyncHandler(uploadController.uploadImageFromLocalS3)
);

export default router;
