import { Schema, model, Document } from 'mongoose';
import slugify from 'slugify';

// Đặt tên cho document và collection
const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

// Định nghĩa interface cho TypeScript
interface ISpu extends Document {
  product_id: string; // nên là string để tránh đặt theo thứ tự 123... => k đoán dc số lượng sp
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_slug?: string;
  product_price: number;
  product_quantity: number;
  product_category: string[];
  product_shop: Schema.Types.ObjectId;
  product_attributes: Array<{
    attribute_id: number;
    attribute_values: {
      value_id: number;
    };
  }>;
  product_ratingsAverage?: number;
  product_variations: Array<{
    tier_variation: {
      images: string[];
      name: string;
      options: string[];
    };
  }>;
  isDraft: boolean;
  isPublished: boolean;
  isDeleted: boolean;
}

// Định nghĩa schema Mongoose
const spuSchema = new Schema<ISpu>(
  {
    product_id: { type: String, default: '' },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_category: { type: [String], default: [] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // 4.3334 => 4.3
      set: (val: number) => Math.round(val * 10) / 10,
    },
    product_variations: [
      {
        tier_variation: [
          {
            images: { type: [String], default: [] },
            name: { type: String, required: true },
            options: { type: [String], required: true },
          },
        ],
      },
    ],
    /*
       tier_variation:[
       {
         images: [],
         name: 'color',
         options: ['red', 'green']
       },
       {
         images: [],
         name: 'size',
         options: ['S', 'M']
       } 
       ]
    */
    isDraft: { type: Boolean, default: true, index: true, select: true },
    isPublished: { type: Boolean, default: false, index: true, select: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Tạo index cho tìm kiếm
spuSchema.index({ product_name: 'text', product_description: 'text' });

// Middleware: Chạy trước khi lưu (save) và tạo (create)
spuSchema.pre('save', function (next) {
  if (this.isModified('product_name')) {
    this.product_slug = slugify(this.product_name, { lower: true });
  }
  next();
});

// Tạo model
const SpuModel = model<ISpu>(DOCUMENT_NAME, spuSchema);

export default SpuModel;
