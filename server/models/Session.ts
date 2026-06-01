import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshTokenHash: string;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
    },
    deviceInfo: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISession>('Session', SessionSchema);
