import { SuccessResponse } from '../core/success.response';
import {
  uploadImageFromLocal,
  uploadImageFromUrl,
} from '../services/upload.service';
import { BadRequestError } from '../core/error.response';

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: 'upload successfully uploaded',
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('File missing');
    }
    new SuccessResponse({
      message: 'upload successfully uploaded',
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
}

export default new UploadController();
