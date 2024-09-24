import { Schema, model, Document } from 'mongoose';
import slugify from 'slugify';

// Đặt tên cho document và collection
const DOCUMENT_NAME = 'Sku';
const COLLECTION_NAME = 'Skus';

// Định nghĩa interface cho TypeScript
interface ISku {
  sku_id: string;
  sku_tier_idx: number[];
  sku_default: boolean;
  sku_slug: string;
  sku_sort: number;
  sku_price: string;
  sku_stock: number;
  product_id: string;
}
// Định nghĩa schema Mongoose
const skuSchema = new Schema<ISku>(
  {
    sku_id: { type: String, require: true, unique: true },
    sku_tier_idx: { type: [Number], default: [0] }, // [1,0], [1,1]
    /*
    color = [red,green] = [0,1]
    size = [S,M]= [0,1]
    red + M = [0,1]
    */
    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: '' },
    sku_sort: { type: Number, default: 0 }, // mức độ ưu tiên tìm kiếm
    sku_price: { type: String, require: true },
    sku_stock: { type: Number, default: 0 },
    product_id: { type: String, required: true }, //ref to spu product
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Tạo model
const SkuModel = model<ISku>(DOCUMENT_NAME, skuSchema);

export default SkuModel;
