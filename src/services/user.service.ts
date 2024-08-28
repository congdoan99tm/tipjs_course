import CustomError from '../core/custom.error';
import { SuccessResponse } from '../core/success.response';
import userModel from '../models/user.model';

const newUser = async (email: String = null, captcha = null) => {
  // 1. check email exists in dbs
  const user = await userModel.findOne({ email }).lean();

  // 2. if exists
  if (user) {
    return new CustomError('Email already exists', 409);
  }

  return new SuccessResponse({
    message: 'verify email user',
    // metadata: { token },
  });
};
