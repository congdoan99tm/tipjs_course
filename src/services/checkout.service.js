'use strict'
const { BadRequestError } = require('../core/error.response')
const { findCartById } = require('../models/repositories/cart.repo')
const { checkProductByServer } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')
const { order } = require('../models/order.model')

class CheckoutService {
  /*
{
    cartId,
    userId,
    shop_order_ids:[
        {
        shopId,
        shop_discounts:[],
        item_products:[
            {
            price,
            quantity,
            productId,
        },
               {
        shopId,
        shop_discounts:[
            {
                "shopId",
                "discountId",
                "codeId":
            }
        ],
        item_products:[
            {
            price,
            quantity,
            productId,
        },
    ]
    },
    ]
}
*/

  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    // check cartId ton tai khong?
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new BadRequestError('Cart does not exists!')

    const checkout_order = {
        totalPrice: 0, // tổng tiền hàng
        feeShip: 0, // phí vận chuyển(chưa làm)
        totalDiscount: 0, // tổng tiền giảm giá
        totalCheckout: 0, // tổng thanh toán.
      },
      shop_order_ids_new = []

    // tính tổng tiền bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i]
      // check product available
      const checkProductServer = await checkProductByServer(item_products)
      if (!checkProductServer[0]) throw new BadRequestError('order wrong!!!')
      // tổng tiền đơn hàng
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)
      // tổng tiền trước khi xử li
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tiền trước khi giảm giá
        priceApplyDiscount: checkoutPrice, // tiền sau khi giảm giá(để tạm)
        item_products: checkProductServer,
      }
      // nếu shop_discounts tồn tại >0, check hợp lệ hay không?
      if (shop_discounts.length > 0) {
        // giả sử chỉ có 1 discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        })
        // tổng cộng discount giảm giá
        checkout_order.totalDiscount += discount
        // Nếu tiền giảm giá lớn hơn 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }
      // tổng thanh toán cuối cùng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    }
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      })

    // check lại 1 lần nữa xem vượt tồn kho hay không?
    // get new array Products
    const products = shop_order_ids_new.flatMap((order) => order.item_products)
    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await acquireLock({ productId, quantity, cartId })
      acquireProduct.push(keyLock ? true : false)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    // Check nếu có 1 sp hết hàng trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        'Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng'
      )
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    })

    // trường hợp : Nếu insert thành công, thì remove product có trong cart
    if (newOrder) {
      // remove product in my cart
    }
    return newOrder
  }

  /*
    1, Query Orders [Users]
  */
  static async getOrdersByUser() {}
  /*
    1, Query Orders Using Id [Users]
  */
  static async getOneOrderByUser() {}
  /*
    1, Cancel Orders [Users]
  */
  static async cancelOrderByUser() {}

  /*
    1, Update Orders Status [Shop | Admin]
  */
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService
