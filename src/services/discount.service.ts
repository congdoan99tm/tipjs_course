import { BadRequestError, NotFoundError } from '../core/error.response';
import discount from '../models/discount.model';
import { convertToObjectIdMongodb, removeUndefinedObject } from '../utils';
import { findAllProducts } from './product.service.xxx';
import {
  checkDiscountExist,
  findAllDiscountCodesUnselect,
} from '../models/repositories/discount.repo';
/*

   1 - Generator Discount Code [Shop  | Admin]
   2 - Get discount Amount
   3 - Get all discount codes [User | Shop]
   4 - Verify discount code [user]
   5- Delete discount code [Admin| Shop]
   6 - Cancel discount code [user]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;
    //kiem tra tinh hop le data
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError('Discount code has expired!');
    // }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end_date');
    }
    // create index for discount code
    const foundDiscount = await checkDiscountExist({
      code,
      shopId,
    });

    if (foundDiscount) throw new BadRequestError('Discount exists!');

    const newDiscount = await discount.create({
      discount_name: name,
      discount_descriptions: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }
  static async updateDiscountCode(id, body) {
    if (!body.code || !body.shopId) throw new BadRequestError('Invalid code or shopId');

    const foundDiscount = await checkDiscountExist({
      code: body.code,
      shopId: body.shopId,
    });

    if (!foundDiscount) throw new BadRequestError(`Discount Doesn't exists`);

    const newDiscount = await discount.findByIdAndUpdate(
      id,
      { $set: removeUndefinedObject(body) },
      { upsert: true, new: true }
    );
    return newDiscount;
  }

  static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
    const foundDiscount = await checkDiscountExist({
      code,
      shopId,
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exists!');
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let product;
    if (discount_applies_to === 'all') {
      // get all product
      product = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }
    if (discount_applies_to === 'specific') {
      // get the product ids
      product = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }
    return product;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discount,
    });
    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      code: codeId,
      shopId: shopId,
    });
    if (!foundDiscount) throw new NotFoundError(`Discount Doesn't exists!`);

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_users_used,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError(`discount expired!`);
    if (!discount_max_uses) throw new NotFoundError(`discount are out!`);

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // ) {
    //   throw new NotFoundError(`discount code has expired!`);
    // }

    //check xem co set gia tri toi thieu hay k.
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get tong gia tri don hang
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `discount requires a minium order value of ${discount_min_order_value}!`
        );
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUserDiscount) {
        // ....
        throw new NotFoundError(
          `Bạn đã sử dụng quá số lượng cho phép. Vui lòng thử lại sau.!`
        );
      }
    }

    // check xem discount nay la fixed amount hay
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      code: codeId,
      shopId: shopId,
    });
    if (!foundDiscount) throw new NotFoundError(`discount does'n't exist`);
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}

export default DiscountService;
