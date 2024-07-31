import crypto from 'crypto';
import apikeyModel from '../models/apikey.model';

const findById = async (key) => {
  // const newKey = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // });
  // console.log(newKey);
  const objKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

export default findById;
