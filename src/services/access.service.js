'use strict';
const bcrypt = require('bcrypt');
const shopModel = require('../models/shop.model');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const {
  BadRequestError,
  ConflictResponseError,
  ForbiddenError,
  AuthFailureError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
  SHOP: 'shop',
  WRITER: '0001',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};
class AccessService {
  //v2
  static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    var { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(`Something wrong happened !! Pls reLogin`);
    }
    if (keyStore.refreshToken != refreshToken)
      throw new AuthFailureError(`Shop not registered`);

    const foundShop = await findByEmail({ email: email });
    if (!foundShop) throw new AuthFailureError(`Shop not registered 2`);
    // Create 1 cap moi
    const tokens = await createTokenPair(
      { userId: userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // da duoc su dung.
      },
    });
    return {
      user,
      tokens,
    };
  };

  static handleRefreshToken = async (refreshToken) => {
    // check this token used?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // neu co
    if (foundToken) {
      // decode xem thang ml nao?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });
      //xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(`Something wrong happened !! Pls reLogin`);
    }
    // Chua co?
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    // Neu k thay
    if (!holderToken) throw new AuthFailureError(`Shop not registered 1`);
    // Verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log(email);
    // Check userId
    const foundShop = await findByEmail({ email: email });
    if (!foundShop) throw new AuthFailureError(`Shop not registered 2`);
    // Create 1 cap moi
    const tokens = await createTokenPair(
      { userId: userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // da duoc su dung.
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    //1. check Email
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not registered!');
    //2. check pass
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new BadRequestError('Authentication error');
    //3. create keys
    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');
    //4. generate tokens

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId: userId, email: email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step1: check email exists???
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop already register');
    }
    const passwordHash = await bcrypt.hash(password, 1);

    const newShop = await shopModel.create({
      name: name,
      email: email,
      password: passwordHash,
      roles: RoleShop,
    });
    if (newShop) {
      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError('Error: PublicKey error');
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
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

module.exports = AccessService;
