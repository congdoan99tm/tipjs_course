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
    content = `${options.shop_name} vừa thêm một sản phẩm mới: ${options.product_name}`;
  } else if (type === 'PROMOTION-001') {
    content = `${options.shop_name} vừa thêm một voucher mới: @@@@`;
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

const listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 1 }) => {
  const match = { receivedId: userId };
  if (type !== 'ALL') {
    match['type'] = type;
  }
  return await notificationModel.aggregate([
    {
      $match: match,
    },
    // {
    //   $project: {
    //     type: 1,
    //     senderId: 1,
    //     receivedId: 1,
    //     content: {
    //       $concat: [
    //         { $substr: ['$options.shop_name', 0, -1] },
    //         ' vừa mới thêm một sản phẩm mới: ',
    //         {
    //           $substr: ['$options.product_name', 0, -1],
    //         },
    //       ],
    //     },
    //     createAt: 1,
    //     options: 1,
    //   },
    // },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
