import { model, Schema, Types } from 'mongoose'; // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    invent_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    invent_location: { type: String, default: 'unKnow' },
    invent_stock: { type: Number, require: true },
    invent_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    invent_reservations: { type: Array, default: [] },
    /*
    cardId:,
    stock:1,
    createdOn:
    */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default model(DOCUMENT_NAME, inventorySchema);
