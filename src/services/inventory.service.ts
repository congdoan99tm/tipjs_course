import { BadRequestError } from '../core/error.response';
import inventory from '../models/inventory.model';
import { getProductById } from '../models/repositories/product.repo';

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '134, Tran Phu, HCM city',
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError('The product does not exists!');

    const query = { invent_shopId: shopId, invent_productId: productId },
      updateSet = {
        $inc: {
          invent_stock: stock,
        },
        $set: {
          invent_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

export default InventoryService;
