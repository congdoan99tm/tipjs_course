import { SuccessResponse } from '../core/success.response';
import {
  checkLoginEmailTokenService,
  newUserService,
} from '../services/user.service';

class UserController {
  newUser = async (req, res, next) => {
    const respond = await newUserService({
      email: req.body.email,
    });
    new SuccessResponse(respond).send(res);
  };

  checkLoginEmailToken = async (req, res, nest) => {
    const { token = null } = req.query;
    const respond = await checkLoginEmailTokenService({
      token,
    });
    new SuccessResponse(respond).send(res);
  };
}

export default new UserController();
