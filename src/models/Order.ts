// src/models/Order.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  eventId: mongoose.Schema.Types.ObjectId;
  outcome: 'YES' | 'NO';
  shares: number;
  price: number;
  type: 'BUY' | 'SELL';
  status: 'OPEN' | 'CLOSED';
  timestamp: Date;
}

const orderSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  outcome: { type: String, enum: ['YES', 'NO'], required: true },
  shares: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
  timestamp: { type: Date, default: Date.now }
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
