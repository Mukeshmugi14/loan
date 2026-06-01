import mongoose, { Schema, Document } from 'mongoose';

export interface IOtpVerification extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OtpVerificationSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired OTP records (e.g., after 5 minutes)
// Note: TTL index works on expiresAt, but it might take up to 60 seconds for MongoDB to run the cleanup task.
// We will also enforce the expiry strictly in the business logic.
OtpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtpVerification>('OtpVerification', OtpVerificationSchema, 'otp_verifications');
