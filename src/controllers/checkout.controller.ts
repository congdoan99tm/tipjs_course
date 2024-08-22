'user strict';

import CheckoutService from '../services/checkout.service';
import { SuccessResponse } from '../core/success.response';

class CheckoutController {
  /**
   * @description add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @url /v1/api/cart/user
   * @returns
   */
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success',
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

export default new CheckoutController();
