import { NotFoundError } from '../core/error.response';
import findShopById from '../models/repositories/shop.repo';
import SpuModel from '../models/spu.model';
import { randomProductId } from '../utils';
import newSku from './sku.service';

const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_slug,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  try {
    // 1. check if Shop exists

    const foundShop = await findShopById({ shop_id: product_shop });
    console.log(foundShop);

    if (!foundShop) throw new NotFoundError(`Shop not found`);

    // 2. create a new SPU
    const spu = await SpuModel.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_slug,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });
    // 3 get spu_id add to sku.service
    if (spu && sku_list.length > 0) {
      // 3. create skus
      newSku({ sku_list, spu_id: spu.product_id }).then();
    }
    // 4. sync data via elasticsearch (search.service)
    // 5. respond result object

    return !!spu;
  } catch (error) {
    console.error(`newSpu Error: ${error}`);
    throw error;
  }
};

export default newSpu;
