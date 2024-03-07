'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')
const { BadRequestError } = require('../core/error.response')

const convertToObjectIdMongodb = (Id) => new Types.ObjectId(Id)

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}
// Bảo toàn dữ liệu, tránh mất dữ liệu khi req = null
const removeUndefinedObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  Object.keys(obj).forEach((key) => {
    obj[key] = removeUndefinedObject(obj[key])
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
  })
  return obj
}
/// Update , giữ các data cũ.( $set{bodyUpdate})
const updateNestedObjectParser = (obj) => {
  // if (obj === null || obj === undefined) return obj;
  const final = {}
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k])
      // if(response === null) return
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      final[k] = obj[k]
    }
  })
  console.log(final)
  return final
}

const checkRequiredFields = (payload, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !(field in payload))

  if (missingFields.length > 0) {
    const errorMessage = `Thiếu các trường bắt buộc: ${missingFields.join(
      ', '
    )}`
    throw new BadRequestError(errorMessage)
  }
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
  checkRequiredFields,
}
