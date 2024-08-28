import { randomInt } from 'crypto';
import otpModel, { OtpDocument } from '../models/otp.model';

const _generatorTokenRandom = () => {
  const token = randomInt(0, Math.pow(2, 32));
  return token;
};

const newOtp = async (email: String): Promise<OtpDocument> => {
  const token = _generatorTokenRandom();
  const newToken = await otpModel.create({
    otp_token: token,
    otp_email: email,
  });
  return newToken;
};

export default newOtp;
