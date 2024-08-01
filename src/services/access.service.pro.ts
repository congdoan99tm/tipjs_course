import bcrypt = require('bcrypt');
import shopModel from '../models/shop.model';
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPairPro } from '../auth/authUtils.pro';
import { getInfoData } from '../utils/index';
import { BadRequestError, ConflictResponseError } from '../core/error.response';

// cách siêu cấp vip pro

class AccessServicePro {
  static signUp = async ({ name, email, password }) => {
    // step1: check email exists???
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already register');
    }
    const passwordHash = await bcrypt.hash(password, 1);
    const RoleShop = [];
    const newShop = await shopModel.create({
      name: name,
      email: email,
      password: passwordHash,
      roles: RoleShop,
    });
    if (newShop) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });
      if (!publicKeyString) {
        throw new BadRequestError('Error: PublicKey error');
      }

      console.log(`publicKeyString::`, publicKeyString);
      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      console.log(`publicKeyObject::`, publicKeyObject);

      const tokens = await createTokenPairPro(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey
      );
      console.log(`create token success::`, tokens);
      return {
        shop: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newShop,
        }),
        tokens,
      };
    }
    return null;
  };
}

export default AccessServicePro;
