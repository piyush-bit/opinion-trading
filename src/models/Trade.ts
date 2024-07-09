import mongoose, { Document, Schema } from 'mongoose';

export interface ITrade extends Document {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  position: 'yes' | 'no';
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const TradeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  position: { type: String, enum: ['yes', 'no'], required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'executed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<ITrade>('Trade', TradeSchema);