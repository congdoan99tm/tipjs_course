// 1. Upload from url image

import cloudinary from '../configs/cloudinary.config';

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

export { uploadImageFromUrl, uploadImageFromLocal };
