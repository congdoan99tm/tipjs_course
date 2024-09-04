// import { model, Schema } from 'mongoose'; // Erase if already required

// const DOCUMENT_NAME = 'Discount';
// const COLLECTION_NAME = 'discounts';
// // Declare the Schema of the Mongo model
// const discountSchema = new Schema(
//   {
//     discount_name: { type: String, require: true },
//     discount_descriptions: { type: String, required: true },
//     discount_type: { type: String, default: 'fixed_amount' }, // percentage
//     discount_value: { type: Number, required: true }, // 10.00 , 10
//     discount_max_value: { type: Number, required: true }, // 10.00 , 10
//     discount_code: { type: String, require: true }, //ma giam gia
//     discount_start_date: { type: Date, required: true }, // ngay bat dau
//     discount_end_date: { type: Date, required: true }, // ngay ket thuc
//     discount_max_uses: { type: Number, required: true }, // so luong discount dc ap dung.
//     discount_uses_count: { type: Number, required: true }, // so discount da su dung
//     discount_users_used: { type: Array, default: [] }, // ai da su dung
//     discount_max_uses_per_user: { type: Number, required: true }, // so luong cho phep toi da dc su dung moi user.
//     discount_min_order_value: { type: Number, required: true },
//     discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

//     discount_is_active: { type: Boolean, default: true },
//     discount_applies_to: {
//       type: String,
//       required: true,
//       enum: ['all', 'specific'],
//     },
//     discount_product_ids: { type: Array, default: [] }, // so sp dc ap dung
//     expireAt: {
//       type: Date,
//       default: Date.now,
//       expires: 180,
//     },
//   },
//   {
//     timestamps: true,
//     collection: COLLECTION_NAME,
//   }
// );

// //Export the model
// export default model(DOCUMENT_NAME, discountSchema);

import mongoose, { Document, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Định nghĩa interface cho DiscountDocument
export interface IDiscountDocument extends Document {
  discount_name: string;
  discount_descriptions: string;
  discount_type: string; // 'fixed_amount' hoặc 'percentage'
  discount_value: number; // Ví dụ: 10.00
  discount_max_value: number; // Ví dụ: 10.00
  discount_code: string; // Mã giảm giá
  discount_start_date: Date; // Ngày bắt đầu
  discount_end_date: Date; // Ngày kết thúc
  discount_max_uses: number; // Số lượng giảm giá được áp dụng
  discount_uses_count: number; // Số giảm giá đã sử dụng
  discount_users_used: string[]; // Danh sách người đã sử dụng (ID người dùng)
  discount_max_uses_per_user: number; // Số lượng tối đa cho phép mỗi người dùng
  discount_min_order_value: number; // Giá trị đơn hàng tối thiểu
  discount_shopId: mongoose.Schema.Types.ObjectId; // ID của cửa hàng
  discount_is_active: boolean; // Trạng thái kích hoạt
  discount_applies_to: 'all' | 'specific'; // Áp dụng cho tất cả hoặc cụ thể
  discount_product_ids: mongoose.Schema.Types.ObjectId[]; // Danh sách ID sản phẩm
  expireAt: Date; // Thời gian hết hạn
}

// Khai báo Schema với TypeScript
const discountSchema = new Schema<IDiscountDocument>(
  {
    discount_name: { type: String, required: true },
    discount_descriptions: { type: String, required: true },
    discount_type: {
      type: String,
      default: 'fixed_amount',
      enum: ['fixed_amount', 'percentage'],
    },
    discount_value: { type: Number, required: true },
    discount_max_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true },
    discount_users_used: { type: [String], default: [] },
    discount_max_uses_per_user: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: { type: [Schema.Types.ObjectId], default: [] },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 5,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Xuất mô hình Discount
const DiscountModel = mongoose.model<IDiscountDocument>(
  DOCUMENT_NAME,
  discountSchema
);

export default DiscountModel;
