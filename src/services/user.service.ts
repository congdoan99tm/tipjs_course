import CustomError from '../core/custom.error';
import { SuccessResponse } from '../core/success.response';
import userModel from '../models/user.model';
import emailService from './email.service';
import { checkEmailToken } from './otp.service';

const newUserService = async ({ email = null, captcha = null }) => {
  // 1. check email exists in dbs
  const user = await userModel.findOne({ email }).lean();

  // 2. if exists
  if (user) {
    return new CustomError('Email already exists', 409);
  }

  // 3. send token via email user
  const result = await emailService.sendEmailToken({ email });
  console.log(result);

  return {
    message: 'verify email user',
    metadata: { token: result },
  };
};

const checkLoginEmailTokenService = async (tokenInput) => {
  try {
    // 1. check token in mode opt
    const { otp_email: email, otp_token: token } = await checkEmailToken({
      token: tokenInput,
    });
  } catch (error) {
    console.error(``);
  }
};
export { newUserService, checkLoginEmailTokenService };
