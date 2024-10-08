import { CACHE_PRODUCT } from '../configs/constant';
import { BadRequestError, ForbiddenError } from '../core/error.response';
import { getCache } from '../models/repositories/cache.repo';

const readCache = async (req, res, next) => {
  const { sku_id } = req.query;
  const skuKeyCache = `${CACHE_PRODUCT.SKU(sku_id)}`;
  let skuCache = await getCache(skuKeyCache);
  if (skuCache) {
    return res
      .status(200)
      .json({ ...JSON.parse(skuCache), toLoad: 'cache middleware' });
  }
  return next();
};

const validationOneSku = async (req, res, next) => {
  const { sku_id, product_id } = req.query;
  if (sku_id < 0 || product_id < 0) {
    return res.status(400).json(new BadRequestError('Not found sku_id'));
  }
  return next();
};

export { readCache, validationOneSku };
