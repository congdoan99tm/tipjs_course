import inventory from '../inventory.model';
import { Types } from 'mongoose';
import { convertToObjectIdMongodb } from '../../utils';

const insertInventory = async ({ productId, shopId, stock, location = 'unKnow' }) => {
  return await inventory.create({
    invent_productId: productId,
    invent_shopId: shopId,
    invent_location: location,
    invent_stock: stock,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      invent_productId: convertToObjectIdMongodb(productId),
      invent_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        invent_stock: -quantity,
      },
      $push: {
        invent_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };
  return await inventory.updateOne(query, updateSet);
};
export default { insertInventory, reservationInventory };
