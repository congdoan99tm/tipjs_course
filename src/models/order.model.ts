import { model, Schema } from 'mongoose'; // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';
// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
       order_checkout:={
        totalPrice,
        totalApplyDiscount,
        feeShip,
       }
    */
    order_shipping: { type: Object, default: {} },
    /*
    street,
    city,
    state,
    country
    */
    order_payment: { type: Object, default: {} },
    order_product: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#0000104012024' },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'shipped', 'canceled', 'delivered'],
      default: 'pending',
    },
  },
  {
    timestamps: {
      createdAt: 'createOn',
      updatedAt: 'modifiedOn',
    },
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default model(DOCUMENT_NAME, orderSchema);
