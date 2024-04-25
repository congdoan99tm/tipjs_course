'use strict';

const notificationModel = require('../models/notification.model');

const pushNotiToSystem = async ({
  type = 'SHOP-001',
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let content;
  if (type === 'SHOP-001') {
    content = `@@@ vừa mới thêm một sản phẩm: @@@@`;
  } else if (type === 'PROMOTION-001') {
    content = `@@@ vừa mới thêm một voucher: @@@@`;
  }

  const newNoti = await notificationModel.create({
    type,
    content,
    senderId,
    receivedId,
    options,
  });
return newNoti;
};

module.exports = {
  pushNotiToSystem,
};
