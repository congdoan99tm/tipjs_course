import { Document, Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'OtpLog';
const COLLECTION_NAME = 'otp_logs';

// Định nghĩa interface cho OtpDocument
export interface IOtpDocument extends Document {
  otp_token: string;
  otp_email: string;
  otp_status: 'pending' | 'active' | 'block';
  expireAt: Date;
}

// Khai báo Schema với TypeScript
const otpSchema = new Schema<IOtpDocument>(
  {
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'active', 'block'],
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 2,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Xuất mô hình OtpLog
const OtpLogModel = model<IOtpDocument>(DOCUMENT_NAME, otpSchema);

export default OtpLogModel;
