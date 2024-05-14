'use strict';

const { SuccessResponse } = require('../core/success.response');
const { listNotiByUser } = require('../services/notification.service');

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new List Notifications',
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
}
module.exports = new NotificationController();
