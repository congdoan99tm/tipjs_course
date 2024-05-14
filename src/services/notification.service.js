'use strict';

const notificationModel = require('../models/notification.model');
const shopModel = require('../models/shop.model');

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

const listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 1 }) => {
  const match = { receivedId: userId };
  if (type !== 'ALL') {
    match['type'] = type;
  }
  console.log(userId);
  console.log('hehe');
  const shopName = shopModel.findById(userId);
  console.log(shopName);
  return await notificationModel.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'Shop', // Collection chứa thông tin sản phẩm
        localField: 'options.product_name', // Trường trong collection hiện tại (notification) chứa id của sản phẩm
        foreignField: '_id', // Trường trong collection product chứa id của sản phẩm
        as: 'shopInfo', // Đặt tên cho kết quả của phép join
      },
    },
    {
      $project: {
        type: 1,
        senderId: 1,
        receivedId: 1,
        content: {
          $concat: [
            { $arrayElemAt: ['$shopInfo.name', 0] }, // Lấy tên của shop từ kết quả của phép join
            ' vừa mới thêm một sản phẩm mới: ',
            {
              $toString: '$options.product_name', // Chuyển đổi product_name thành chuỗi nếu nó không phải là chuỗi
            },
          ],
        },
        createAt: 1,
        options: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotiToSystem,
  listNotiByUser,
};
