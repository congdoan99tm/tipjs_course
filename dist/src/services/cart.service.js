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
const cart_model_1 = __importDefault(require("../models/cart.model"));
const error_response_1 = require("../core/error.response");
const product_repo_1 = require("../models/repositories/product.repo");
/*
  Key features: Cart Service
  -  add product to cart [user]
  - reduce product quantity by one
  - increase product quantity by one
  - get cart
  - delete cart
  - delete cart item
  */
class CartService {
    ///  START REPO CART ////
    static createUserCart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, product }) {
            const query = { cart_userId: userId, cart_state: 'active' }, updateOrInsert = {
                $addToSet: {
                    cart_products: product,
                },
            }, options = {
                upsert: true,
                new: true,
            };
            return yield cart_model_1.default.findOneAndUpdate(query, updateOrInsert, options);
        });
    }
    static updateUserCartQuantity(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, product }) {
            const { productId, quantity } = product;
            const query = {
                cart_userId: userId,
                'cart_products.productId': productId,
                cart_state: 'active',
            }, updateSet = {
                $inc: {
                    'cart_products.$.quantity': quantity,
                },
            }, options = {
                upsert: true,
                new: true,
            };
            return yield cart_model_1.default.findOneAndUpdate(query, updateSet, options);
        });
    }
    ///  END REPO CART ////
    static addToCart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, product = {} }) {
            // check cart ton tai hay khong?
            const userCart = yield cart_model_1.default.findOne({ cart_userId: userId });
            if (!userCart) {
                // create cart for User
                return yield CartService.createUserCart({ userId, product });
            }
            //  neu co gio hang roi nhung chua co san pham
            if (!userCart.cart_products.length) {
                userCart.cart_products = [product];
                return yield userCart.save();
            }
            else {
                //  neu co gio hang roi nhung chua co san pham nay trong list
                const isObjectExists = userCart.cart_products.find((item) => item.productId === product['productId']);
                if (!isObjectExists) {
                    userCart.cart_products.push(product);
                    return yield userCart.save();
                }
            }
            // gio hang ton tai, va co san pham nay thi update quantity
            return yield CartService.updateUserCartQuantity({ userId, product });
        });
    }
    // update
    /*
      shop_order_ids:[
          shopId,
          item_products:[
              {
                  price,
                  shopId,
                  old_quantity,
                  quantity,
                  productId
              }
          ],
          version
      ]
  
      */
    static addToCartV2(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, shop_order_ids }) {
            var _b, _c;
            const { productId, quantity, old_quantity } = (_b = shop_order_ids[0]) === null || _b === void 0 ? void 0 : _b.item_products[0];
            // check product
            const foundProduct = yield (0, product_repo_1.getProductById)(productId);
            if (!foundProduct)
                throw new error_response_1.NotFoundError('Product not exists!');
            // compare
            if (foundProduct.product_shop.toString() !== ((_c = shop_order_ids[0]) === null || _c === void 0 ? void 0 : _c.shopId)) {
                throw new error_response_1.NotFoundError('Product do not belong to the shop');
            }
            if (quantity === 0) {
                // delete
            }
            return yield CartService.updateUserCartQuantity({
                userId,
                product: { productId, quantity: quantity - old_quantity },
            });
        });
    }
    static deleteUserCart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, productId }) {
            const query = { cart_userId: userId, cart_state: 'active' }, updateSet = {
                $pull: {
                    cart_products: {
                        productId,
                    },
                },
            };
            const deleteCart = yield cart_model_1.default.updateOne(query, updateSet);
            return deleteCart;
        });
    }
    static getListUserCart(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            return yield cart_model_1.default
                .findOne({
                cart_userId: +userId,
            })
                .lean();
        });
    }
}
exports.default = CartService;
