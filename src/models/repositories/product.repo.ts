import { ProductModel } from '../product.model';
import { Types } from 'mongoose';
import {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongodb,
} from '../../utils/index';
import { BadRequestError } from '../../core/error.response';

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await ProductModel.find(
    {
      isPublished: true,
      $text: { $search: keySearch }, //regexSearch
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return result;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await ProductModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundProduct) throw new BadRequestError('Product not Found');
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  if (modifiedCount != 1) throw new BadRequestError('Fail to Publish');

  return foundProduct;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await ProductModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundProduct) throw new BadRequestError('Product not Found');
  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  if (modifiedCount != 1) throw new BadRequestError('Fail to UnPublish');
  return foundProduct;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy: any = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await ProductModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await ProductModel.findById(product_id).select(
    unGetSelectData(unSelect)
  );
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
  select = '',
}) => {
  return await model
    .findByIdAndUpdate(
      productId,
      // bodyUpdate,
      { $set: { ...bodyUpdate } },
      { upsert: true, new: isNew }
    )
    .select(select)
    .lean();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await ProductModel.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const getProductById = async (productId) => {
  return await ProductModel.findOne({
    _id: convertToObjectIdMongodb(productId),
  }).lean();
};
const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

export {
  queryProduct,
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
};
