// src/models/OrderBook.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IOrderBook extends Document {
  eventId: mongoose.Schema.Types.ObjectId;
  buyOrders: mongoose.Schema.Types.ObjectId[];
  sellOrders: mongoose.Schema.Types.ObjectId[];
}

const orderBookSchema: Schema = new Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  buyOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  sellOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const OrderBook = mongoose.model<IOrderBook>('OrderBook', orderBookSchema);
export default OrderBook;
