// src/models/Event.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IEvent extends Document {
  title: string;
  description: string;
  date: Date; // This field signifies when the event is scheduled to occur
  imageUrls?: string[];
  createdBy: mongoose.Schema.Types.ObjectId;
  outcome: 'YES' | 'NO' | 'PENDING';
  qYes: number;
  qNo: number;
  b: number; // liquidity parameter for LMSR
}

const eventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrls: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  outcome: { type: String, enum: ['YES', 'NO', 'PENDING'], default: 'PENDING' },
  qYes: { type: Number, default: 0 },
  qNo: { type: Number, default: 0 },
  b: { type: Number, default: 1 } // Default liquidity parameter
}, {
  timestamps: true
});

const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;
