import { BadRequestError } from '../core/error.response';
import { CREATED, SuccessResponse } from '../core/success.response';
import apikeyService from '../services/apikey.service';

class ApiKeyController {
  create = async (req, res, next) => {
    try {
      new SuccessResponse({
        metadata: await apikeyService.create(req.body['pass']),
      }).send(res);
    } catch (error) {
      throw new BadRequestError(`${error}`);
    }
  };
}

export default new ApiKeyController();
