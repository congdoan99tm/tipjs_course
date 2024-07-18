// 1. Upload from url image

import cloudinary from '../configs/cloudinary.config';
import {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand,
} from '../configs/s3.config';
import crypto from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const randomImageName = () => crypto.randomBytes(16).toString('hex');
const urlImagePublic = 'https://d2my2g1tccak51.cloudfront.net';

const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: 'image/jpeg',
    });

    const signedUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });
    const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });

    const url2 = `${urlImagePublic}/${command.input.Key}`;

    const result = await s3.send(command);
    return {
      image_url: url2,
      shopId: 8409,
      thumb_url: await cloudinary.url(result['public_id'], {
        height: 100,
        width: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.error(`Error uploading image use S3Client:: ${error}`);
    throw error;
  }
};

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      'https://down-vn.img.susercontent.com/file/5406162374d7bbd35f41d32826c0721b';
    const folderName = 'product/shopId',
      newFileName = 'testDemo';
    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });
    return result;
  } catch (error) {
    console.error(`Error uploading image:: ${error}`);
  }
};
const uploadImageFromLocal = async ({ path, folderName = 'product/8409' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName,
    });
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.error(`Error uploading image:: ${error}`);
  }
};
const uploadMultiImageFromLocal = async ({
  files,
  folderName = 'product/8409',
}) => {
  try {
    console.log(`files::`, files, folderName);
    if (!files.length) return;
    const uploadUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });
      uploadUrls.push({
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg',
        }),
      });
    }
    return uploadUrls;
  } catch (error) {
    console.error(`Error uploading image:: ${error}`);
  }
};

export {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultiImageFromLocal,
  uploadImageFromLocalS3,
};
