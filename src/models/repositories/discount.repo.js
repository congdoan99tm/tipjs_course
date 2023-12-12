const { discount } = require('../discount.model');
const { unGetSelectData, getSelectData } = require(`../../utils`);

const checkDiscountExist = async ({ code, shopId }) => {
  // const foundDiscount = await model.findOne(filter).lean();
  const foundDiscount = await discount
    .findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDb(shopId),
    })
    .lean();

  return foundDiscount;
};

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean();
  return documents;
};

module.exports = {
  checkDiscountExist,
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
};
