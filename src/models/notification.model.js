'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: order successfully
// ORDER-002: order fail
// PROMOTION-001: bew PROMOTION
// SHOP-001: new product by user following

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
      require: true,
    },
    senderId: { type: Schema.Types.ObjectId, require: true, ref: 'Shop' },
    receivedId: { type: Number, require: true },
    content: { type: String, require: true },
    options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
