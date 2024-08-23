import crypto from 'crypto';
import apikeyModel from '../models/apikey.model';
import { BadRequestError } from '../core/error.response';

class ApiKeyService {
  static findById = async (key: string) => {
    const objKey = await apikeyModel.findOne({ key, status: true }).lean();
    return objKey;
  };

  static create = async (pass: string) => {
    const apiKeyPass = process.env.API_KEY_PASS;
    if (pass.toString() !== apiKeyPass) {
      throw new BadRequestError();
    }
    const newKey = await apikeyModel.create({
      key: crypto.randomBytes(64).toString('hex'),
      permissions: ['0000'],
    });
    return newKey;
  };
}

export default ApiKeyService;
