import { SuccessResponse } from '../core/success.response';
import uploadImageFromUrl from '../services/upload.service';

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: 'upload successfully uploaded',
      metadata: await uploadImageFromUrl,
    }).send(res);
  };
}

export default new UploadController();
