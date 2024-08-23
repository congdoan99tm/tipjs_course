"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../core/error.response");
const cart_repo_1 = __importDefault(require("../models/repositories/cart.repo"));
const product_repo_1 = require("../models/repositories/product.repo");
const discount_service_1 = __importDefault(require("./discount.service"));
const redis_service_1 = __importDefault(require("./redis.service"));
const order_model_1 = __importDefault(require("../models/order.model"));
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
    static checkoutReview(_a) {
        return __awaiter(this, arguments, void 0, function* ({ cartId, userId, shop_order_ids = [] }) {
            // check cartId ton tai khong?
            const foundCart = yield (0, cart_repo_1.default)(cartId);
            if (!foundCart)
                throw new error_response_1.BadRequestError('Cart does not exists!');
            const checkout_order = {
                totalPrice: 0, // tổng tiền hàng
                feeShip: 0, // phí vận chuyển(chưa làm)
                totalDiscount: 0, // tổng tiền giảm giá
                totalCheckout: 0, // tổng thanh toán.
            }, shop_order_ids_new = [];
            // tính tổng tiền bill
            for (let i = 0; i < shop_order_ids.length; i++) {
                const { shopId, shop_discounts = [], item_products = [], } = shop_order_ids[i];
                // check product available
                const checkProductServer = yield (0, product_repo_1.checkProductByServer)(item_products);
                if (!checkProductServer[0])
                    throw new error_response_1.BadRequestError('order wrong!!!');
                // tổng tiền đơn hàng
                const checkoutPrice = checkProductServer.reduce((acc, product) => {
                    return acc + product.quantity * product.price;
                }, 0);
                // tổng tiền trước khi xử li
                checkout_order.totalPrice += checkoutPrice;
                const itemCheckout = {
                    shopId,
                    shop_discounts,
                    priceRaw: checkoutPrice, // tiền trước khi giảm giá
                    priceApplyDiscount: checkoutPrice, // tiền sau khi giảm giá(để tạm)
                    item_products: checkProductServer,
                };
                // nếu shop_discounts tồn tại >0, check hợp lệ hay không?
                if (shop_discounts.length > 0) {
                    // giả sử chỉ có 1 discount
                    // get amount discount
                    const { totalPrice = 0, discount = 0 } = yield discount_service_1.default.getDiscountAmount({
                        codeId: shop_discounts[0].codeId,
                        userId,
                        shopId,
                        products: checkProductServer,
                    });
                    // tổng cộng discount giảm giá
                    checkout_order.totalDiscount += discount;
                    // Nếu tiền giảm giá lớn hơn 0
                    if (discount > 0) {
                        itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                    }
                }
                // tổng thanh toán cuối cùng
                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
                shop_order_ids_new.push(itemCheckout);
            }
            return {
                shop_order_ids,
                shop_order_ids_new,
                checkout_order,
            };
        });
    }
    static orderByUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {}, }) {
            const { shop_order_ids_new, checkout_order } = yield CheckoutService.checkoutReview({
                cartId,
                userId,
                shop_order_ids,
            });
            // check lại 1 lần nữa xem vượt tồn kho hay không?
            // get new array Products
            const products = shop_order_ids_new.flatMap((order) => order.item_products);
            const acquireProduct = [];
            for (let i = 0; i < products.length; i++) {
                const { productId, quantity } = products[i];
                const keyLock = yield redis_service_1.default.acquireLock({
                    productId,
                    quantity,
                    cartId,
                });
                acquireProduct.push(keyLock ? true : false);
                if (keyLock) {
                    yield redis_service_1.default.releaseLock(keyLock);
                }
            }
            // Check nếu có 1 sp hết hàng trong kho
            if (acquireProduct.includes(false)) {
                throw new error_response_1.BadRequestError('Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng');
            }
            const newOrder = yield order_model_1.default.create({
                order_userId: userId,
                order_checkout: checkout_order,
                order_shipping: user_address,
                order_payment: user_payment,
                order_products: shop_order_ids_new,
            });
            // trường hợp : Nếu insert thành công, thì remove product có trong cart
            if (newOrder) {
                // remove product in my cart
            }
            return newOrder;
        });
    }
    /*
      1, Query Orders [Users]
    */
    static getOrdersByUser() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /*
      1, Query Orders Using Id [Users]
    */
    static getOneOrderByUser() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /*
      1, Cancel Orders [Users]
    */
    static cancelOrderByUser() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /*
      1, Update Orders Status [Shop | Admin]
    */
    static updateOrderStatusByShop() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = CheckoutService;
