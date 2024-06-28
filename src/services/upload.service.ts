// 1. Upload from url image

import cloudinary from '../configs/cloudinary.config';

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      'https://down-vn.img.susercontent.com/file/5406162374d7bbd35f41d32826c0721b';
    const folderName = 'product/shopId',
      newFileName = 'testDemo';
    const result = await cloudinary.v2.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });
    console.log(result);
  } catch (error) {
    console.error(`Error uploading image:: ${error}`);
  }
};

export default uploadImageFromUrl;
