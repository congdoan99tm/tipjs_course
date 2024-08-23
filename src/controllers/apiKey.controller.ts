import { CREATED, SuccessResponse } from '../core/success.response';
import apikeyService from '../services/apikey.service';

class ApiKeyController {
  create = async (req, res, next) => {
    new SuccessResponse({
      metadata: await apikeyService.create(req.body['pass']),
    }).send(res);
  };
}

export default new ApiKeyController();
