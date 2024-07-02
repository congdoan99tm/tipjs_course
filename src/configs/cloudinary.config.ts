import cloudinary from 'cloudinary';

// Return "https" URLs by setting secure: true
cloudinary.v2.config({
  cloud_name: 'dspimljn7',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;
