'user strict';

import CartService from '../services/cart.service';
import { SuccessResponse } from '../core/success.response';

class CartController {
  /**
   * @description add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @url /v1/api/cart/user
   * @returns
   */
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };
  // update + -
  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Cart success',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Cart success',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List Cart success',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

export default new CartController();
