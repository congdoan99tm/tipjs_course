import { model, Schema } from 'mongoose'; // Erase if already required

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';
// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'complete', 'failed', 'pending'],
      default: 'active',
    },
    cart_products: { type: Array, required: true, default: [] },
    /*
     [
        {
          productId,
          shopId,
          quantity:
          name: 
          price:
        }
     ]
    */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },
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
export default model(DOCUMENT_NAME, cartSchema);
