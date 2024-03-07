'user strict'

const InventoryService = require('../services/inventory.service')
const { SuccessResponse } = require('../core/success.response')

class InventoryController {
  /**
   * @description add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @url /v1/api/cart/user
   * @returns
   */
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: 'add Stock To Inventory success',
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res)
  }
}

module.exports = new InventoryController()
