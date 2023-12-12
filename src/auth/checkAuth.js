'use strict';

const { BadRequestResponseError } = require('../core/error.response');
const { findById } = require('../services/apikey.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      throw new BadRequestResponseError('Forbidden Error');
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      throw new BadRequestResponseError();
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new BadRequestResponseError('Permission denied');
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new BadRequestResponseError('Permission denied');
    }
    return next();
  };
};

module.exports = { apiKey, permission };
