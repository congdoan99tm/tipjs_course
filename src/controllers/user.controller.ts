import { SuccessResponse } from '../core/success.response';
import newUserService from '../services/user.service';

class UserController {
  newUser = async (req, res, next) => {
    const respond = await newUserService({
      email: req.body.email,
    });
    new SuccessResponse(respond).send(res);
  };

  checkRegisterEmailToken = async () => {};
}

export default new UserController();
