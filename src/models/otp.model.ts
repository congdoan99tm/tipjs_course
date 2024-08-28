import mongoose, { Document, Schema } from 'mongoose';

const DOCUMENT_NAME = 'opt_log';
const COLLECTION_NAME = 'otp_logs';

export interface OtpDocument extends Document {
  otp_token: string;
  otp_email: string;
  otp_status: string;
  expireAt: Date;
}

const otpSchema = new Schema<OtpDocument>(
  {
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'active', 'block'],
    },
    expireAt: { type: Date, default: Date.now, expires: 60 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const otpModel = mongoose.model<OtpDocument>(DOCUMENT_NAME, otpSchema);

export default otpModel;
