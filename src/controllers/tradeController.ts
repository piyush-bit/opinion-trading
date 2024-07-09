// src/controllers/tradeController.ts
import { Request, Response } from 'express';
import Trade from '../models/Trade';
import Order from '../models/Order';
import Event from '../models/Event';
import { calculatePrice } from '../utils/ammUtils';

export const buyShares = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId, outcome, shares } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.date <= new Date()) {
      res.status(400).json({ message: 'Event has already occurred' });
      return;
    }

    const price = calculatePrice(event, outcome, shares);
    // Deduct user coins and add shares to UserShares
    // (Implementation details depend on your wallet service)

    const order = new Order({ userId, eventId, outcome, shares, price, type: 'BUY' });
    await order.save();

    res.status(201).json(order);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

export const sellShares = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId, outcome, shares } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.date <= new Date()) {
      res.status(400).json({ message: 'Event has already occurred' });
      return;
    }

    const price = calculatePrice(event, outcome, shares);
    // Add coins to user wallet and subtract shares from UserShares
    // (Implementation details depend on your wallet service)

    const order = new Order({ userId, eventId, outcome, shares, price, type: 'SELL' });
    await order.save();

    res.status(201).json(order);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// src/controllers/tradeController.ts (continued)
import OrderBook from '../models/OrderBook';

const matchOrder = async (newOrder: any) => {
  const orderBook = await OrderBook.findOne({ eventId: newOrder.eventId });
  if (!orderBook) {
    const newOrderBook = new OrderBook({
      eventId: newOrder.eventId,
      buyOrders: newOrder.type === 'BUY' ? [newOrder._id] : [],
      sellOrders: newOrder.type === 'SELL' ? [newOrder._id] : []
    });
    await newOrderBook.save();
    return;
  }

  if (newOrder.type === 'BUY') {
    const sellOrders = orderBook.sellOrders.filter(order => order.price <= newOrder.price);
    if (sellOrders.length > 0) {
      // Execute trades here and update the order book
    } else {
      orderBook.buyOrders.push(newOrder._id);
    }
  } else {
    const buyOrders = orderBook.buyOrders.filter(order => order.price >= newOrder.price);
    if (buyOrders.length > 0) {
      // Execute trades here and update the order book
    } else {
      orderBook.sellOrders.push(newOrder._id);
    }
  }

  await orderBook.save();
};
